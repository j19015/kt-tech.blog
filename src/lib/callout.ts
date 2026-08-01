/**
 * Notion の callout の色を「意味」に対応づける。
 *
 * これまでは `callout-blue_background` のように色名がそのままクラス名になっており、
 * 見た目由来の名前だったため「あとで情報系calloutの色を変える」ができなかった。
 * また色と絵文字だけで種別を伝えていたので、色覚特性のあるユーザーには
 * 何の注意書きなのかが伝わらなかった（WCAG 1.4.1）。
 */
export type CalloutKind = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const COLOR_TO_KIND: Record<string, CalloutKind> = {
  gray: 'note',
  brown: 'note',
  default: 'note',
  green: 'tip',
  blue: 'important',
  purple: 'important',
  yellow: 'warning',
  orange: 'warning',
  red: 'caution',
  pink: 'caution',
};

/** 種別ごとの既定ラベルとアイコン。書き手が絵文字を指定していればそちらを優先する */
export const CALLOUT_META: Record<CalloutKind, { label: string; icon: string }> = {
  note: { label: 'メモ', icon: '📝' },
  tip: { label: 'Tips', icon: '💡' },
  important: { label: 'ポイント', icon: '🔖' },
  warning: { label: '注意', icon: '⚠️' },
  caution: { label: '重要', icon: '🚨' },
};

/** Notion の color 値（`blue_background` / `blue` / `default`）から種別を求める */
export function calloutKindFromColor(color: string): CalloutKind {
  const base = color.replace(/_background$/, '');
  return COLOR_TO_KIND[base] ?? 'note';
}
