import type { Blog } from '../../libs/notion';

/**
 * 記事の「新しさ」の判定。
 *
 * 同じ判断が Index / トップ / 検索結果の3箇所にマジックナンバー直書きで
 * 散っていて、基準がそれぞれ違っていた。
 * - Index の NEW: 公開から72時間
 * - Index の 更新: 更新から7日
 * - トップの「最近更新された記事」: 期間の上限なし（1年前の更新でも並ぶ）
 * - 検索結果: NEW だけで 更新 バッジがない
 *
 * その結果、トップの「最近更新された記事」に出ているのに一覧カードには
 * 更新バッジが無い、という矛盾した見え方になっていた。
 */

/** 公開からこの期間内なら「NEW」。週1更新のブログで72時間は短すぎた */
export const NEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
/** 更新からこの期間内なら「更新」 */
export const UPDATE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
/** これ未満の差は誤字修正などとみなして「更新」と呼ばない */
export const MIN_UPDATE_GAP_MS = 24 * 60 * 60 * 1000;
/** 最終更新からこの期間を過ぎたら、情報の古さを注意書きする */
export const STALE_THRESHOLD_MS = 365 * 24 * 60 * 60 * 1000;

export type ArticleBadge = 'new' | 'updated' | null;

export function getArticleBadge(blog: Blog, now: number = Date.now()): ArticleBadge {
  if (now - new Date(blog.createdAt).getTime() < NEW_WINDOW_MS) return 'new';
  if (isRecentlyUpdated(blog, now)) return 'updated';
  return null;
}

/** 公開後に実質的な更新があり、それが最近であること */
export function isRecentlyUpdated(blog: Blog, now: number = Date.now()): boolean {
  if (!blog.updatedAt) return false;
  const updated = new Date(blog.updatedAt).getTime();
  const created = new Date(blog.createdAt).getTime();
  return updated - created > MIN_UPDATE_GAP_MS && now - updated < UPDATE_WINDOW_MS;
}

/** 最終更新から時間が経ちすぎていないか */
export function isStale(blog: Blog, now: number = Date.now()): boolean {
  return now - new Date(blog.updatedAt || blog.createdAt).getTime() > STALE_THRESHOLD_MS;
}
