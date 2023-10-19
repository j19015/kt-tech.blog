import React from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose } :PrivacyPolicyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-3/4 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 content" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
        <button 
            onClick={onClose} 
            className="absolute right-6 top-6 text-2xl transition duration-300"
            >
            <span className=''>
                ✖︎
            </span>
        </button>
        <h2 className="text-3xl font-semibold mb-7">Privacy Policy</h2>
        <h3 className='text-base mb-3 lg:text-xl font-semibold'>1.個人情報の利用目的</h3>
        <p className='mb-3 text-sm lg:text-base'>
          当サイトでは、メールでのお問い合わせ、メールマガジンへの登録などの際に、名前、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
        </p>
        <h3 className='text-base mb-3 lg:text-xl font-semibold'>2.個人情報の第三者への開示</h3>
        <p>
          当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
        </p>
        <ul className='mb-3 list-disc'>
          <li className='ml-6 lg:ml-8 text-sm lg:text-base'>本人のご了解がある場合</li>
          <li className='ml-6 lg:ml-8 text-sm lg:text-base'>法令等への協力のため、開示が必要となる場合</li>
        </ul>
        <h3 className='text-base mb-3 lg:text-xl font-semibold'>3.アクセス解析ツールについて</h3>
        <p className='mb-3 text-sm lg:text-base'>
          当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくはこちらをご参照ください。
        </p>
        <h3 className='text-base mb-3 lg:text-xl font-semibold'>4.免責事項</h3>
        <p>
          <ul className='list-disc'>
            <li className='ml-6 lg:ml-8 text-sm lg:text-base'>
              当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的ではございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が直接メールでご連絡下さい。確認後、対応させて頂きます。
            </li>
            <li className='ml-6 lg:ml-8 text-sm lg:text-base'>
              当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
            </li>
            <li className='ml-6 lg:ml-8 text-sm lg:text-base'>
              当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。情報の正確性・完全性を保証するものではございませんので、予めご了承ください。
            </li>
            <li className='ml-6 lg:ml-8 text-sm lg:text-base'>
              当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
            </li>
            <li className='ml-6 lg:ml-8 text-sm lg:text-base'>
              当サイトを閲覧する際の推奨ブラウザは、「Google Chrome」、「Mozilla Firefox」の各最新版となります。その他のブラウザで閲覧した場合、表示が崩れたり、正常に動作しない場合がございますので、予めご了承ください。
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
