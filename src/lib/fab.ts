/**
 * 画面右下に重ねるボタン（FAB）の位置と重なり順。
 *
 * 3つのボタンがそれぞれ別のファイルで `bottom-6` / `bottom-20` /
 * `bottom-[8.5rem]`、z-index も 50 / 40 / 30 と好き勝手に指定していた。
 * 間隔が不揃いで、重なり順も「一番下のボタンが一番手前」という
 * 意図の読めない状態だった。
 *
 * ここで一元管理して、位置は等間隔、重なり順はパネルを開くものほど手前にする。
 */

/** ボタンの大きさと間隔。合計の高さは 3 つでも約 150px に収まる */
export const FAB_BASE =
  'fixed right-4 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full shadow-lg active:scale-95 transition-all duration-200';

/** 下から順に積む。20px / 68px / 116px と 48px 間隔で等しく並ぶ */
export const FAB_SLOT = {
  first: 'bottom-5',
  second: 'bottom-[4.25rem]',
  third: 'bottom-[7.25rem]',
} as const;

/**
 * 重なり順。
 * 目次はパネルを開くので最前面、共有はその次、トップへ戻るは最背面。
 */
export const FAB_Z = {
  toc: 'z-40',
  share: 'z-30',
  scrollTop: 'z-20',
} as const;

/** 目次パネルとその背景。パネルは FAB より手前に出す */
export const FAB_PANEL_Z = 'z-50';
export const FAB_OVERLAY_Z = 'z-40';
