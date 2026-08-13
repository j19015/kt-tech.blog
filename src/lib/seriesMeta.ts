/**
 * 連載そのものの説明。
 *
 * Notion のデータベースは記事単位なので、「連載に1つだけあればいい情報」を
 * 持たせると全記事に同じ値を書く羽目になる。連載の数はたかが知れているので、
 * ここにコードとして置く。
 *
 * ここに無い連載は説明なしで表示される（追加を忘れても壊れない）。
 */
export type SeriesMeta = {
  /** 連載の内容を一文で。一覧のカードと連載ページの導入、meta description に使う */
  tagline: string;
};

export const SERIES_META: Record<string, SeriesMeta> = {
  確定申告自動化: {
    tagline:
      '個人事業主の経理を、UIを作らず Claude Code の skill だけで回した記録。領収書の自動取得から電子帳簿保存法の要件、freee への添付、月次締めまで。',
  },
  'Claude Code Harness': {
    tagline:
      'Claude Code をチームで運用するための設計。共有する .claude/ の構成から、hook によるガード、subagent と skill の使い分けまで。',
  },
};

export function seriesMetaOf(name: string): SeriesMeta | undefined {
  return SERIES_META[name];
}
