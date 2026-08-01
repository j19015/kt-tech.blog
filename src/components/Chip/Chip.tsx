import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

/**
 * カテゴリ・タグのチップ。
 *
 * 記事詳細ではカテゴリが slate 系・タグが gray 系で色が食い違い、
 * サイト全体が slate なのでタグだけ濁って見えていた。
 * サイズも `text-sm` と `text-xs` で違うのに padding は同じで、
 * タグだけ上下の余白が不自然に厚かった。
 * さらにタグの `#` が場所によって付いたり付かなかったりしていた。
 *
 * 見た目の判断を1箇所に閉じ込めて、ズレようがない状態にする。
 */

type Props = {
  name: string;
  /** リンク先。省略すると非リンクの表示だけになる */
  href?: string;
  size?: 'sm' | 'md';
};

const BASE =
  'inline-flex items-center gap-1 rounded-full border transition-colors whitespace-nowrap';
const SIZES = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

/** カテゴリ。記事の主分類なので少し強めに見せる */
export const CategoryChip = ({ name, href, size = 'md' }: Props) => {
  const className = `${BASE} ${SIZES[size]} border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`;
  const content = (
    <>
      <FolderOpen className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden='true' />
      {name}
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
};

/** タグ。補助的な分類なので控えめに、必ず `#` を付ける */
export const TagChip = ({ name, href, size = 'sm' }: Props) => {
  const className = `${BASE} ${SIZES[size]} border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100`;
  const content = `#${name}`;
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
};
