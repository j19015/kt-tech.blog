// eyecatch未設定の記事に対してImagen 4で画像を生成し、R2にアップロード、Notionを更新するスクリプト
// 使い方: node scripts/generate-eyecatch.mjs [--dry-run]
import { Client } from '@notionhq/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import https from 'https';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const LOCAL_CACHE_DIR = 'public/images/eyecatch';
if (!existsSync(LOCAL_CACHE_DIR)) mkdirSync(LOCAL_CACHE_DIR, { recursive: true });

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
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
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

// カテゴリ別のカラーパレット（各カテゴリに複数バリエーション）
const CATEGORY_PALETTES = {
  'トラブルシューティング': [
    'warm orange, burnt sienna, cream, dark brown. Beige background.',
    'coral red, terracotta, soft peach, maroon. Warm sand background.',
    'amber, rust, golden cream, chocolate brown. Light tan background.',
    'vermillion, copper, ivory, deep sienna. Off-white background.',
  ],
  '設定・環境構築': [
    'deep navy blue, steel blue, lavender, soft peach. Navy blue background.',
    'royal blue, cobalt, powder blue, slate gray. Deep blue background.',
    'cerulean, midnight blue, periwinkle, silver. Dark slate background.',
    'sapphire, ocean blue, ice blue, dove gray. Charcoal background.',
  ],
  '実装': [
    'emerald green, teal, sage, dark forest green. Soft mint background.',
    'jade, sea green, lime, deep olive. Light sage background.',
    'viridian, moss green, chartreuse, hunter green. Pale green background.',
    'malachite, pine green, mint, dark emerald. Cream background.',
  ],
  '設計': [
    'deep indigo, slate blue, dusty rose, warm taupe. Light gray background.',
    'plum, amethyst, mauve, charcoal. Lavender background.',
    'deep violet, periwinkle, blush pink, dark gray. Soft lilac background.',
    'byzantium, wisteria, rose quartz, gunmetal. Pearl background.',
  ],
  '学習メモ': [
    'golden yellow, amber, warm brown, mustard. Cream background.',
    'saffron, honey, caramel, dark gold. Light yellow background.',
    'sunflower, bronze, wheat, deep amber. Ivory background.',
    'canary yellow, ochre, tan, burnt gold. Pale cream background.',
  ],
  '技術': [
    'cool gray, steel blue, ice blue, charcoal. Light silver background.',
    'graphite, platinum, pale blue, dark gray. Silver background.',
    'titanium, ash gray, arctic blue, onyx. Pearl gray background.',
    'slate, mercury, frost blue, anthracite. White smoke background.',
  ],
  '勉強会': [
    'coral pink, salmon, peach, warm rose. Soft blush background.',
    'magenta, hot pink, light coral, dusty rose. Pink tint background.',
    'fuchsia, flamingo, apricot, deep rose. Pastel pink background.',
    'cerise, raspberry, soft orange, rose gold. Light peach background.',
  ],
  '日常': [
    'sky blue, turquoise, soft white, pale mint. Light blue background.',
    'aquamarine, teal, cream, soft cyan. Pale turquoise background.',
    'cornflower blue, seafoam, vanilla, light teal. Mint background.',
    'robin egg blue, azure, pearl, sage green. Soft aqua background.',
  ],
};

const DEFAULT_PALETTES = [
  'deep blue, purple, teal, silver. Dark slate background.',
  'indigo, crimson, gold, charcoal. Midnight background.',
  'forest green, burnt orange, cream, navy. Dark brown background.',
  'burgundy, teal, ivory, slate. Warm gray background.',
];

// slugからハッシュ値を計算してバリエーション選択
function hashSlug(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generatePrompt(category, slug) {
  const palettes = CATEGORY_PALETTES[category] || DEFAULT_PALETTES;
  const index = hashSlug(slug) % palettes.length;
  const colors = palettes[index];
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

  const needsEyecatch = allPages;

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
      const filename = `${slug}.png`;
      const localPath = `${LOCAL_CACHE_DIR}/${filename}`;
      let imageBuffer;

      // ローカルキャッシュがあればスキップ
      if (existsSync(localPath)) {
        console.log(`  Using cached: ${localPath}`);
        imageBuffer = readFileSync(localPath);
      } else {
        // 画像生成
        const prompt = generatePrompt(category, slug);
        console.log('  Generating image...');
        imageBuffer = await callImagen(prompt);

        // ローカルに保存
        writeFileSync(localPath, imageBuffer);
        console.log(`  Saved locally: ${localPath}`);

        // レート制限対策
        await new Promise(r => setTimeout(r, 5000));
      }

      // R2アップロード
      console.log(`  Uploading to R2: images/eyecatch/${filename}`);
      const imageUrl = await uploadToR2(imageBuffer, filename);

      // Notion更新
      console.log(`  Updating Notion: ${imageUrl}`);
      await updateNotionEyecatch(page.id, imageUrl);

      console.log(`  ✅ Done!\n`);
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}\n`);
    }
  }

  console.log('\n🎉 All done!');
}

main().catch(console.error);
