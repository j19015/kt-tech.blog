/**
 * 「あとで読む」の localStorage キーと読み書き。
 *
 * BookmarkButton にキー文字列と JSON の形が直書きされていたため、
 * 保存した記事を見返す画面を作るのに実装を読み解く必要があった。
 */
export const BOOKMARKS_KEY = 'kt-tech-bookmarks';

/** 保存件数の上限。無制限にすると localStorage の容量を圧迫する */
export const MAX_BOOKMARKS = 50;

export type Bookmark = {
  id: string;
  title: string;
  savedAt: string;
};

/** 保存済みブックマークを新しい順で返す。壊れた値が入っていても落とさない */
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter(
      (b): b is Bookmark =>
        b && typeof b.id === 'string' && typeof b.title === 'string' && typeof b.savedAt === 'string'
    );
  } catch {
    return [];
  }
}

function save(bookmarks: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks.slice(0, MAX_BOOKMARKS)));
}

export function addBookmark(bookmark: Bookmark) {
  save([bookmark, ...getBookmarks().filter((b) => b.id !== bookmark.id)]);
}

export function removeBookmark(id: string) {
  save(getBookmarks().filter((b) => b.id !== id));
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((b) => b.id === id);
}
