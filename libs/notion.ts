// Notion REST API を直接fetch（Edge Runtime互換、@notionhq/client不使用）
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Notion APIレート制限対策: 3req/sec以下に制御
let lastRequestTime = 0;
async function notionFetch(path: string, options: { method?: string; body?: any; revalidate?: number } = {}) {
  // 最低350msの間隔を確保（約2.8req/sec）
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 350) {
    await new Promise(r => setTimeout(r, 350 - elapsed));
  }
  lastRequestTime = Date.now();

  const res = await fetch(`${NOTION_API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: { revalidate: options.revalidate ?? 3600 },
  } as any);
  if (!res.ok) throw new Error(`Notion API error: ${res.status} ${await res.text()}`);
  return res.json();
}

// 既存のmicrocms.tsと同じ型インターフェースを維持
export type Blog = {
  id: string; // Slug (microCMS IDまたはNotion page ID)
  title: string;
  body: string;
  eyecatch?: { url: string; height?: number; width?: number };
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type BlogProps = {
  contents: Blog[];
};

export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

// REST APIでは Database ID を使用（data_source_idではない）
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2eca0ffb73d181ffba0aecf7cad44701';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

// notionFetchを使用（上で定義済み）

// ビルド時のAPI呼び出し削減用キャッシュ
let listCache: { contents: Blog[]; totalCount: number; offset: number; limit: number } | null = null;

// Notionのrich_textからプレーンテキストを取得
function richTextToPlain(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join('') || '';
}

// NotionのページプロパティからBlog型に変換
function nameToSlug(name: string): string {
  return name.toLowerCase().trim();
}

function pageToTag(name: string): Tag {
  const id = nameToSlug(name);
  const now = new Date().toISOString();
  return { id, name, createdAt: now, updatedAt: now, publishedAt: now, revisedAt: now };
}

function pageToCategory(name: string): Category {
  const id = nameToSlug(name);
  const now = new Date().toISOString();
  return { id, name, createdAt: now, updatedAt: now, publishedAt: now, revisedAt: now };
}

// Notionのブロックをマークダウンに変換
async function blocksToMarkdown(blockId: string): Promise<string> {
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ page_size: '100' });
    if (cursor) params.set('start_cursor', cursor);
    const response: any = await notionFetch(`/blocks/${blockId}/children?${params}`);
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  const lines: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'heading_1':
        lines.push(`# ${richTextToPlain(block.heading_1.rich_text)}`);
        break;
      case 'heading_2': {
        const h2Text = richTextToPlain(block.heading_2.rich_text);
        // 「目次」見出しはスキップ（ブログ側で自動生成するため）
        if (h2Text === '目次') break;
        lines.push(`## ${h2Text}`);
        break;
      }
      case 'heading_3':
        lines.push(`### ${richTextToPlain(block.heading_3.rich_text)}`);
        break;
      case 'paragraph':
        lines.push(richTextToMarkdown(block.paragraph.rich_text));
        break;
      case 'bulleted_list_item':
        lines.push(`- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}`);
        break;
      case 'numbered_list_item':
        lines.push(`1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}`);
        break;
      case 'code':
        lines.push(`\`\`\`${block.code.language || ''}\n${richTextToPlain(block.code.rich_text)}\n\`\`\``);
        break;
      case 'image': {
        const url = block.image.type === 'external'
          ? block.image.external.url
          : block.image.file.url;
        const caption = block.image.caption ? richTextToPlain(block.image.caption) : '';
        lines.push(`![${caption}](${url})`);
        break;
      }
      case 'bookmark':
        lines.push(block.bookmark.url || '');
        break;
      case 'divider':
        // 区切り線は出力しない（見出しで十分区切られるため）
        break;
      case 'quote': {
        const quoteText = richTextToMarkdown(block.quote.rich_text);
        const quoteColor = block.quote.color || 'default';
        // quoteもcalloutと同じUIで表示（アイコンは引用マーク）
        lines.push(`:::callout{icon="📌" color="${quoteColor === 'default' ? 'gray_background' : quoteColor}"}`);
        lines.push(quoteText);
        lines.push(':::');
        break;
      }
      case 'callout': {
        const icon = block.callout.icon?.emoji || 'ℹ️';
        const text = richTextToMarkdown(block.callout.rich_text);
        const color = block.callout.color || 'default';
        // :::callout マーカーで出力し、後処理でHTMLに変換
        lines.push(`:::callout{icon="${icon}" color="${color}"}`);
        lines.push(text);
        lines.push(':::');
        break;
      }
      case 'toggle':
        lines.push(richTextToMarkdown(block.toggle.rich_text));
        break;
      case 'table_of_contents':
        // 目次は自動生成するのでスキップ
        break;
      case 'table': {
        // テーブルの子ブロック(行)を取得
        const tableRows = await notionFetch(`/blocks/${block.id}/children`);
        const rows = tableRows.results as any[];
        rows.forEach((row: any, idx: number) => {
          if (row.type === 'table_row') {
            const cells = row.table_row.cells.map((cell: any[]) => richTextToPlain(cell));
            lines.push(`| ${cells.join(' | ')} |`);
            if (idx === 0) {
              lines.push(`| ${cells.map(() => '---').join(' | ')} |`);
            }
          }
        });
        break;
      }
      default:
        // 未対応ブロックはスキップ
        break;
    }
    lines.push('');
  }

  return lines.join('\n');
}

