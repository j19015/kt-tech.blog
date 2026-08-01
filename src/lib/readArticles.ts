/**
 * 既読記事の localStorage キー。
 *
 * ReadingTracker / ReadingStats / SeriesNav の3箇所で同じキーを
 * 別々に書いていたので、片方だけ直すと静かにずれる状態だった。
 */
export const READ_ARTICLES_KEY = 'kt-tech-read-articles';

/** 既読記事のIDを読む。壊れた値が入っていても落とさない */
export function getReadArticles(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(READ_ARTICLES_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}
