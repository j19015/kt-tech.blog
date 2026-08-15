// 一覧カード用のサムネイルを R2 に用意するスクリプト。
//
// アイキャッチは 1376x768 / 約 58KB で R2 に置いてあり、記事ページのヒーローでは
// その大きさが要る。一方カードでの表示は 96〜128px しかないのに、
// next.config.js が `images.unoptimized: true`（Cloudflare Pages では
// Next.js の画像最適化が動かない）なので、原寸がそのまま配信されていた。
// Lighthouse の "Properly size images" が 426KB の削減余地を出していたのはこれ。
//
// ここでは既存のアイキャッチから幅 320px の版を作り、
// `images/eyecatch/thumb/<name>.webp` として同じバケットに置く。
// 参照側は src/lib/eyecatch.ts の thumbnailUrl() を使う。
//
//   node scripts/generate-eyecatch-thumbnails.mjs [--dry-run] [--force]
//
// --dry-run: 生成せず対象だけ表示する
// --force  : 既にサムネイルがあっても作り直す

import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { readFileSync } from 'fs';

// .env.local を手動パース（generate-eyecatch.mjs と同じ方式）
const envFile = readFileSync('.env.local', 'utf-8');
envFile.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx === -1) return;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim();
  if (key && val) process.env[key] = val;
});

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY;
const R2_SECRET_KEY = process.env.R2_SECRET_KEY;
const BUCKET = process.env.NEXT_PUBLIC_BUCKET_NAME;
const BUCKET_URL = process.env.NEXT_PUBLIC_R2_BUCKET_URL;

for (const [name, value] of Object.entries({ R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, BUCKET, BUCKET_URL })) {
  if (!value) {
    console.error(`.env.local に ${name} がありません`);
    process.exit(1);
  }
}

/** カード表示は 96〜128px。2倍解像度でも足りるように 320px にする */
const THUMB_WIDTH = 320;
const PREFIX = 'images/eyecatch/';
const THUMB_PREFIX = 'images/eyecatch/thumb/';

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
});

async function listAll(prefix) {
  const objects = [];
  let token;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: token })
    );
    objects.push(...(res.Contents || []));
    token = res.NextContinuationToken;
  } while (token);
  return objects;
}

async function main() {
  const all = await listAll(PREFIX);
  const candidates = all.filter((o) => !o.Key.startsWith(THUMB_PREFIX) && /\.(webp|png|jpe?g)$/i.test(o.Key));

  // 同じ名前で .png と .webp が両方残っている。サムネイルのキーはどちらも .webp に
  // なって衝突するので、WebP がある名前は WebP だけを見る。
  const byBaseName = new Map();
  for (const obj of candidates) {
    const base = obj.Key.slice(PREFIX.length).replace(/\.(webp|png|jpe?g)$/i, '');
    const current = byBaseName.get(base);
    if (!current || (/\.webp$/i.test(obj.Key) && !/\.webp$/i.test(current.Key))) {
      byBaseName.set(base, obj);
    }
  }
  const originals = [...byBaseName.values()];
  const existingThumbs = new Set(all.filter((o) => o.Key.startsWith(THUMB_PREFIX)).map((o) => o.Key));

  const targets = originals.filter((o) => {
    const thumbKey = THUMB_PREFIX + o.Key.slice(PREFIX.length).replace(/\.(png|jpe?g)$/i, '.webp');
    return force || !existingThumbs.has(thumbKey);
  });

  const totalOriginal = originals.reduce((a, o) => a + o.Size, 0);
  console.log(`アイキャッチ ${originals.length} 枚 / 合計 ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
  console.log(`既存のサムネイル ${existingThumbs.size} 枚`);
  console.log(`生成対象 ${targets.length} 枚${dryRun ? '（--dry-run のため生成しません）' : ''}`);
  if (dryRun || targets.length === 0) {
    targets.slice(0, 10).forEach((o) => console.log('  -', o.Key));
    if (targets.length > 10) console.log(`  ... 他 ${targets.length - 10} 枚`);
    return;
  }

  let done = 0;
  let savedBytes = 0;
  for (const obj of targets) {
    const name = obj.Key.slice(PREFIX.length);
    const thumbKey = THUMB_PREFIX + name.replace(/\.(png|jpe?g)$/i, '.webp');
    try {
      // R2 の公開 URL から取る。S3 の GetObject でもよいが、
      // 公開されている状態そのものを取得できるほうが確実。
      const res = await fetch(`${BUCKET_URL}/${obj.Key}`);
      if (!res.ok) throw new Error(`取得に失敗: HTTP ${res.status}`);
      const input = Buffer.from(await res.arrayBuffer());

      const output = await sharp(input)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: thumbKey,
          Body: output,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      done++;
      savedBytes += input.length - output.length;
      console.log(
        `[${done}/${targets.length}] ${name}: ${Math.round(input.length / 1024)}KB → ${Math.round(output.length / 1024)}KB`
      );
    } catch (e) {
      console.error(`  失敗: ${name} — ${e.message}`);
    }
  }

  console.log(`\n完了: ${done}/${targets.length} 枚`);
  console.log(`カード1枚あたりの削減: 平均 ${done ? Math.round(savedBytes / done / 1024) : 0}KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
