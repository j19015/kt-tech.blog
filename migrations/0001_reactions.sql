-- 記事ごとの「参考になった」の件数（Issue #455）
--
-- 1記事1行。slug が主キーなので、加算のたびに全行を読まずに済む。
-- 誰が押したかは持たない（個人情報や IP を保存しない方針）。
CREATE TABLE IF NOT EXISTS reactions (
  slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);
