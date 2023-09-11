import Sidebar from '@/components/SIdebar/Sidebar';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-2 grid-flow-row">
      <div className="col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300">
        <div className="bg-gray-300 text-black p-8 rounded-lg">
          <div className="text-center">
            <Image
              src="/your-profile-image.jpg" // プロフィール画像のパスを指定
              alt="J19015"
              width={150}
              height={150}
              className="mx-auto rounded-full"
            />
            <h1 className="text-3xl font-bold mt-4">Your Name</h1>
            <div className="flex justify-center mt-2">
              <a
                href="https://github.com/j19015"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 mx-2"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/yourtwitter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 mx-2"
              >
                Twitter
              </a>
              {/* 他のSNSリンクを追加する場合はここに追加 */}
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-8">自己紹介</h2>
          <p className="text-gray-800 mt-2">
            Webエンジニアとしての自己紹介を含む、私のプロフィールです。
          </p>
          <h2 className="text-2xl font-semibold mt-8">エンジニアとしての自己紹介</h2>
          <p className="text-gray-800 mt-2">
            ソフトウェアエンジニアとして、Webアプリケーションの開発に携わっています。<br/>フロントエンドからバックエンドまで幅広いスキルを持っています。
          </p>
          <h2 className="text-2xl font-semibold mt-8">技術スタック</h2>
          <ul className="list-disc pl-4 text-gray-800 mt-2">
            <li>プログラミング言語: Node.js,Ruby,PHP,C,C++,JapaScript,TypeScript</li>
            <li>フレームワーク: Express,Rails,React,Next.js, </li>
            <li>データベース: PostgreSQL</li>
            <li>ORM: TypeORM,Gin</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8">経歴</h2>
          <ul className="list-disc pl-4 text-gray-800 mt-2">
            <li>会社AでWebエンジニアとして新卒一年目</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8">勉強中のこと</h2>
          <p className="text-gray-800 mt-2">
            現在はAWSのインフラ周りの設計をメインに業務をしております。<br/>
            個人では、Next.jsを使ってブログを使って、アプリケーションの作成に取り組んでいます。
          </p>
          <h2 className="text-2xl font-semibold mt-8">やったこと</h2>
          <ul className="list-disc pl-4 text-gray-800 mt-2">
            <li>株式会社ブイキューブのQAエンジニア(テストエンジニア)として実務経験</li>
            <li>株式会社インフラトップで業務委託メンター(副業)としてプログラミングを学び、受講生対応</li>
            <li>エデュケーショナル・デザイン株式会社で対面教室メンターとして活動</li>
          </ul>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
