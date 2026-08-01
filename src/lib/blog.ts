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