// rich_textをマークダウン形式に変換 (インライン装飾対応)
// bold/italic/codeが混在する場合はHTMLタグで出力して確実に変換
function richTextToMarkdown(richText: any[]): string {
  if (!richText) return '';
  return richText.map((t: any) => {
    let text = t.plain_text;
    if (t.annotations?.code) text = `\`${text}\``;
    if (t.annotations?.bold) text = `<strong>${text}</strong>`;
    if (t.annotations?.italic) text = `<em>${text}</em>`;
    if (t.annotations?.strikethrough) text = `<del>${text}</del>`;
    if (t.href) text = `[${text}](${t.href})`;
    return text;
  }).join('');
}

// NotionのページからBlog型に変換
async function pageToBlog(page: any, fetchBody: boolean = false): Promise<Blog> {
  const props = page.properties;

  const title = richTextToPlain(props.Title?.title || []);
  const slug = richTextToPlain(props.Slug?.rich_text || []);
  const categoryName = props.Category?.select?.name || '';
  const tags = (props.Tags?.multi_select || []).map((t: any) => pageToTag(t.name));
  const eyecatchUrl = props.Eyecatch?.url || page.cover?.external?.url || page.cover?.file?.url || '';
  const createdDate = props.Created?.date?.start || page.created_time;
  const id = slug || page.id.replace(/-/g, '');

  let body = '';
  if (fetchBody) {
    body = await blocksToMarkdown(page.id);
  }

  const createdAt = new Date(createdDate).toISOString();

  return {
    id,
    title,
    body,
    eyecatch: eyecatchUrl ? { url: eyecatchUrl, width: 1200, height: 630 } : undefined,
    category: categoryName ? pageToCategory(categoryName) : undefined,
    tags,
    createdAt,
    updatedAt: page.last_edited_time,
    publishedAt: createdAt,
    revisedAt: page.last_edited_time,
  };
}

// ブログ一覧を取得（キャッシュ付き）
export const getList = async (queries?: { limit?: number; orders?: string }) => {
  if (listCache) {
    const limit = queries?.limit || 100;
    return { ...listCache, contents: listCache.contents.slice(0, limit), limit };
  }

  const allPages: any[] = [];
  let cursor: string | undefined;

  do {
    const body: any = {
      page_size: 100,
      filter: { property: 'Status', select: { equals: 'Published' } },
      sorts: [{ property: 'Created', direction: 'descending' }],
    };
    if (cursor) body.start_cursor = cursor;
    const response: any = await notionFetch(`/databases/${DATABASE_ID}/query`, { method: 'POST', body });
    allPages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  const contents = await Promise.all(allPages.map((page) => pageToBlog(page, false)));

  listCache = { contents, totalCount: contents.length, offset: 0, limit: contents.length };

  const limit = queries?.limit || 100;
  return { contents: contents.slice(0, limit), totalCount: contents.length, offset: 0, limit };
};

// ブログの詳細を取得 (slugで検索)
export const getDetail = async (slug: string) => {
  // まずSlugプロパティで検索
  const response = await notionFetch(`/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    body: { filter: { property: 'Slug', rich_text: { equals: slug } } },
  });

  if (response.results.length === 0) {
    // Slugが見つからない場合はNotionのpage IDで検索
    try {
      const page = await notionFetch(`/pages/${slug}`);
      return pageToBlog(page, true);
    } catch {
      throw new Error(`Blog not found: ${slug}`);
    }
  }

  return pageToBlog(response.results[0], true);
};

// タグ一覧を取得
export const getTagList = async () => {
  // Notionのデータベーススキーマからタグオプションを取得
  const db = await notionFetch(`/databases/${DATABASE_ID}`);
  const tagsProperty = (db.properties as any).Tags;
  const options = tagsProperty?.multi_select?.options || [];

  const contents: Tag[] = options.map((opt: any) => pageToTag(opt.name));
  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
};

// タグの詳細を取得
export const getTagDetail = async (tagId: string) => {
  const { contents } = await getTagList();
  const decoded = decodeURIComponent(tagId);
  const tag = contents.find((t) => t.id === decoded || t.id === tagId);
  if (!tag) throw new Error(`Tag not found: ${tagId}`);
  return tag;
};

// カテゴリ一覧を取得
export const getCategoryList = async () => {
  const db = await notionFetch(`/databases/${DATABASE_ID}`);
  const categoryProperty = (db.properties as any).Category;
  const options = categoryProperty?.select?.options || [];

  const contents: Category[] = options.map((opt: any) => pageToCategory(opt.name));
  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
};

// カテゴリの詳細を取得
export const getCategoryDetail = async (categoryId: string) => {
  const { contents } = await getCategoryList();
  const decoded = decodeURIComponent(categoryId);
  const category = contents.find((c) => c.id === decoded || c.id === categoryId);
  if (!category) throw new Error(`Category not found: ${categoryId}`);
  return category;
};
