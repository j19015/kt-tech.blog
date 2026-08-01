import Link from 'next/link';
import { Github, Rss } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const LINK_CLASS =
  'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors';

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
 */
export const Footer = () => {
  return (
    <footer className='mt-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5'>
          {/* ブランド & 説明 */}
          <div className='col-span-2'>
            <Link href='/' className='text-xl font-bold text-slate-800 dark:text-slate-100'>
              kt-tech.blog
            </Link>
            <p className='mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
              実践的な技術記事とエンジニアリングの知見を発信。
              React, Next.js, TypeScript, Cloudflare, AIなどのモダン技術を中心に。
            </p>
            <div className='mt-5 flex items-center gap-4'>
              <a
                href='https://github.com/j19015'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-500 transition-all duration-200 hover:scale-110 hover:text-slate-600 dark:hover:text-slate-300'
                aria-label='GitHub'
              >
                <Github className='h-5 w-5' aria-hidden='true' />
              </a>
              <a
                href='https://x.com/tech_koki'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-500 transition-all duration-200 hover:scale-110 hover:text-slate-600 dark:hover:text-slate-300'
                aria-label='X (Twitter)'
              >
                <XIcon className='h-5 w-5' />
              </a>
              <a
                href='/feed.xml'
                className='text-slate-500 transition-all duration-200 hover:scale-110 hover:text-slate-600 dark:hover:text-slate-300'
                aria-label='RSS'
              >
                <Rss className='h-5 w-5' aria-hidden='true' />
              </a>
            </div>
          </div>

          <nav aria-labelledby='footer-nav'>
            <h2
              id='footer-nav'
              className='mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200'
            >
              Navigation
            </h2>
            <ul className='space-y-2.5 text-sm'>
              <li><Link href='/' className={LINK_CLASS}>Home</Link></li>
              <li><Link href='/blogs/page/1' className={LINK_CLASS}>Blog</Link></li>
              <li><Link href='/searches' className={LINK_CLASS}>Search</Link></li>
              <li><Link href='/bookmarks' className={LINK_CLASS}>Bookmarks</Link></li>
              <li><Link href='/about' className={LINK_CLASS}>About</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby='footer-explore'>
            <h2
              id='footer-explore'
              className='mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200'
            >
              Explore
            </h2>
            <ul className='space-y-2.5 text-sm'>
              <li><Link href='/categories' className={LINK_CLASS}>Categories</Link></li>
              <li><Link href='/tags' className={LINK_CLASS}>Tags</Link></li>
              <li><Link href='/series' className={LINK_CLASS}>Series</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className='mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200'>
              Legal
            </h2>
            <ul className='space-y-2.5 text-sm'>
              <li><Link href='/privacy' className={LINK_CLASS}>Privacy Policy</Link></li>
              <li><Link href='/contact' className={LINK_CLASS}>Contact</Link></li>
              <li><a href='/feed.xml' className={LINK_CLASS}>RSS</a></li>
              <li><a href='/sitemap.xml' className={LINK_CLASS}>Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className='mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row'>
          <p className='text-xs text-slate-500 dark:text-slate-500'>
            © {new Date().getFullYear()} kt-tech.blog. All rights reserved.
          </p>
          <p className='text-xs text-slate-500 dark:text-slate-500'>Built with Next.js &amp; Cloudflare Pages</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
