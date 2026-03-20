// 既存のeyecatch画像をPNG→WebPに変換してR2に再アップロードし、Notionを更新するスクリプト
// 使い方: node scripts/convert-eyecatch-webp.mjs [--dry-run]
import { Client } from '@notionhq/client';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { readFileSync } from 'fs';

// .env.local を手動パース
const envFile = readFileSync('.env.local', 'utf-8');
envFile.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key && val) process.env[key] = val;
  }
});

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = '2eca0ffb-73d1-811b-aa8e-000bb9c14a3c';
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY;
const R2_SECRET_KEY = process.env.R2_SECRET_KEY;
const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;
const BUCKET_URL = process.env.NEXT_PUBLIC_R2_BUCKET_URL;

const DRY_RUN = process.argv.includes('--dry-run');

const notion = new Client({ auth: NOTION_API_KEY });

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN MODE\n' : '🔄 CONVERTING EYECATCH TO WEBP\n');

  // 全記事取得
  const allPages = [];
  let cursor;
  do {
    const response = await notion.dataSources.query({
      data_source_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
      filter: { property: 'Status', select: { equals: 'Published' } },
    });
    allPages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  // PNG eyecatchを持つ記事をフィルタ
  const pngPages = allPages.filter(p => {
    const url = p.properties.Eyecatch?.url || '';
    return url.endsWith('.png') && url.includes('eyecatch');
  });

  console.log(`Total articles: ${allPages.length}`);
  console.log(`PNG eyecatch to convert: ${pngPages.length}\n`);

  if (pngPages.length === 0) {
    console.log('✅ No PNG eyecatch images to convert!');
    return;
  }

  let converted = 0;
  let failed = 0;
  let totalSaved = 0;

  for (let i = 0; i < pngPages.length; i++) {
    const page = pngPages[i];
    const title = page.properties.Title?.title?.[0]?.plain_text || 'untitled';
    const eyecatchUrl = page.properties.Eyecatch?.url;
    const pngKey = eyecatchUrl.replace(`${BUCKET_URL}/`, '');
    const webpKey = pngKey.replace(/\.png$/, '.webp');

    console.log(`[${i + 1}/${pngPages.length}] ${title}`);
    console.log(`  PNG: ${pngKey}`);

    if (DRY_RUN) {
      console.log(`  → Would convert to: ${webpKey}\n`);
      continue;
    }

    try {
      // R2からPNGをダウンロード
      const getResult = await s3.send(new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: pngKey,
      }));
      const pngBuffer = Buffer.from(await getResult.Body.transformToByteArray());
      const pngSize = pngBuffer.length;

      // WebPに変換
      const webpBuffer = await sharp(pngBuffer).webp({ quality: 85 }).toBuffer();
      const webpSize = webpBuffer.length;
      const saved = pngSize - webpSize;
      totalSaved += saved;

      console.log(`  PNG: ${(pngSize / 1024).toFixed(0)}KB → WebP: ${(webpSize / 1024).toFixed(0)}KB (${(saved / 1024).toFixed(0)}KB saved, ${((1 - webpSize / pngSize) * 100).toFixed(0)}% reduction)`);

      // WebPをR2にアップロード
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: webpKey,
        Body: webpBuffer,
        ContentType: 'image/webp',
      }));

      // NotionのEyecatchとカバーを更新
      const newUrl = `${BUCKET_URL}/${webpKey}`;
      await notion.pages.update({
        page_id: page.id,
        properties: {
          Eyecatch: { url: newUrl },
        },
        cover: {
          type: 'external',
          external: { url: newUrl },
        },
      });

      console.log(`  ✅ Updated: ${newUrl}\n`);
      converted++;

      // レート制限対策
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n🎉 Done! Converted: ${converted}, Failed: ${failed}`);
  console.log(`💾 Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
}

main().catch(console.error);
