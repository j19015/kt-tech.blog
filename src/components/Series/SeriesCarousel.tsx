'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Library, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getReadArticles } from '@/lib/readArticles';
import { seriesMetaOf } from '@/lib/seriesMeta';

export type SeriesCarouselPost = { id: string; title: string; publishedAt: string };

type Props = {
  seriesName: string;
  seriesHref: string;
  posts: SeriesCarouselPost[];
  /** 現在表示中の記事の位置（0始まり） */
  currentIndex: number;
};

/** 端が見切れているかの判定に持たせる余裕。1px未満の端数でフェードが点滅するのを防ぐ */
const EDGE_EPSILON = 4;
/**
 * 端のフェードの幅(px)。
 *
 * scroll-padding にも同じ値を使う。こうしないと、Tab でフォーカスしたカードや
 * スナップで止まったカードが端にぴったり付き、フェードの下に潜って
 * フォーカスリングごと薄くなる。
 */
const EDGE_FADE = 24;

/**
 * 記事を読み終えた位置に置く、連載の横スライダー。
 *
 * 本文の前の SeriesNav は「今どこにいるか」を伝えるための縦の目次で、
 * 読む前に全部を見せると本文に入るまでが長くなるため畳んだ見た目にしている。
 * こちらは読み終えた読者に「次にどれを読むか」を選ばせるのが目的なので、
 * 公開日まで載せたカードを横に並べて、一覧性より選びやすさを優先する。
 *
 * 既読の印は localStorage にしかないので Client Component。
 * リンクとタイトルはサーバー側から props で受け取るので、
 * JS が動かなくても「連載の記事へのリンクが横に並んだもの」としては成立する。
 */
