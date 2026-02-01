// libs/notion.ts

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// 型定義（microCMSと互換性を保つ）
export type Blog = {
  id: string;
  title: string;
  body: string;
  eyecatch?: { url: string; height?: number; width?: number };
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type BlogProps = {
  contents: Blog[];
};

export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is required');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Notionページのプロパティからブログデータを抽出
function extractBlogFromPage(page: any): Omit<Blog, 'body'> & { body: string } {
  const props = page.properties;

  const title = props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || '';

  const eyecatchUrl = props.Eyecatch?.url || props.Eyecatch?.files?.[0]?.file?.url || props.Eyecatch?.files?.[0]?.external?.url || '';

  const categoryName = props.Category?.select?.name || '';
  const categoryId = categoryName ? categoryName.toLowerCase().replace(/\s+/g, '-') : '';

  const tags = (props.Tags?.multi_select || []).map((tag: any) => ({
    id: tag.name.toLowerCase().replace(/\s+/g, '-'),
    name: tag.name,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  }));

  const createdAt = props.CreatedAt?.date?.start || page.created_time;
  const updatedAt = page.last_edited_time;

  // SlugまたはページIDをIDとして使用
  const slug = props.Slug?.rich_text?.[0]?.plain_text || page.id.replace(/-/g, '');

  return {
    id: slug,
    title,
    body: '', // 後でnotionToMarkdownで取得
    eyecatch: eyecatchUrl ? { url: eyecatchUrl } : undefined,
    category: categoryName
      ? { id: categoryId, name: categoryName, createdAt, updatedAt }
      : undefined,
    tags: tags.length > 0 ? tags : undefined,
    createdAt,
    updatedAt,
  };
}

// ページIDとSlugのマッピングキャッシュ
let slugToPageIdCache: Map<string, string> | null = null;

async function getSlugToPageIdMap(): Promise<Map<string, string>> {
  if (slugToPageIdCache) return slugToPageIdCache;

  const map = new Map<string, string>();
  let cursor: string | undefined = undefined;

  do {
    const response: any = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID!,
      start_cursor: cursor,
      sorts: [{ property: 'CreatedAt', direction: 'descending' }],
    });

    for (const page of response.results) {
      const props = (page as any).properties;
      const slug = props.Slug?.rich_text?.[0]?.plain_text || (page as any).id.replace(/-/g, '');
      map.set(slug, (page as any).id);
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  slugToPageIdCache = map;
  return map;
}

// ブログ一覧を取得
export const getList = async (options?: { limit?: number; orders?: string }) => {
  const allBlogs: Blog[] = [];
  let cursor: string | undefined = undefined;

  // ソート方向の決定
  const direction = options?.orders?.startsWith('-') ? 'descending' : 'ascending';

  do {
    const response: any = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID!,
      start_cursor: cursor,
      sorts: [{ property: 'CreatedAt', direction: direction as 'ascending' | 'descending' }],
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
    });

    for (const page of response.results) {
      const blog = extractBlogFromPage(page);

      // 本文を取得
      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdBlocks);
      blog.body = mdString.parent;

      allBlogs.push(blog as Blog);
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  // limitが指定されている場合はスライス
  const contents = options?.limit ? allBlogs.slice(0, options.limit) : allBlogs;

  return { contents, totalCount: allBlogs.length };
};

// ブログの詳細を取得
export const getDetail = async (contentId: string) => {
  // slugからページIDを解決
  const map = await getSlugToPageIdMap();
  const pageId = map.get(contentId);

  if (!pageId) {
    throw new Error(`Blog not found: ${contentId}`);
  }

  const page = await notion.pages.retrieve({ page_id: pageId });
  const blog = extractBlogFromPage(page);

  // 本文をMarkdownに変換
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);
  blog.body = mdString.parent;

  return blog as Blog;
};

// タグ一覧を取得（ブログDBのTagsプロパティから抽出）
export const getTagList = async () => {
  const { contents } = await getList();
  const tagMap = new Map<string, Tag>();

  for (const blog of contents) {
    if (blog.tags) {
      for (const tag of blog.tags) {
        if (!tagMap.has(tag.id)) {
          tagMap.set(tag.id, tag);
        }
      }
    }
  }

  const tags = Array.from(tagMap.values());
  return { contents: tags, totalCount: tags.length };
};

// タグの詳細を取得
export const getTagDetail = async (contentId: string) => {
  const { contents } = await getTagList();
  const tag = contents.find((t) => t.id === contentId);
  if (!tag) {
    throw new Error(`Tag not found: ${contentId}`);
  }
  return tag;
};

// カテゴリ一覧を取得（ブログDBのCategoryプロパティから抽出）
export const getCategoryList = async () => {
  const { contents } = await getList();
  const categoryMap = new Map<string, Category>();

  for (const blog of contents) {
    if (blog.category) {
      if (!categoryMap.has(blog.category.id)) {
        categoryMap.set(blog.category.id, blog.category);
      }
    }
  }

  const categories = Array.from(categoryMap.values());
  return { contents: categories, totalCount: categories.length };
};

// カテゴリの詳細を取得
export const getCategoryDetail = async (contentId: string) => {
  const { contents } = await getCategoryList();
  const category = contents.find((c) => c.id === contentId);
  if (!category) {
    throw new Error(`Category not found: ${contentId}`);
  }
  return category;
};
