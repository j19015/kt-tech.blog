import { Client } from '@notionhq/client';

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

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2eca0ffb-73d1-811b-aa8e-000bb9c14a3c';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ビルド時のAPI呼び出し削減用キャッシュ
let listCache: { contents: Blog[]; totalCount: number; offset: number; limit: number } | null = null;

// Notionのrich_textからプレーンテキストを取得
function richTextToPlain(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join('') || '';
}

// NotionのページプロパティからBlog型に変換
function nameToSlug(name: string): string {
  return encodeURIComponent(name.toLowerCase().trim());
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
    const response: any = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  const lines: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'heading_1':
        lines.push(`# ${richTextToPlain(block.heading_1.rich_text)}`);
        break;
      case 'heading_2':
        lines.push(`## ${richTextToPlain(block.heading_2.rich_text)}`);
        break;
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
        lines.push('---');
        break;
      case 'quote':
        lines.push(`> ${richTextToMarkdown(block.quote.rich_text)}`);
        break;
      case 'callout':
        lines.push(`> ${richTextToMarkdown(block.callout.rich_text)}`);
        break;
      case 'toggle':
        lines.push(richTextToMarkdown(block.toggle.rich_text));
        break;
      case 'table_of_contents':
        // 目次は自動生成するのでスキップ
        break;
      case 'table': {
        // テーブルの子ブロック(行)を取得
        const tableRows = await notion.blocks.children.list({ block_id: block.id });
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
function richTextToMarkdown(richText: any[]): string {
  if (!richText) return '';
  return richText.map((t: any) => {
    let text = t.plain_text;
    if (t.annotations?.bold) text = `**${text}**`;
    if (t.annotations?.italic) text = `*${text}*`;
    if (t.annotations?.strikethrough) text = `~~${text}~~`;
    if (t.annotations?.code) text = `\`${text}\``;
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
    const response: any = await notion.dataSources.query({
      data_source_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        property: 'Status',
        select: { equals: 'Published' },
      },
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });
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
  const response = await notion.dataSources.query({
    data_source_id: DATABASE_ID,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  });

  if (response.results.length === 0) {
    // Slugが見つからない場合はNotionのpage IDで検索
    try {
      const page = await notion.pages.retrieve({ page_id: slug });
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
  const db = await notion.dataSources.retrieve({ data_source_id: DATABASE_ID });
  const tagsProperty = (db.properties as any).Tags;
  const options = tagsProperty?.multi_select?.options || [];

  const contents: Tag[] = options.map((opt: any) => pageToTag(opt.name));
  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
};

// タグの詳細を取得
export const getTagDetail = async (tagId: string) => {
  const { contents } = await getTagList();
  const tag = contents.find((t) => t.id === tagId);
  if (!tag) throw new Error(`Tag not found: ${tagId}`);
  return tag;
};

// カテゴリ一覧を取得
export const getCategoryList = async () => {
  const db = await notion.dataSources.retrieve({ data_source_id: DATABASE_ID });
  const categoryProperty = (db.properties as any).Category;
  const options = categoryProperty?.select?.options || [];

  const contents: Category[] = options.map((opt: any) => pageToCategory(opt.name));
  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
};

// カテゴリの詳細を取得
export const getCategoryDetail = async (categoryId: string) => {
  const { contents } = await getCategoryList();
  const category = contents.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Category not found: ${categoryId}`);
  return category;
};
