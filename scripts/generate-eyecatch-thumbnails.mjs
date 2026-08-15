// アイキャッチの表示サイズ別の版を R2 に用意するスクリプト。
//
// Cloudflare Pages では Next.js の画像最適化が動かない（next.config.js の
// `images.unoptimized: true`）ので、R2 に置いた原寸 1376px がどこでも配信される。
// 一覧カードは 96〜128px、トップのフィーチャーでも 600px しか使わないため、
// Lighthouse の "Properly size images" が 426KB の削減余地を出していた。
//
//   node scripts/generate-eyecatch-thumbnails.mjs [--dry-run] [--force]
//
// --dry-run: 生成せず対象だけ表示する
// --force  : 既に生成済みでも作り直す

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

/**
 * 用意する幅。参照側は src/lib/eyecatch.ts が同じ名前で URL を組み立てる。
 * - thumb : 一覧カード（表示 96〜128px）。2倍解像度でも足りる 320px
 * - medium: トップのフィーチャー / サブ記事（表示は最大 600px、モバイルは画面幅）
 * 記事ページのヒーローだけは原寸を使う（700px 前後で大きく出すため）。
 */
const VARIANTS = [
  { name: 'thumb', width: 320, quality: 80 },
  { name: 'medium', width: 768, quality: 82 },
];

const PREFIX = 'images/eyecatch/';
const derivedPrefixes = VARIANTS.map((v) => `${PREFIX}${v.name}/`);

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

/** 派生画像のキー。拡張子は WebP に揃える */
function derivedKey(variantName, originalKey) {
  const name = originalKey.slice(PREFIX.length).replace(/\.(png|jpe?g)$/i, '.webp');
  return `${PREFIX}${variantName}/${name}`;
}

async function main() {
  const all = await listAll(PREFIX);
  const existing = new Set(all.map((o) => o.Key));

  const candidates = all.filter(
    (o) => !derivedPrefixes.some((p) => o.Key.startsWith(p)) && /\.(webp|png|jpe?g)$/i.test(o.Key)
  );

  // 同じ名前で .png と .webp が両方残っている。派生のキーはどちらも .webp に
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

  // 「この原本に対して、まだ無いバリアント」の組み合わせを作る
  const jobs = [];
  for (const obj of originals) {
    for (const variant of VARIANTS) {
      const key = derivedKey(variant.name, obj.Key);
      if (force || !existing.has(key)) jobs.push({ obj, variant, key });
    }
  }

  const totalOriginal = originals.reduce((a, o) => a + o.Size, 0);
  console.log(`アイキャッチ ${originals.length} 枚 / 合計 ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
  for (const v of VARIANTS) {
    const have = originals.filter((o) => existing.has(derivedKey(v.name, o.Key))).length;
    console.log(`  ${v.name}(${v.width}px): ${have}/${originals.length} 枚が生成済み`);
  }
  console.log(`生成対象 ${jobs.length} 件${dryRun ? '（--dry-run のため生成しません）' : ''}`);
  if (dryRun || jobs.length === 0) {
    jobs.slice(0, 10).forEach((j) => console.log('  -', j.key));
    if (jobs.length > 10) console.log(`  ... 他 ${jobs.length - 10} 件`);
    return;
  }

  // 同じ原本を複数バリアントで使うので、ダウンロードは1回にまとめる
  const cache = new Map();
  let done = 0;
  let savedBytes = 0;

  for (const { obj, variant, key } of jobs) {
    try {
      if (!cache.has(obj.Key)) {
        const res = await fetch(`${BUCKET_URL}/${obj.Key}`);
        if (!res.ok) throw new Error(`取得に失敗: HTTP ${res.status}`);
        cache.set(obj.Key, Buffer.from(await res.arrayBuffer()));
      }
      const input = cache.get(obj.Key);

      const output = await sharp(input)
        .resize({ width: variant.width, withoutEnlargement: true })
        .webp({ quality: variant.quality })
        .toBuffer();

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: output,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      done++;
      savedBytes += input.length - output.length;
      console.log(
        `[${done}/${jobs.length}] ${variant.name}/${key.split('/').pop()}: ${Math.round(input.length / 1024)}KB → ${Math.round(output.length / 1024)}KB`
      );
    } catch (e) {
      console.error(`  失敗: ${key} — ${e.message}`);
    }
  }

  console.log(`\n完了: ${done}/${jobs.length} 件`);
  console.log(`1枚あたりの削減: 平均 ${done ? Math.round(savedBytes / done / 1024) : 0}KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
