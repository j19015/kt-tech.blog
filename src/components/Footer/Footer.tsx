import Link from 'next/link';
import { Github, Rss } from 'lucide-react';
import { SiQiita } from 'react-icons/si';
import { AUTHOR_PROFILES } from '@/lib/author';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const PRIMARY_LINKS = [
  { href: '/blogs/page/1', label: 'Blog' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
  { href: '/series', label: 'Series' },
  { href: '/searches', label: 'Search' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/about', label: 'About' },
];

// feed.xml と sitemap.xml はページではないので next/link を使わない
const SECONDARY_LINKS = [
  { href: '/privacy', label: 'Privacy Policy', plain: false },
  { href: '/contact', label: 'Contact', plain: false },
  { href: '/feed.xml', label: 'RSS', plain: true },
  { href: '/sitemap.xml', label: 'Sitemap', plain: true },
];

const SOCIAL_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100';

/**
 * フッター。
 *
 * サイドバーはトップと記事詳細に出ないため、そこではフッターが唯一の
 * 全ページ共通の導線になる。にもかかわらず Home / Blog / About の3つしかなく、
 * カテゴリ・タグ・アーカイブ・サイトマップへの入口がどこにも無かった。
 *
 * 以前はモーダルの state のために 'use client' だったが、
 * モーダルは実ページ（/privacy・/contact）に置き換えたので state が不要になった。
 *
 * ここで Notion からカテゴリ・タグの一覧を取ることは意図的に避けている。
 * フッターはルートレイアウトにあるため全ページで共有され、
 * データを取ると /about や /bookmarks のような静的ページまで巻き込む。
 * 静的ページではビルド時の値が焼き込まれて更新されなくなり、
 * 動的化すれば Notion を叩く必要のないページにまで往復が増える。
 * 個別の一覧は /categories・/tags・/series の各インデックスに任せる。
 *
 * 見た目は「4列のリンク＋©行」のテンプレート然とした形をやめ、リンクを2行にまとめて、
 * 下に画面幅いっぱいのワードマークを薄く敷いている。
 */
export const Footer = () => {
  return (
    <footer className='mt-20 overflow-hidden border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'>
      <div className='mx-auto max-w-6xl px-6 pt-14'>
        <div className='flex flex-col gap-10 md:flex-row md:items-start md:justify-between'>
          <div className='max-w-md'>
            <Link href='/' className='text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100'>
              kt-tech.blog
            </Link>
            <p className='mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
              実践的な技術記事とエンジニアリングの知見を発信。
              React, Next.js, TypeScript, Cloudflare, AIなどのモダン技術を中心に。
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <a
              href={AUTHOR_PROFILES.github}
              target='_blank'
              rel='noopener noreferrer'
              className={SOCIAL_CLASS}
              aria-label='GitHub'
            >
              <Github className='h-[18px] w-[18px]' aria-hidden='true' />
            </a>
            <a
              href={AUTHOR_PROFILES.x}
              target='_blank'
              rel='noopener noreferrer'
              className={SOCIAL_CLASS}
              aria-label='X (Twitter)'
            >
              <XIcon className='h-4 w-4' />
            </a>
            {/* Qiita からはこのブログへリンクしているのに、逆向きの導線が無かった（#594） */}
            <a
              href={AUTHOR_PROFILES.qiita}
              target='_blank'
              rel='noopener noreferrer'
              className={SOCIAL_CLASS}
              aria-label='Qiita'
            >
              <SiQiita className='h-4 w-4' aria-hidden='true' />
            </a>
            <a href='/feed.xml' className={SOCIAL_CLASS} aria-label='RSS'>
              <Rss className='h-[18px] w-[18px]' aria-hidden='true' />
            </a>
          </div>
        </div>

        <nav aria-label='フッター' className='mt-12'>
          <ul className='flex flex-wrap gap-x-7 gap-y-3 text-base font-medium'>
            {PRIMARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs'>
            {SECONDARY_LINKS.map((link) => {
              const className =
                'text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300';
              return (
                <li key={link.href}>
                  {link.plain ? (
                    <a href={link.href} className={className}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={className}>
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='mt-10 flex flex-col gap-1 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 sm:flex-row sm:justify-between'>
          <p>© {new Date().getFullYear()} kt-tech.blog</p>
          <p>Built with Next.js &amp; Cloudflare Pages</p>
        </div>

        {/* 飾りのワードマーク。幅に合わせて文字の大きさを決め（cqw）、下端を少し切って沈ませる */}
        <div aria-hidden='true' className='pointer-events-none mt-6 select-none [container-type:inline-size]'>
          <p className='-mb-[0.06em] whitespace-nowrap bg-gradient-to-b from-slate-300 to-slate-50 bg-clip-text text-center text-[17.6cqw] font-black leading-[0.9] tracking-[-0.06em] text-transparent dark:from-slate-700 dark:to-slate-900/0'>
            kt-tech.blog
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
