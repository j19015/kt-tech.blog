import { Metadata } from 'next';
import Link from 'next/link';
import { Github, Rss } from 'lucide-react';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'kt-tech.blog へのご連絡先。記事の誤りのご指摘やご感想は X / GitHub からお願いします。',
  alternates: { canonical: `${siteUrl}/contact` },
};

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const CHANNELS = [
  {
    href: 'https://x.com/tech_koki',
    label: 'X (Twitter)',
    sub: '@tech_koki',
    note: '記事の感想・軽い質問はこちらが一番早いです。',
    Icon: XIcon,
  },
  {
    href: 'https://github.com/j19015',
    label: 'GitHub',
    sub: 'j19015',
    note: 'コードの誤りは Issue や Pull Request でも歓迎です。',
    Icon: Github,
  },
];

/**
 * お問い合わせ。
 *
 * 以前はフッターのモーダルにしか無く、URL を持たないため
 * 「連絡先はここ」と共有することができなかった。
 */
export default function ContactPage() {
  return (
    <div className='max-w-3xl mx-auto px-4 pb-16'>
      <BreadcrumbNav items={[{ label: 'Contact', current: true }]} />

      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 px-2'>お問い合わせ</h1>
      <p className='mt-2 mb-8 px-2 text-sm text-slate-500 dark:text-slate-400'>
        記事の誤りのご指摘やご感想は、以下から気軽にどうぞ。
      </p>

      <ul className='space-y-3 px-2'>
        {CHANNELS.map(({ href, label, sub, note, Icon }) => (
          <li key={href}>
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
            >
              <Icon className='mt-0.5 h-5 w-5 shrink-0 text-slate-700 dark:text-slate-300' />
              <span className='min-w-0'>
                <span className='block font-semibold text-slate-900 dark:text-slate-100'>
                  {label}
                  <span className='ml-2 text-xs font-normal text-slate-500 dark:text-slate-400'>{sub}</span>
                </span>
                <span className='mt-1 block text-sm text-slate-600 dark:text-slate-300'>{note}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className='mt-8 px-2 text-sm text-slate-600 dark:text-slate-300'>
        <p>
          更新のお知らせは
          <a
            href='/feed.xml'
            className='mx-1 inline-flex items-center gap-1 text-blue-600 underline hover:no-underline dark:text-blue-400'
          >
            <Rss className='h-3.5 w-3.5' aria-hidden='true' />
            RSS
          </a>
          でも受け取れます。
        </p>
        <p className='mt-2'>
          個人情報の取り扱いについては
          <Link href='/privacy' className='mx-1 text-blue-600 underline hover:no-underline dark:text-blue-400'>
            プライバシーポリシー
          </Link>
          をご覧ください。
        </p>
      </div>
    </div>
  );
}
