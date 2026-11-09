'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThumbsUp } from 'lucide-react';

/**
 * 記事末の「参考になった」ボタン（Issue #455）。
 *
 * - 件数は /api/reactions/[slug] から取る。記事の HTML は CDN キャッシュのままにするため
 * - 押したときだけ Turnstile を読み込んで検証する。読むだけの人に外部スクリプトを配らない
 * - 押したことは localStorage に残し、同じブラウザからは2回押せないようにする。
 *   厳密な1人1回はやらない（個人情報や IP を持たない方針）
 * - サイトキーが無い、または API が 503（D1 未バインド）なら何も出さない
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const storageKey = (slug: string) => `kt-reaction:${slug}`;

type TurnstileApi = {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      appearance?: 'always' | 'execute' | 'interaction-only';
      theme?: 'auto' | 'light' | 'dark';
      language?: string;
      retry?: 'auto' | 'never';
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
      'timeout-callback'?: () => void;
    }
  ): string | undefined;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstilePromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstilePromise) {
    turnstilePromise = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
      script.onerror = () => {
        // 次に押したときに読み直せるよう、失敗した Promise を残さない
        turnstilePromise = null;
        script.remove();
        reject(new Error('turnstile load failed'));
      };
      document.head.appendChild(script);
    });
  }
  return turnstilePromise;
}

function readReacted(slug: string): boolean {
  try {
    return localStorage.getItem(storageKey(slug)) !== null;
  } catch {
    return false;
  }
}

function writeReacted(slug: string) {
  try {
    localStorage.setItem(storageKey(slug), new Date().toISOString());
  } catch {
    // プライベートブラウズなどで書けなくても、押せたこと自体は画面に出す
  }
}

type Status = 'loading' | 'ready' | 'sending' | 'done' | 'error' | 'unavailable';

export const ReactionButton = ({ slug }: { slug: string }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [count, setCount] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // 記事末にあるので、近づくまで件数を取りに行かない。
  // 冒頭だけ読んで離れた人の分まで Worker と D1 を叩かないため
  useEffect(() => {
    if (!SITE_KEY) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/reactions/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { count: number };
        if (cancelled) return;
        setCount(data.count);
        setStatus(readReacted(slug) ? 'done' : 'ready');
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(root);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [slug]);

  const handleClick = useCallback(async () => {
    if (!SITE_KEY || (status !== 'ready' && status !== 'error')) return;
    const container = widgetRef.current;
    if (!container) return;
    setStatus('sending');

    let turnstile: TurnstileApi | undefined;
    let widgetId: string | undefined;
    try {
      turnstile = await loadTurnstile();
      const token = await new Promise<string>((resolve, reject) => {
        widgetId = turnstile!.render(container, {
          sitekey: SITE_KEY,
          action: 'reaction',
          // 普段は見えない。Cloudflare が怪しいと判断したときだけチェックボックスが出る
          appearance: 'interaction-only',
          theme: 'auto',
          language: 'ja',
          retry: 'never',
          callback: resolve,
          'error-callback': () => reject(new Error('turnstile error')),
          'expired-callback': () => reject(new Error('turnstile expired')),
          'timeout-callback': () => reject(new Error('turnstile timeout')),
        });
      });

      const res = await fetch(`/api/reactions/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { count: number };
      setCount(data.count);
      writeReacted(slug);
      setStatus('done');
    } catch {
      setStatus('error');
    } finally {
      if (turnstile && widgetId) turnstile.remove(widgetId);
    }
  }, [slug, status]);

  if (!SITE_KEY || status === 'unavailable') return null;

  const done = status === 'done';
  const busy = status === 'loading' || status === 'sending';

  return (
    <div ref={rootRef} className='text-center'>
      <button
        type='button'
        onClick={handleClick}
        disabled={done || busy}
        aria-pressed={done}
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-colors disabled:cursor-default ${
          done
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 disabled:opacity-60 disabled:hover:border-slate-200 disabled:hover:text-slate-700 dark:disabled:hover:border-slate-700 dark:disabled:hover:text-slate-200'
        }`}
      >
        <ThumbsUp className={`w-4 h-4 ${done ? 'fill-current' : ''}`} aria-hidden='true' />
        参考になった
        {/* 件数が届く前も幅を取っておき、届いた瞬間にボタンの幅が変わらないようにする */}
        <span className='min-w-[2ch] tabular-nums text-slate-500 dark:text-slate-400' aria-label={count === null ? undefined : `${count}件`}>
          {count ?? ''}
        </span>
      </button>
      <p className='mt-2 min-h-[1.25rem] text-xs text-slate-500 dark:text-slate-400' aria-live='polite'>
        {done && 'ありがとうございます！'}
        {status === 'error' && '送信できませんでした。時間をおいてもう一度お試しください。'}
      </p>
      {/* Turnstile の置き場所。確認が要るときだけここにチェックボックスが出る */}
      <div ref={widgetRef} className='flex justify-center empty:hidden' />
    </div>
  );
};
