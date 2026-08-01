'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useDialog } from '@/lib/useDialog';
import { parseQuery } from '@/lib/search';

type Props = { isOpen: boolean; onClose: () => void };

type IndexEntry = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  series: string;
};

const MAX_SUGGESTIONS = 6;

/** モーダル用の簡易マッチ。検索ページ本体と同じく全ての語を含むことを条件にする */
function suggest(index: IndexEntry[], raw: string): IndexEntry[] {
  const terms = parseQuery(raw);
  if (terms.length === 0) return [];
  return index
    .filter((entry) => {
      const haystack = [entry.title, entry.description, entry.category, entry.series, ...entry.tags]
        .join(' ')
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .sort((a, b) => {
      // タイトルに含まれるものを優先。概要だけの一致は関連が薄いことが多い
      const at = terms.every((t) => a.title.toLowerCase().includes(t)) ? 0 : 1;
      const bt = terms.every((t) => b.title.toLowerCase().includes(t)) ? 0 : 1;
      return at - bt;
    })
    .slice(0, MAX_SUGGESTIONS);
}

export const SearchModal = ({ isOpen, onClose }: Props) => {
  const [query, setQuery] = useState('');
  const [isMac, setIsMac] = useState(true);
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [isLoadingIndex, setLoadingIndex] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setQuery('');
    setActive(0);
    onClose();
  }, [onClose]);

  const dialogRef = useDialog<HTMLDivElement>(isOpen, close);

  // ショートカット表記をOSに合わせる。Windows/Linuxでも ⌘K と出ていた
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // インデックスは最初にモーダルを開いたときだけ取りに行く。
  // 全ページで先読みすると、検索を使わない人にも転送コストがかかる。
  useEffect(() => {
    if (!isOpen || index !== null || isLoadingIndex) return;
    setLoadingIndex(true);
    fetch('/api/search-index')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setIndex(Array.isArray(data) ? data : []))
      .catch(() => setIndex([]))
      .finally(() => setLoadingIndex(false));
  }, [isOpen, index, isLoadingIndex]);

  const suggestions = useMemo(() => (index ? suggest(index, query) : []), [index, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const goToSearchPage = useCallback(() => {
    if (query.trim()) {
      router.push(`/searches?text=${encodeURIComponent(query.trim())}`);
      close();
    }
  }, [query, router, close]);

  const openArticle = useCallback(
    (id: string) => {
      router.push(`/blogs/${id}`);
      close();
    },
    [router, close]
  );

  if (!isOpen) return null;

  const modKey = isMac ? '⌘' : 'Ctrl+';

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IMEの変換確定のEnterで検索が走らないようにする。
    // これが無いと日本語を入力しても未確定の読みで検索されてしまう。
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      // 候補の下に「すべての結果を見る」があるので長さ+1で回す
      setActive((i) => (i + 1) % (suggestions.length + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length + 1) % (suggestions.length + 1));
    } else if (e.key === 'Enter') {
      if (active < suggestions.length) openArticle(suggestions[active].id);
      else goToSearchPage();
    }
  };

  const activeId = active < suggestions.length ? `search-option-${active}` : 'search-option-all';

  return (
    <div className='fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={close} />
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label='記事を検索'
        className='relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden'
      >
        <div className='flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700'>
          <Search className='w-5 h-5 text-slate-400 flex-shrink-0' aria-hidden='true' />
          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='記事を検索...'
            aria-label='検索キーワード'
            role='combobox'
            aria-expanded={query.trim().length > 0}
            aria-controls='search-suggestions'
            aria-activedescendant={query.trim() ? activeId : undefined}
            autoComplete='off'
            className='flex-1 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none text-base'
            onKeyDown={onKeyDown}
          />
          {isLoadingIndex && <Loader2 className='w-4 h-4 text-slate-400 animate-spin' aria-hidden='true' />}
          <button
            onClick={close}
            aria-label='閉じる'
            className='p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          >
            <X className='w-4 h-4' aria-hidden='true' />
          </button>
        </div>

        {/* 候補表示。以前は Enter を押して検索ページに飛ぶまで何も分からず、
            キーワードが的外れかどうかも判断できなかった。 */}
        {query.trim() && (
          <ul id='search-suggestions' role='listbox' aria-label='検索候補' className='max-h-80 overflow-y-auto'>
            {suggestions.map((entry, i) => (
              <li key={entry.id}>
                <button
                  id={`search-option-${i}`}
                  role='option'
                  aria-selected={i === active}
                  onClick={() => openArticle(entry.id)}
                  onMouseEnter={() => setActive(i)}
                  className={`block w-full px-4 py-2.5 text-left ${
                    i === active ? 'bg-slate-100 dark:bg-slate-800' : ''
                  }`}
                >
                  <span className='block truncate text-sm text-slate-800 dark:text-slate-100'>{entry.title}</span>
                  {(entry.category || entry.tags.length > 0) && (
                    <span className='mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400'>
                      {[entry.category, ...entry.tags.slice(0, 3).map((t) => `#${t}`)].filter(Boolean).join(' ')}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {index !== null && suggestions.length === 0 && (
              <li className='px-4 py-3 text-sm text-slate-500 dark:text-slate-400'>
                一致する記事が見つかりません
              </li>
            )}
            <li className='border-t border-slate-200 dark:border-slate-700'>
              <button
                id='search-option-all'
                role='option'
                aria-selected={active === suggestions.length}
                onClick={goToSearchPage}
                onMouseEnter={() => setActive(suggestions.length)}
                className={`block w-full px-4 py-2.5 text-left text-sm text-slate-600 dark:text-slate-300 ${
                  active === suggestions.length ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                「{query.trim()}」の検索結果をすべて見る
              </button>
            </li>
          </ul>
        )}

        <div className='px-4 py-2.5 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700'>
          <span>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>↑↓</kbd> で選択
          </span>
          <span>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>Enter</kbd> で開く
          </span>
          <span>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>Esc</kbd> で閉じる
          </span>
          <span className='ml-auto'>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>{modKey}K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
