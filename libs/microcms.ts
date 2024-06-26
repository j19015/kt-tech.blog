// libs/microcms.ts

import { createClient } from 'microcms-js-sdk';
import type { MicroCMSQueries, MicroCMSImage, MicroCMSDate } from 'microcms-js-sdk';

//ブログの型定義
export type Blog = {
  id: string;
  title: string;
  body: string;
  eyecatch?: MicroCMSImage;
  category?: Category;
  tags?: Tag[];
} & MicroCMSDate;

//props用

export type BlogProps = {
  contents: Blog[];
};

//タグの型定義
export type Tag = {
  id: string;
  name: string;
} & MicroCMSDate;

//カテゴリーの型定義
export type Category = {
  id: string;
  name: string;
} & MicroCMSDate;

if (!process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.NEXT_PUBLIC_MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
});

// ブログ一覧を取得
export const getList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Blog>({
    endpoint: 'blogs',
    queries: { limit: 100 },
  });

  // データの取得が目視しやすいよう明示的に遅延効果を追加
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  return listData;
};

// ブログの詳細を取得
export const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Blog>({
    endpoint: 'blogs',
    contentId,
    queries,
  });

  // データの取得が目視しやすいよう明示的に遅延効果を追加
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  return detailData;
};

// タグ一覧を取得
export const getTagList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Tag>({
    endpoint: 'tags',
    queries: { limit: 100 },
  });

  // データの取得が目視しやすいよう明示的に遅延効果を追加
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  return listData;
};

// タグの詳細を取得
export const getTagDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Tag>({
    endpoint: 'tags',
    contentId,
    queries,
  });

  // データの取得が目視しやすいよう明示的に遅延効果を追加
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  return detailData;
};

// カテゴリ一覧を取得
export const getCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Category>({
    endpoint: 'categories',
    queries,
  });

  // データの取得が目視しやすいよう明示的に遅延効果を追加
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  return listData;
};

// カテゴリの詳細を取得
export const getCategoryDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Category>({
    endpoint: 'categories',
    contentId,
    queries,
  });

  // データの取得が目視しやすいよう明示的に遅延効果を追加
  //await new Promise((resolve) => setTimeout(resolve, 3000));

  return detailData;
};
