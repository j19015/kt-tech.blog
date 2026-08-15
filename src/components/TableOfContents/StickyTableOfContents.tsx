'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { tocDepth, groupToc, shouldCollapse, type TocItem } from '@/lib/toc';

/** 階層ごとの字下げ。左のレールからの距離を段階的に広げる */
const INDENT = ['pl-4', 'pl-8', 'pl-12'] as const;

export const StickyTableOfContents = ({ toc }: { toc: TocItem[] }) => {
  const [activeId, setActiveId] = useState<string>('');
  const listRef = useRef<HTMLUListElement>(null);

  // 現在地の判定。
  //
  // スクロールイベントで毎フレーム位置を測ると強制同期レイアウトでジャンクの
  // 原因になるので、IntersectionObserver を「何か変わった」の合図としてだけ使い、
  // そのタイミングで見出しの位置を1回読んで判定する（見出しは多くても数十個）。
  //
  // 「画面上部の帯に入った見出し」だけで判定していたときは、目次のリンクや
  // ブラウザ内検索で一気に飛ぶと、帯を素通りした見出しに IO が反応せず
  // 現在地が前のままになっていた（実測: 1500px から 4000px へ飛ばすと
  // 5つ手前の見出しが選ばれたままだった）。
  // 「ヘッダーより上にある最後の見出し」を選べば、どこへ飛んでも正しくなる。
  useEffect(() => {
    if (toc.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const HEADER_OFFSET = 96;
    const update = () => {
      let current = elements[0];
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= HEADER_OFFSET) current = el;
        else break;
      }
      setActiveId(current.id);
    };

    const observer = new IntersectionObserver(update, {
      // 見出しが画面上部の帯を出入りするたびに再判定する
      rootMargin: `-${HEADER_OFFSET}px 0px -60% 0px`,
      threshold: 0,
    });
    elements.forEach((el) => observer.observe(el));
    update();
    return () => observer.disconnect();
  }, [toc]);

  // 現在地が目次の表示範囲から外れたときだけ、目次側をスクロールして追いかける。
  useEffect(() => {
    const list = listRef.current;
    if (!activeId || !list) return;
    const item = list.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);
    if (!item) return;

    // offsetTop は「直近の position 指定済み祖先」からの距離なので、
    // sticky な祖先を基準にしてしまい ul のスクロール量とずれていた。
    // 矩形の差分で取れば、どこを基準にしていても正しい相対位置になる。
    // スクロールするのは目次の <ul> ではなく、右カラム全体のレール。
    // 見つからなければ何もしない（モバイルなど、レールが無い場所で暴発させない）。
    const rail = list.closest<HTMLElement>('[data-toc-rail]');
    if (!rail) return;

    const itemRect = item.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    const isVisible = itemRect.top >= railRect.top && itemRect.bottom <= railRect.bottom;
    // 見えているのに毎回スクロールすると、読んでいる最中に目次が勝手に動いて落ち着かない
    if (isVisible) return;

    rail.scrollTo({
      top:
        rail.scrollTop + (itemRect.top - railRect.top) - rail.clientHeight / 2 + itemRect.height / 2,
      behavior: 'smooth',
    });
  }, [activeId]);

  // preventDefault + pushState をやめ、ブラウザ標準のアンカー移動に任せる。
  // 以前は目次を押すたびに履歴が積まれ、戻るボタンで前のページに帰れなくなっていた。
  // ヘッダー分のオフセットは globals.css の scroll-padding-top が担当する。
  const handleClick = (id: string) => setActiveId(id);

  const groups = useMemo(() => groupToc(toc), [toc]);
  const collapse = useMemo(() => shouldCollapse(toc), [toc]);

  // 読んでいる章とは別に、ユーザーが自分で開いた章。
  // 「この先どんな話が続くのか」を、そこまでスクロールせずに覗けるようにする。
  const [peekedId, setPeekedId] = useState<string | null>(null);

  if (toc.length === 0) return null;

  return (
    <nav aria-label='目次'>
      <h2 className='mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
        目次
      </h2>

      {/* レールは <ul> 側に1本だけ通す。
          以前は項目ごとに border-l を持たせたうえで階層別に ml をずらしていたため、
          縦線が段違いに途切れて並び、左端がガタついていた。
          高さの制限とスクロールは親のレール（[data-toc-rail]）が持つ。 */}
      <ul ref={listRef} className='border-l border-slate-200 dark:border-slate-700'>
        {groups.map((group, gi) => {
          // 読んでいる章だけ下位見出しを開く。
          // 見出しの多い記事で全部並べると目次が本文より長くなり、
          // 内側にスクロールバーが出て全体像が見えなくなる。
          const key = group.parent?.id ?? `group-${gi}`;
          const isCurrent =
            group.parent?.id === activeId || group.children.some((child) => child.id === activeId);
          const isOpen = !collapse || isCurrent || peekedId === key;
          const panelId = `toc-group-${gi}`;
          return (
            <li key={key}>
              {group.parent && (
                <TocLink
                  item={group.parent}
                  activeId={activeId}
                  onSelect={handleClick}
                  toggle={
                    collapse && group.children.length > 0
                      ? {
                          isOpen,
                          panelId,
                          // 読んでいる章は閉じても次のスクロールで開き直るだけなので、畳ませない
                          onToggle: () => setPeekedId(isOpen && !isCurrent ? null : key),
                        }
                      : undefined
                  }
                />
              )}
              {group.children.length > 0 && (
                <ul id={panelId} hidden={!isOpen}>
                  {group.children.map((child) => (
                    <li key={child.id}>
                      <TocLink item={child} activeId={activeId} onSelect={handleClick} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/** 目次の1項目。章見出しと小見出しで見た目を変える */
const TocLink = ({
  item,
  activeId,
  onSelect,
  toggle,
}: {
  item: TocItem;
  activeId: string;
  onSelect: (id: string) => void;
  /** 下位見出しの開閉。折りたたむ必要のない目次では渡さない */
  toggle?: { isOpen: boolean; panelId: string; onToggle: () => void };
}) => {
  const isActive = activeId === item.id;
  const depth = tocDepth(item.tag);
  return (
    // 現在地は -ml-px の太い線で共通レールを上書きする。
    // レール自体は動かないので段差にならない。
    // 開閉ボタンはリンクの隣に置く。リンクの中に入れると
    // 「小見出しを覗きたいだけ」でも本文が飛んでしまう。
    <div
      className={`-ml-px flex items-start border-l-2 transition-colors ${
        isActive
          ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
          : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
      }`}
    >
      <a
        href={`#${item.id}`}
        onClick={() => onSelect(item.id)}
        title={item.text}
        data-toc-id={item.id}
        aria-current={isActive ? 'location' : undefined}
        className={`min-w-0 flex-1 py-1.5 pr-1 leading-snug ${INDENT[depth]} ${
          depth === 0 ? 'text-[13px]' : 'text-xs'
        } ${isActive ? 'font-normal' : ''}`}
      >
        {/* 2行までに収める。3行以上の見出しが並ぶと目次が本文より長くなる */}
        <span className='line-clamp-2'>{item.text}</span>
      </a>
      {toggle && (
        <button
          type='button'
          onClick={toggle.onToggle}
          aria-expanded={toggle.isOpen}
          aria-controls={toggle.panelId}
          aria-label={`${item.text} の小見出しを${toggle.isOpen ? '閉じる' : '開く'}`}
          className='shrink-0 self-stretch px-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'
        >
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${toggle.isOpen ? 'rotate-90' : ''}`}
            aria-hidden='true'
          />
        </button>
      )}
    </div>
  );
};
