import Sidebar from '@/components/SIdebar/Sidebar';

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-2 grid-flow-row">
      <div className="col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-100 p-6 shadow-md">
        <div className="bg-white text-black p-8 rounded-lg">
          <div className="text-center mt-1 w-full col-span-2">
            <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-indigo-900 mb-6">Introduction</h2>
          </div>
          <div className="text-center">
            <img
              src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/profile-images/1691862464"
              alt="J19015"
              width={150}
              height={150}
              className="mx-auto rounded-full"
            />
            <h1 className="text-4xl font-bold mt-4">j19015</h1>
            <div className="flex justify-center mt-2 space-x-4">
              <a
                href="https://github.com/j19015"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/tech_koki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Twitter
              </a>
              {/* Add other social media links here */}
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-8 underline">自己紹介</h2>
          <p className="text-gray-800 mt-2">
            初めまして、<strong>j19015</strong> と申します。

          </p>
          <h2 className="text-2xl font-semibold mt-8 underline">エンジニアとしての自己紹介</h2>
          <p className="text-gray-800 mt-2">
            Webアプリケーションエンジニアとして、Webアプリケーションの開発に携わっています。<br/>
            フロントエンドからバックエンド、インフラまでを担当しています。
          </p>
          <h2 className="text-2xl font-semibold mt-8 underline">技術スタック</h2>
          <ul className="list-disc pl-6 text-gray-800 mt-2">
            <li>プログラミング言語: Node.js、Ruby、PHP、C、C++、JavaScript、TypeScript</li>
            <li>フレームワーク: Express、Rails, Next.js</li>
            <li>ライブラリ: React、Bootstrap、MUI、Tailwind CSS</li>
            <li>データベース: PostgreSQL</li>
            <li>ORM: TypeORM、Gin</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 underline">経歴</h2>
          <ul className="list-disc pl-6 text-gray-800 mt-2">
            <li>会社VにWebエンジニアとして新卒一年目として勤務(2023/9月時点で、現職)</li>
            <li>会社Iで業務委託メンター(副業)としてプログラミングを学び、受講生対応を二年間行っている(現在進行形)</li>
            <li>会社VのQAエンジニア(テストエンジニア)として実務経験を一ヶ月経験</li>
            <li>会社Eで対面教室メンターとして一年間活動</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 underline">勉強中のこと</h2>
          <p className="text-gray-800 mt-2">
            現在はAWSのインフラ周りの設計をメインに業務をしております。<br/>
            個人では、Next.jsを使ってブログを使って、アプリケーションの作成に取り組んでいます。
          </p>
          <h2 className="text-2xl font-semibold mt-8 underline">やったこと</h2>
          <ul className="list-disc pl-6 text-gray-800 mt-2">
            <li>記入中....</li>
          </ul>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
