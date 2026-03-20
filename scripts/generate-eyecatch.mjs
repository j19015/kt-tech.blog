// eyecatch未設定の記事に対してImagen 4で画像を生成し、R2にアップロード、Notionを更新するスクリプト
// 使い方: node scripts/generate-eyecatch.mjs [--dry-run]
import { Client } from '@notionhq/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import https from 'https';
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
// SDK v5はdata_source_idが必要（REST APIのdatabase_idとは異なる）
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

// カテゴリ別のカラーパレット
const CATEGORY_COLORS = {
  'トラブルシューティング': 'warm orange, burnt sienna, cream, dark brown. Beige background.',
  '設定・環境構築': 'deep navy blue, steel blue, lavender, soft peach. Navy blue background.',
  '実装': 'emerald green, teal, sage, dark forest green. Soft mint background.',
  '設計': 'deep indigo, slate blue, dusty rose, warm taupe. Light gray background.',
  '学習メモ': 'golden yellow, amber, warm brown, mustard. Cream background.',
  '技術': 'cool gray, steel blue, ice blue, charcoal. Light silver background.',
  '勉強会': 'coral pink, salmon, peach, warm rose. Soft blush background.',
  '日常': 'sky blue, turquoise, soft white, pale mint. Light blue background.',
};

const DEFAULT_COLORS = 'deep blue, purple, teal, silver. Dark slate background.';

function generatePrompt(category) {
  const colors = CATEGORY_COLORS[category] || DEFAULT_COLORS;
  const noText = 'Absolutely no text, no words, no letters, no labels, no numbers, no characters. Pure visual abstract art only.';
  const style = 'Abstract geometric composition with overlapping translucent circles, arcs and curved shapes. Matte paper-like texture. Flat design, minimal, modern. 16:9 aspect ratio.';
  return `${noText} ${style} Color palette: ${colors}`;
}

// Nano Banana Pro (gemini-3-pro-image-preview) で画像生成
function callImagen(prompt) {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`;
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          const parts = data.candidates?.[0]?.content?.parts;
          if (parts) {
            const imgPart = parts.find(p => p.inlineData);
            if (imgPart) {
              resolve(Buffer.from(imgPart.inlineData.data, 'base64'));
              return;
            }
          }
          reject(new Error(`Nano Banana Pro error: ${JSON.stringify(data).slice(0, 300)}`));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function uploadToR2(buffer, filename) {
  // PNG → WebP変換（70-80%サイズ削減）
  const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
  const webpFilename = filename.replace(/\.png$/, '.webp');
  const key = `images/eyecatch/${webpFilename}`;
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: webpBuffer,
    ContentType: 'image/webp',
  }));
  console.log(`  Converted: PNG ${(buffer.length / 1024).toFixed(0)}KB → WebP ${(webpBuffer.length / 1024).toFixed(0)}KB`);
  return `${BUCKET_URL}/${key}`;
}

async function updateNotionEyecatch(pageId, imageUrl) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Eyecatch: { url: imageUrl },
    },
    cover: {
      type: 'external',
      external: { url: imageUrl },
    },
  });
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN MODE\n' : '🚀 GENERATING EYECATCH IMAGES\n');

  // eyecatch未設定の記事を取得
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

  const needsEyecatch = allPages.filter(p => {
    const eyecatch = p.properties.Eyecatch?.url;
    return !eyecatch;
  });

  console.log(`Total articles: ${allPages.length}`);
  console.log(`Without eyecatch: ${needsEyecatch.length}\n`);

  if (needsEyecatch.length === 0) {
    console.log('✅ All articles have eyecatch images!');
    return;
  }

  for (let i = 0; i < needsEyecatch.length; i++) {
    const page = needsEyecatch[i];
    const title = page.properties.Title?.title?.[0]?.plain_text || 'untitled';
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || page.id.replace(/-/g, '');
    const category = page.properties.Category?.select?.name || '';

    console.log(`[${i + 1}/${needsEyecatch.length}] ${title}`);
    console.log(`  Category: ${category}, Slug: ${slug}`);

    if (DRY_RUN) {
      console.log(`  → Would generate with colors: ${CATEGORY_COLORS[category] || DEFAULT_COLORS}\n`);
      continue;
    }

    try {
      // 画像生成
      const prompt = generatePrompt(category);
      console.log('  Generating image...');
      const imageBuffer = await callImagen(prompt);

      // R2アップロード
      const filename = `${slug}.png`;
      console.log(`  Uploading to R2: images/eyecatch/${filename}`);
      const imageUrl = await uploadToR2(imageBuffer, filename);

      // Notion更新
      console.log(`  Updating Notion: ${imageUrl}`);
      await updateNotionEyecatch(page.id, imageUrl);

      console.log(`  ✅ Done!\n`);

      // レート制限対策
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}\n`);
    }
  }

  console.log('\n🎉 All done!');
}

main().catch(console.error);
