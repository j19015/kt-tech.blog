import Sidebar from '@/components/SIdebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareGithub,faSquareTwitter } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/markdown.css'
import Image from 'next/image';

export const metadata = {
  title: '自己紹介ページ',
  description: '自己紹介のページになります。LTなどで使えればと思っています。',
  openGraph: {
    title: '自己紹介ページ',
    description: '自己紹介のページになります。LTなどで使えればと思っています。',
    locale: 'ja_JP',
    type: 'website',
    images: 'https://kt-tech.blog/opengraph-image.png'
  },
  twitter: {
    card: 'summary_large_image',
    title: '自己紹介ページ',
    description: '自己紹介のページになります。LTなどで使えればと思っています。',
    site: '@tech_koki',
    creator: '@tech_koki',
  },
};

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2 lg:p-4"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
        <div className="rounded-lg introduction p-2 pt-6 pb-6 content">
          <div className="text-center">
            <Image
              src="/images/profile_image.png"
              alt="J19015"
              width={400}
              height={400}
              className="mx-auto rounded-md"
            />
            <h1 className="text-4xl font-bold mt-4">Koki</h1>
            <div className="flex justify-center mt-2 space-x-4">
              <a
                href="https://github.com/j19015"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon 
                  icon={faSquareGithub}
                  size="3x"
                />
              </a>
              <a
                href="https://twitter.com/tech_koki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <FontAwesomeIcon 
                  icon={faSquareTwitter}
                  size="3x"
                />
              </a>
              {/* Add other social media links here */}
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-8 ">自己紹介</h2>
          <p className=" mt-2 pl-3">
            初めまして、Webエンジニアの<strong>Koki</strong> と申します。<br/>
            都内のIT企業に所属しつつ、地方に移住しており、フルリモートで働いています。
          </p>
          <h2 className="text-2xl font-semibold mt-8 ">趣味</h2>
          <p className=" mt-2 pl-3">
            ドライブがかなり好きです。<strong>CX-3</strong>が愛車です。<br/>
            ドライブでよく行く場所は岐阜の山奥だったり、富士の朝霧高原だったりと自然が好きです。
          </p>
          <h2 className="text-2xl font-semibold mt-8">勉強中の分野</h2>
          <p className=" mt-2 pl-6">
            サーバレスアーキテクチャの概念理解を深めようと、記事を漁ってベストプラクティスを模索しています。<br/>
            Next.js×MicroCMS×Vercelを使ってブログを作成しています。<br/>
            それ以外にも、Ruby on Railsを用いてアプリの作成も行なっています。
          </p>

          <h2 className="text-2xl font-semibold mt-8">2024年度中の目標</h2>
          <ul className="list-disc pl-10 mt-2">
            <li>AWS SAA取得</li>
            <li>Paiza Aランク到達(現在はBランク)</li>
            <li>Qiita,Zenn,自分のブログ等々でのアウトプットを週一ペースで行う。</li>
          </ul>
        </div>
      </div>
      <div className="lg:col-span-1"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
    </div>
  );
}
