import Sidebar from '@/components/SIdebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareGithub,faSquareTwitter } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/markdown.css'
import Title from '@/components/Title/Title';

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
        <div className="rounded-lg introduction content p-2 pt-6 pb-6">
          <div className="text-center">
            <img
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
          <h2 className="text-2xl font-semibold mt-8">エンジニアとしての自己紹介</h2>
          <p className=" mt-2 pl-3">
            Webアプリケーションエンジニアとして、Webアプリケーションの開発に携わっています。<br/>
            業務ではバックエンド、インフラをメインに担当しています。<br/>
            サーバレスアーキテクチャ、クリーンアーキテクチャに興味があります。
          </p>
          <h2 className="text-2xl font-semibold mt-8">技術スタック</h2>
          <h3>実務経験あり</h3>
          <ul className="list-disc mt-6 pl-6 ml-5">
            <li className='mb-3'><strong>Language</strong> : JavaScript、TypeScript</li>
            <li className='mb-3'><strong>FW</strong> : ・・・</li>
            <li className='mb-3'><strong>Library</strong> : ・・・</li>
            <li className='mb-3'><strong>DB</strong> : PostgreSQL</li>
            <li className='mb-3'><strong>ORM</strong> : ・・・</li>
            <li className='mb-3'><strong>AWS</strong> : Lamda、APIGateway、CDK、CloudWatch、EC2、S3、Secrets Manager、MediaLive、Route53</li>
            <li className='mb-3'><strong>Tool</strong> : Git、bitBacket、Jira、Confluence</li>
          </ul>
          <h3 className='mt-10'>個人開発でのみ経験あり</h3>
          <ul className="list-disc mt-6 pl-6 ml-5">
            <li className='mb-3'><strong>Language</strong> : Ruby、PHP、C、C++、Java</li>
            <li className='mb-3'><strong>FW</strong> : Express、Rails、Next.js</li>
            <li className='mb-3'><strong>Library</strong> : React、Bootstrap、MUI、Tailwind CSS</li>
            <li className='mb-3'><strong>DB</strong> : MySQL</li>
            <li className='mb-3'><strong>ORM</strong> : TypeORM、Gin</li>
            <li className='mb-3'><strong>AWS</strong> : ECS、Fargate、ElasticCache、</li>
            <li className='mb-3'><strong>Tool</strong> : Gitlab、Figma、Miro、Trello、Notion,Docker</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8">経歴</h2>
          <ul className="timeline pl-4">
            <li>
              <p className="timeline-date">2023年4月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>V株式会社(現職)</h3>
                <p className='mt-3 pl-6'>新卒として入社をした会社になります。</p>
                <p className='mt-3 pl-6'>現在は主にサーバレスアーキテクチャを採用したWebアプリケーションのバックエンド開発をAWS CDKを用いて行っています。</p>
                <p className='mt-3 pl-6'>社内の新規事業コンテストなどにも参加をし、積極的に自らの管轄外での作業も行なっています。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2022年5月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>E株式会社(退職済み)</h3>
                <p className='mt-3 pl-6'>MineCraft,Robloxを用いたプログラミング教室の運営に携わりました。</p>
                <p className='mt-3 pl-6'>大人と子供との教え方の差にギャップを受けながらも、デジタルネイティブの受講生たちにかなり刺激を受けることができ、とても良い経験ができました。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2021年11月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>I株式会社(現職:副業)</h3>
                <p className='mt-3 pl-6'>HTML,CSS,Ruby,Rails,Git,AWSの教育、PF作成などにメンターとして携わっています。</p>
                <p className='mt-3 pl-6'>在籍は二年になり、2023/10/1付で、四段階あるメンターランクの一番上に位置するメンターランクである「<strong>JE</strong>」に到達しました。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2019年4月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>T大学</h3>
                <p className='mt-3 pl-6'>大卒資格を得るために専門と並行で通いました。</p>
                <p className='mt-3 pl-6'>専門学校で学んだこと以外の内容を重点的に勉強するので、両立に苦労しました。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2019年4月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>S専門学校</h3>
                <p className='mt-3 pl-6'>大学では得られないような専門的知識を学びました。</p>
                <p className='mt-3 pl-6'>学年の垣根を越えチーム開発を行なったり、プログラミングコンテストに参加したりしました。</p>
                <p className='mt-3 pl-6'>資格取得にも力を入れ、応用情報技術者試験に合格しました。</p>
              </div>
            </li>
            
          </ul>
          <h2 className="text-2xl font-semibold mt-8">勉強中の分野</h2>
          <p className=" mt-2 pl-6">
            サーバレスアーキテクチャの概念理解を深めようと、記事を漁ってベストプラクティスを模索しています。<br/>
            Next.js×MicroCMS×Vercelを使ってブログを作成しています。<br/>
            それ以外にも、Ruby on Railsを用いてアプリの作成も行なっています。
          </p>
          <h2 className="text-2xl font-semibold mt-8">資格</h2>
          <ul className="list-disc pl-10 mt-2">
            <li>応用情報技術者</li>
            <li>基本情報技術者</li>
            <li>国家技能検定 電子機器組み立て3級</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8">実績</h2>
          <ul className="list-disc pl-10 mt-2">
            <li>三井不動産ハッカソン 優秀賞</li>
            <li>SANGIハッカソン ４位入賞</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">2024年度中の目標</h2>
          <ul className="list-disc pl-10 mt-2">
            <li>AWSクラウドプラクティショナー取得</li>
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