export const SeriesCarousel = ({ seriesName, seriesHref, posts, currentIndex }: Props) => {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const [read, setRead] = useState<string[]>([]);
  // 「まだ続きがあるか」。矢印の活性とフェードの両方をこれ1つで決める。
  // 別々に持つと、片方だけ更新し忘れて矢印は押せるのにフェードが消える状態になる。
  const [overflow, setOverflow] = useState({ left: false, right: false });

  useEffect(() => {
    setRead(getReadArticles());
  }, []);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setOverflow({
      left: scrollLeft > EDGE_EPSILON,
      right: scrollLeft + clientWidth < scrollWidth - EDGE_EPSILON,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // 連載の途中の記事から開くと、現在地が右端の外にいて見えないことがある。
    // 現在地を左端に置くと、その右に「まだ読んでいない続き」が並ぶ。
    // scrollIntoView はページ全体を縦に動かしてしまうので使わず、
    // スライダーの scrollLeft だけを動かす。
    // 位置は offsetLeft ではなく実際の矩形の差で測る。offsetLeft の基準は
    // 最も近い position 付き祖先で、スライダー自身とは限らない。
    const current = el.children[currentIndex] as HTMLElement | undefined;
    if (current) {
      el.scrollLeft +=
        current.getBoundingClientRect().left - el.getBoundingClientRect().left - EDGE_FADE;
    }
    update();

    // 画面幅が変わると見切れの有無も変わる。カードは幅固定なので
    // 中身の変化まで見る必要はなく、スライダー自身のリサイズだけで足りる。
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentIndex, update]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const [first, second] = Array.from(el.children) as HTMLElement[];
    // カード1枚ぶん送る。隙間を含めた実測の間隔を使うので、
    // gap の値をコンポーネント側とCSS側の2箇所に書かずに済む。
    const step = second ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? el.clientWidth);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: step * direction, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  // 連載に1本しかないときは横に並べるものがない。
  // 「全1回」のスライダーは矢印も効かず、ただの重複した導線になる。
  if (posts.length < 2) return null;

  // 連載の説明は記事単位の Notion ではなくコード側（seriesMeta.ts）にある。
  // 連載名から直接引けるので、記事ページ側に props を増やさずここで解決する。
  const tagline = seriesMetaOf(seriesName)?.tagline;

  const mask = `linear-gradient(to right, ${
    overflow.left ? `transparent 0, #000 ${EDGE_FADE}px` : '#000 0'
  }, ${overflow.right ? `#000 calc(100% - ${EDGE_FADE}px), transparent 100%` : '#000 100%'})`;

  // 上に区切り線を引かない。すぐ上の PostNavigation が線を持っているので、
  // ここにも引くと「連載の次の記事 / 前後 / 連載全体」がそれぞれ罫線で囲まれ、
  // 同じ連載の話が3つの別々のセクションに見える。
  // 線は「連載の話」と「連載外（関連記事）」の境目の1本だけにする。
  return (
    <section
      aria-label={`連載「${seriesName}」の記事`}
      className='mt-12 px-4'
    >
      <div className='mb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex min-w-0 items-center gap-2'>
            <Library className='h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400' aria-hidden='true' />
            <h2 className='truncate text-lg font-bold text-slate-900 dark:text-slate-100'>{seriesName}</h2>
            <span className='shrink-0 text-sm text-slate-500 dark:text-slate-400'>全{posts.length}回</span>
          </div>
          <div className='ml-auto flex shrink-0 items-center gap-1'>
            <button
              type='button'
              onClick={() => scrollByCard(-1)}
              disabled={!overflow.left}
              aria-label='前の記事を表示'
              className='rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100'
            >
              <ChevronLeft className='h-4 w-4' aria-hidden='true' />
            </button>
            <button
              type='button'
              onClick={() => scrollByCard(1)}
              disabled={!overflow.right}
              aria-label='次の記事を表示'
              className='rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100'
            >
              <ChevronRight className='h-4 w-4' aria-hidden='true' />
            </button>
          </div>
        </div>
        {/* 連載の説明は1行だけ。ここは「連載とは何か」を読ませる場所ではなく、
            読み終えた読者が次の1本を選ぶ場所なので、全文を出すと選択の邪魔になる。
            続きは「この連載の一覧を見る」の先にある。
            未登録の連載では何も出さない（seriesMeta.ts に無くても壊れない）。 */}
        {tagline && (
          <p className='mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400'>{tagline}</p>
        )}
      </div>

      {/* 端のフェードは「まだ続きがある」ことを見た目で伝えるためのもの。
          両端とも見切れていないときは全面不透明にする（TocRail と同じ考え方）。
          カードは Tab でも辿れるので、フォーカスでスクロールしたときも
          onScroll 経由でフェードと矢印の状態が追従する。 */}
      <ol
        ref={scrollerRef}
        onScroll={update}
        className='scrollbar-slim flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3'
        style={{ maskImage: mask, WebkitMaskImage: mask, scrollPaddingInline: EDGE_FADE }}
      >
        {posts.map((post, i) => {
          const isCurrent = i === currentIndex;
          // 現在地には既読の印を出さない。今読んでいる記事にチェックが付くのは紛らわしい
          const isRead = !isCurrent && read.includes(post.id);
          const label = (
            <>
              <span className='flex items-center justify-between gap-2'>
                <span
                  className={`shrink-0 text-xs font-bold tabular-nums ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  第{i + 1}回
                </span>
                {isCurrent ? (
                  <span className='shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-blue-500'>
                    表示中
                  </span>
                ) : (
                  isRead && (
                    <span className='flex shrink-0 items-center gap-1 text-xs text-green-600 dark:text-green-500'>
                      <Check className='h-3.5 w-3.5' aria-hidden='true' />
                      読了
                    </span>
                  )
                )}
              </span>
              <span className='mt-2 line-clamp-3 font-semibold text-slate-900 dark:text-slate-100'>
                {post.title}
              </span>
              <time
                dateTime={post.publishedAt}
                className='mt-auto pt-3 text-xs text-slate-400 dark:text-slate-500'
              >
                {post.publishedAt.slice(0, 10).replace(/-/g, '/')}
              </time>
            </>
          );

          return (
            <li key={post.id} className='w-60 shrink-0 snap-start sm:w-64'>
              {isCurrent ? (
                // 今いるページへのリンクは押しても何も起きない。
                // リンクにせず「表示中」と明示して、選択肢から外す。
                <span
                  aria-current='page'
                  className='flex h-full flex-col rounded-xl border border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/40'
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={`/blogs/${post.id}`}
                  className='flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <Link
        href={seriesHref}
        className='mt-1 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
      >
        この連載の一覧を見る
        <ArrowRight className='h-3.5 w-3.5' aria-hidden='true' />
      </Link>
    </section>
  );
};
