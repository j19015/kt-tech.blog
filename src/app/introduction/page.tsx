import Sidebar from '@/components/SIdebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareGithub,faSquareTwitter } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
        <div className="text-white text-black p-8 m-1 rounded-lg introduction">
          <div className="text-center mt-1 w-full col-span-2">
            <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-gray-100 mb-6">Introduction</h2>
          </div>
          <div className="text-center">
            <img
              src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/2524017/profile-images/1691862464"
              alt="J19015"
              width={150}
              height={150}
              className="mx-auto rounded-full"
            />
            <h1 className="text-4xl font-bold mt-4">Koki</h1>
            <div className="flex justify-center mt-2 space-x-4">
              <a
                href="https://github.com/j19015"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-gray-800"
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
                className="text-blue-300 hover:text-blue-700"
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
          <h2 className="text-2xl font-semibold mt-8">エンジニアとしての自己紹介</h2>
          <p className=" mt-2 pl-3">
            Webアプリケーションエンジニアとして、Webアプリケーションの開発に携わっています。<br/>
            業務ではバックエンド、インフラをメインに担当しています。<br/>
            サーバレスアーキテクチャやクリーンアーキテクチャに興味があります。
          </p>
          <h2 className="text-2xl font-semibold mt-8">技術スタック</h2>
          <ul className="list-disc pl-6 mt-2 pl-6">
            <li className='mb-3'><strong>Language</strong> : Ruby、PHP、C、C++、JavaScript、TypeScript</li>
            <li className='mb-3'><strong>FW</strong> : Express、Rails、Next.js</li>
            <li className='mb-3'><strong>Library</strong> : React、Bootstrap、MUI、Tailwind CSS</li>
            <li className='mb-3'><strong>DB</strong> : PostgreSQL</li>
            <li className='mb-3'><strong>ORM</strong> : TypeORM、Gin</li>
            <li className='mb-3'><strong>AWS</strong> : Lamda、APIGateway、CDK、CloudWatch、EC2、ECS、Fargate</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8">経歴</h2>
          <ul className="timeline pl-4">
            <li>
              <p className="timeline-date">2023年4月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>V株式会社(現職)</h3>
                <p className='mt-3 pl-3'>現在は主にサーバレス駆動のWebアプリ開発をAWS CDKを用いて行っています。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2022年5月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>E株式会社(退職済み)</h3>
                <p className='mt-3 pl-3'>MineCraftを用いたプログラミング教室の運営に携わりました。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2021年11月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>I株式会社(現職:副業)</h3>
                <p className='mt-3 pl-3'>HTML,CSS,Ruby,Rails,Git,AWSの教育、PF作成などにメンターとして携わっています。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2019年4月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>T大学</h3>
                <p className='mt-3 pl-3'>大卒資格を得るために専門と並行で通いました。</p>
              </div>
            </li>
            <li>
              <p className="timeline-date">2019年4月</p>
              <div className="timeline-content">
                <h3 className='font-bold'>S専門学校</h3>
                <p className='mt-3 pl-3'>大学では得られないような専門的知識を学びました。</p>
              </div>
            </li>
            
          </ul>
          <h2 className="text-2xl font-semibold mt-8">勉強中の分野</h2>
          <p className=" mt-2 pl-3">
            現在はAWSを用いたサーバレスのWebアプリケーション開発をメインに業務をしております。<br/>
            個人では、Next.js×MicroCMS×Vercelを使ってブログを作成しています。<br/>
            それ以外にも、Ruby on Railsを用いてアプリの作成も行なっています。
          </p>
          <h2 className="text-2xl font-semibold mt-8">資格</h2>
          <ul className="list-disc pl-6 mt-2">
            <li>応用情報技術者</li>
            <li>基本情報技術者</li>
            <li>国家技能検定 電子機器組み立て3級</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8">実績</h2>
          <ul className="list-disc pl-6 mt-2">
            <li>三井不動産ハッカソン mentor賞</li>
            <li>SANGIハッカソン ４位入賞</li>
          </ul>
        </div>
      </div>
      <div className="lg:col-span-1"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
    </div>
  );
}
