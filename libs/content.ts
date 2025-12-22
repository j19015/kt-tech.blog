// libs/content.ts - ローカルMarkdownファイルからコンテンツを読み込む

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// コンテンツディレクトリのパス
const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOGS_DIR = path.join(CONTENT_DIR, 'blogs');

// 型定義（microCMSと互換）
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

export type Blog = {
  id: string;
  title: string;
  body: string;
  eyecatch?: {
    url: string;
    height?: number;
    width?: number;
  };
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type BlogProps = {
  contents: Blog[];
};

// タグ一覧をJSONから読み込み
const loadTags = (): Tag[] => {
  const tagsPath = path.join(CONTENT_DIR, 'tags.json');
  const tagsData = fs.readFileSync(tagsPath, 'utf-8');
  return JSON.parse(tagsData);
};

// カテゴリ一覧をJSONから読み込み
const loadCategories = (): Category[] => {
  const categoriesPath = path.join(CONTENT_DIR, 'categories.json');
  const categoriesData = fs.readFileSync(categoriesPath, 'utf-8');
  return JSON.parse(categoriesData);
};

// タグIDからTagオブジェクトを取得
const getTagById = (tagId: string, tags: Tag[]): Tag | undefined => {
  return tags.find(tag => tag.id === tagId);
};

// カテゴリIDからCategoryオブジェクトを取得
const getCategoryById = (categoryId: string, categories: Category[]): Category | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

// Markdownファイルを読み込んでBlogオブジェクトに変換
const parseMarkdownFile = (filePath: string, tags: Tag[], categories: Category[]): Blog => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // タグIDの配列からTagオブジェクトの配列に変換
  const blogTags = data.tags
    ? data.tags.map((tagId: string) => getTagById(tagId, tags)).filter(Boolean) as Tag[]
    : undefined;

  // カテゴリIDからCategoryオブジェクトに変換
  const blogCategory = data.category
    ? getCategoryById(data.category, categories)
    : undefined;

  // eyecatch の処理
  const eyecatch = data.eyecatch
    ? { url: data.eyecatch, height: 630, width: 1200 }
    : undefined;

  return {
    id: data.id,
    title: data.title,
    body: content,
    eyecatch,
    category: blogCategory,
    tags: blogTags,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt || data.createdAt,
  };
};

// getListのオプション型
type GetListOptions = {
  limit?: number;
  orders?: string;
};

// ブログ一覧を取得（microCMS互換）
export const getList = async (options?: GetListOptions) => {
  const tags = loadTags();
  const categories = loadCategories();

  const files = fs.readdirSync(BLOGS_DIR).filter(file => file.endsWith('.md'));

  let contents = files.map(file => {
    const filePath = path.join(BLOGS_DIR, file);
    return parseMarkdownFile(filePath, tags, categories);
  });

  // ordersに基づくソート（デフォルトは公開日の降順）
  const orders = options?.orders || '-publishedAt';
  const isDescending = orders.startsWith('-');
  const sortField = isDescending ? orders.slice(1) : orders;

  contents.sort((a, b) => {
    const aValue = a[sortField as keyof Blog];
    const bValue = b[sortField as keyof Blog];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // 日付フィールドの場合
      if (sortField.includes('At')) {
        const comparison = new Date(bValue).getTime() - new Date(aValue).getTime();
        return isDescending ? comparison : -comparison;
      }
      // 通常の文字列の場合
      const comparison = bValue.localeCompare(aValue);
      return isDescending ? comparison : -comparison;
    }
    return 0;
  });

  // limitに基づく件数制限
  if (options?.limit) {
    contents = contents.slice(0, options.limit);
  }

  return {
    contents,
    totalCount: contents.length,
    offset: 0,
    limit: options?.limit || 100,
  };
};

// ブログ詳細を取得（microCMS互換）
export const getDetail = async (contentId: string) => {
  const tags = loadTags();
  const categories = loadCategories();

  const filePath = path.join(BLOGS_DIR, `${contentId}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Blog post not found: ${contentId}`);
  }

  return parseMarkdownFile(filePath, tags, categories);
};

// タグ一覧を取得（microCMS互換）
export const getTagList = async () => {
  const tags = loadTags();

  return {
    contents: tags,
    totalCount: tags.length,
    offset: 0,
    limit: 100,
  };
};

// タグ詳細を取得（microCMS互換）
export const getTagDetail = async (contentId: string) => {
  const tags = loadTags();
  const tag = tags.find(t => t.id === contentId);

  if (!tag) {
    throw new Error(`Tag not found: ${contentId}`);
  }

  return tag;
};

// カテゴリ一覧を取得（microCMS互換）
export const getCategoryList = async () => {
  const categories = loadCategories();

  return {
    contents: categories,
    totalCount: categories.length,
    offset: 0,
    limit: 100,
  };
};

// カテゴリ詳細を取得（microCMS互換）
export const getCategoryDetail = async (contentId: string) => {
  const categories = loadCategories();
  const category = categories.find(c => c.id === contentId);

  if (!category) {
    throw new Error(`Category not found: ${contentId}`);
  }

  return category;
};
