import type { Blog } from '../../libs/notion';

/** 一覧のページあたり表示件数 */
export const ITEMS_PER_PAGE = 12;

/**
 * ポートフォリオ用の記事は一覧・検索・前後記事ナビから除外する。
 * 除外条件が各ページに散らばっていて、総数の計算だけ漏れる事故が起きていたため関数にまとめた。
 */
export const isPublic = (blog: Blog) => blog.category?.name !== 'PF';

/** 「2025-11」形式のアーカイブキーを「2025年11月」にする */
export function formatArchive(archive: string): string {
  const [year, month] = archive.split('-');
  if (!year || !month) return archive;
  return `${year}年${parseInt(month, 10)}月`;
}

/** 記事のアーカイブキー（「2025-11」形式）。一覧の絞り込みと sitemap で同じ切り方にする */
export const archiveKey = (blog: Blog) => blog.createdAt.slice(0, 7);

/**
 * タグ・カテゴリ・アーカイブの一覧を検索エンジンに載せる最低記事数。
 * 1〜2本しかない一覧は、別のタグと中身がまったく同じになりやすい
 * （例: ollama と gemma が同じ2記事）。Google はその片方を正規ページに選び直し、
 * 残りは「重複」「クロール済み - インデックス未登録」になっていた（#587）
 */
export const MIN_POSTS_TO_INDEX = 3;

/**
 * 一覧ページを index させるか。1ページ目で、記事が MIN_POSTS_TO_INDEX 本以上のときだけ。
 * そうでないページも noindex, follow にして、リンク先の記事はたどらせる。
 * sitemap も同じ条件で絞り、「送信したのに noindex」を作らない
 */
export const isIndexableList = (postCount: number, page: number) =>
  page === 1 && postCount >= MIN_POSTS_TO_INDEX;
