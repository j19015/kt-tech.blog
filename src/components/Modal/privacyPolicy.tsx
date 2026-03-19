'use client';
import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className='fixed inset-0 z-50 bg-black/40' />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-2xl max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden'>
          <div className='sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between'>
            <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
              プライバシーポリシー
            </h2>
            <button onClick={onClose} className='p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors'>
              <X className='w-4 h-4 text-slate-500' />
            </button>
          </div>

          <div className='px-6 py-5 overflow-y-auto max-h-[calc(80vh-60px)] text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-6'>
            <section>
              <h3 className='text-base font-semibold text-slate-800 dark:text-slate-200 mb-2'>1. 個人情報の利用目的</h3>
              <p>当サイトでは、お問い合わせの際に名前、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は質問に対する回答や必要な情報のご連絡に利用させていただくものであり、目的以外では利用いたしません。</p>
            </section>

            <section>
              <h3 className='text-base font-semibold text-slate-800 dark:text-slate-200 mb-2'>2. 個人情報の第三者への開示</h3>
              <p className='mb-2'>当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</p>
              <ul className='list-disc pl-5 space-y-1'>
                <li>本人のご了解がある場合</li>
                <li>法令等への協力のため、開示が必要となる場合</li>
              </ul>
            </section>

            <section>
              <h3 className='text-base font-semibold text-slate-800 dark:text-slate-200 mb-2'>3. アクセス解析ツールについて</h3>
              <p>当サイトでは、Googleアナリティクスを利用しています。トラフィックデータの収集のためにCookieを使用していますが、匿名で収集されており個人を特定するものではありません。Cookieを無効にすることで収集を拒否できます。</p>
            </section>

            <section>
              <h3 className='text-base font-semibold text-slate-800 dark:text-slate-200 mb-2'>4. 免責事項</h3>
              <ul className='list-disc pl-5 space-y-2'>
                <li>掲載している画像の著作権・肖像権等は各権利所有者に帰属します。問題がございましたらご連絡ください。</li>
                <li>外部リンク先で提供される情報・サービスについて一切の責任を負いません。</li>
                <li>コンテンツの正確性・完全性を保証するものではございません。</li>
                <li>掲載内容によって生じた損害等の責任を負いかねます。</li>
              </ul>
            </section>

            <p className='text-xs text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800'>
              最終更新日: 2026年3月
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyModal;
