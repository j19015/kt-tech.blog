import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'kt-tech.blog における個人情報の取り扱い、アクセス解析ツールの利用、免責事項について。',
  alternates: { canonical: `${siteUrl}/privacy` },
};

/**
 * プライバシーポリシー。
 *
 * 以前はフッターのモーダルにしか無く、URL を持たないため
 * 共有もブックマークもクロールもできなかった。
 * Google AdSense のように「ポリシーページの URL」を求められる場面でも困る。
 */
export default function PrivacyPage() {
  return (
    <div className='max-w-3xl mx-auto px-4 pb-16'>
      <BreadcrumbNav items={[{ label: 'Privacy Policy', current: true }]} />

      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 px-2'>
        プライバシーポリシー
      </h1>

      <div className='mt-8 px-2 space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
        <section>
          <h2 className='mb-2 text-base font-semibold text-slate-800 dark:text-slate-100'>
            1. 個人情報の利用目的
          </h2>
          <p>
            当サイトでは、お問い合わせの際に名前、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は質問に対する回答や必要な情報のご連絡に利用させていただくものであり、目的以外では利用いたしません。
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-base font-semibold text-slate-800 dark:text-slate-100'>
            2. 個人情報の第三者への開示
          </h2>
          <p className='mb-2'>
            当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
          </p>
          <ul className='list-disc space-y-1 pl-5'>
            <li>本人のご了解がある場合</li>
            <li>法令等への協力のため、開示が必要となる場合</li>
          </ul>
        </section>

        <section>
          <h2 className='mb-2 text-base font-semibold text-slate-800 dark:text-slate-100'>
            3. アクセス解析ツールについて
          </h2>
          <p>
            当サイトでは、Googleアナリティクスを利用しています。トラフィックデータの収集のためにCookieを使用していますが、匿名で収集されており個人を特定するものではありません。Cookieを無効にすることで収集を拒否できます。
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-base font-semibold text-slate-800 dark:text-slate-100'>4. 免責事項</h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>掲載している画像の著作権・肖像権等は各権利所有者に帰属します。問題がございましたらご連絡ください。</li>
            <li>外部リンク先で提供される情報・サービスについて一切の責任を負いません。</li>
            <li>コンテンツの正確性・完全性を保証するものではございません。</li>
            <li>掲載内容によって生じた損害等の責任を負いかねます。</li>
          </ul>
        </section>

        <p className='border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500'>
          最終更新日: 2026年3月
        </p>

        <p className='text-sm'>
          本ポリシーに関するお問い合わせは
          <Link href='/contact' className='mx-1 text-blue-600 underline hover:no-underline dark:text-blue-400'>
            お問い合わせ
          </Link>
          からお願いします。
        </p>
      </div>
    </div>
  );
}
