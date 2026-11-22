'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { event as gaEvent } from '@/../libs/gtag';

/**
 * 記事末の「参考になった」ボタン（Issue #455）。
 *
 * - 件数は /api/reactions/[slug] から取る。記事の HTML は CDN キャッシュのままにするため
 * - 押したときだけ Turnstile を読み込んで検証する。読むだけの人に外部スクリプトを配らない
 * - 押したことは localStorage に残し、同じブラウザからは2回押せないようにする。
 *   厳密な1人1回はやらない（個人情報や IP を持たない方針）
 * - サイトキーが無い、または API が 503（D1 未バインド）なら何も出さない
 * - GA4 に reaction_view / reaction_click / reaction_success / reaction_error を送る。
 *   件数だけだと「ボタンまで来ていない」「来たが押さない」「押したが失敗した」の区別が
 *   付かないため。記事ごとの比較は GA の page_path で行う
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const storageKey = (slug: string) => `kt-reaction:${slug}`;

/** 押せたときに 👍 の周りに散らす粒の向き（度） */
const BURST_ANGLES = [0, 60, 120, 180, 240, 300];

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
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile_missing')));
      script.onerror = () => {
        // 次に押したときに読み直せるよう、失敗した Promise を残さない
        turnstilePromise = null;
        script.remove();
        reject(new Error('turnstile_load'));
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
  const viewSentRef = useRef(false);
  // この画面で押して成功したときだけ演出する。開いた時点で押し済みの記事では動かさない
  const [celebrate, setCelebrate] = useState(false);

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

  // ボタンが実際に読者の目に入ったか。上の先読み（600px 手前）とは別に、半分以上見えたときに1回だけ送る
  const shown = status !== 'loading' && status !== 'unavailable';
  useEffect(() => {
    const root = rootRef.current;
    if (!shown || !root || viewSentRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          viewSentRef.current = true;
          gaEvent('reaction_view', { already_reacted: readReacted(slug) ? 1 : 0 });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [shown, slug]);

  const handleClick = useCallback(async () => {
    if (!SITE_KEY || (status !== 'ready' && status !== 'error')) return;
    const container = widgetRef.current;
    if (!container) return;
    setStatus('sending');
    gaEvent('reaction_click', { retry: status === 'error' ? 1 : 0 });

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
          'error-callback': () => reject(new Error('turnstile_error')),
          'expired-callback': () => reject(new Error('turnstile_expired')),
          'timeout-callback': () => reject(new Error('turnstile_timeout')),
        });
      });

      const res = await fetch(`/api/reactions/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error(`http_${res.status}`);
      const data = (await res.json()) as { count: number };
      setCount(data.count);
      writeReacted(slug);
      setCelebrate(true);
      setStatus('done');
      gaEvent('reaction_success');
    } catch (e) {
      setStatus('error');
      // どこで失敗したか（Turnstile の読み込み・判定、API の応答）を送る。想定外の例外は unknown に丸める
      const reason = e instanceof Error && /^(turnstile_[a-z]+|http_\d{3})$/.test(e.message) ? e.message : 'unknown';
      gaEvent('reaction_error', { reason });
    } finally {
      if (turnstile && widgetId) turnstile.remove(widgetId);
    }
  }, [slug, status]);

  if (!SITE_KEY || status === 'unavailable') return null;

  const done = status === 'done';
  const busy = status === 'loading' || status === 'sending';
  const pop = done && celebrate;

  return (
    <div ref={rootRef} className='text-center'>
      <button
        type='button'
        onClick={handleClick}
        disabled={done || busy}
        aria-pressed={done}
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 enabled:active:scale-95 motion-reduce:transition-colors motion-reduce:active:scale-100 disabled:cursor-default ${pop ? 'animate-reaction-ring motion-reduce:animate-none' : ''} ${
          done
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 disabled:opacity-60 disabled:hover:border-slate-200 disabled:hover:text-slate-700 dark:disabled:hover:border-slate-700 dark:disabled:hover:text-slate-200'
        }`}
      >
        <span className='relative inline-flex' aria-hidden='true'>
          <ThumbsUp
            className={`w-4 h-4 transition-transform ${done ? 'fill-current' : ''} ${
              pop ? 'animate-reaction-pop motion-reduce:animate-none' : ''
            } ${status === 'sending' ? 'animate-pulse' : ''}`}
          />
          {pop &&
            BURST_ANGLES.map((angle) => (
              <span
                key={angle}
                className='absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-blue-400 animate-reaction-burst motion-reduce:hidden'
                style={{ '--angle': `${angle}deg` } as React.CSSProperties}
              />
            ))}
        </span>
        参考になった
        {/* 件数が届く前も幅を取っておき、届いた瞬間にボタンの幅が変わらないようにする */}
        <span className='min-w-[2ch] overflow-hidden tabular-nums text-slate-500 dark:text-slate-400' aria-label={count === null ? undefined : `${count}件`}>
          {/* 押せたら新しい件数を下からせり上げる。key を変えてアニメーションをやり直させる */}
          <span key={pop ? 'after' : 'before'} className={`inline-block ${pop ? 'animate-reaction-count motion-reduce:animate-none' : ''}`}>
            {count ?? ''}
          </span>
        </span>
      </button>
      <p className='mt-2 min-h-[1.25rem] text-xs text-slate-500 dark:text-slate-400' aria-live='polite'>
        {done && (
          <span className={pop ? 'inline-block animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none' : undefined}>
            ありがとうございます！
          </span>
        )}
        {status === 'error' && '送信できませんでした。時間をおいてもう一度お試しください。'}
      </p>
      {/* Turnstile の置き場所。確認が要るときだけここにチェックボックスが出る */}
      <div ref={widgetRef} className='flex justify-center empty:hidden' />
    </div>
  );
};
