import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareGithub, faSquareTwitter } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/markdown.css';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';

export const metadata = {
  title: '自己紹介ページ',
  description: '自己紹介のページになります。LTなどで使えればと思っています。',
  openGraph: {
    title: '自己紹介ページ',
    description: '自己紹介のページになります。LTなどで使えればと思っています。',
    locale: 'ja_JP',
    type: 'website',
    images: 'https://kt-tech.blog/opengraph-image.png',
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
    <div className='lg:p-4'>
      {/* TODO: Breadcrumbの実装を修正する(dark-mode right-mode対応後) */}
      <Breadcrumb className='m-3 lg:mb-5 lg:ml-10'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/' className='hover:text-indigo-500'>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href='/about' className='hover:text-indigo-500'>
              About
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='rounded-lg introduction p-10 lg:ml-10 lg:mr-10 pt-6 pb-6 content shadow-lg'>
        <div className='text-center'>
          <Image
            src='/images/profile_image.png'
            alt='J19015'
            width={400}
            height={400}
            className='mx-auto rounded-md'
          />
          <h1 className='text-4xl font-bold mt-4'>Koki</h1>
          <div className='flex justify-center mt-2 space-x-4'>
            <Link
              href='https://github.com/j19015'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-600 hover:text-gray-800'
            >
              <FontAwesomeIcon icon={faSquareGithub} size='3x' />
            </Link>
            <Link
              href='https://twitter.com/tech_koki'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800'
            >
              <FontAwesomeIcon icon={faSquareTwitter} size='3x' />
            </Link>
          </div>
        </div>
        <h2 className='text-2xl font-semibold mt-8 '>自己紹介</h2>
        <p className=' mt-2 pl-3'>
          初めまして、Webエンジニアの<strong>Koki</strong> と申します。
          <br />
          都内のIT企業に所属しつつ、地方に移住しており、フルリモートで働いています。
        </p>
        <h2 className='text-2xl font-semibold mt-8 '>趣味</h2>
        <p className=' mt-2 pl-3'>
          ドライブがかなり好きです。<strong>CX-3</strong>が愛車です。
          <br />
          ドライブでよく行く場所は岐阜の山奥だったり、富士の朝霧高原だったりと自然が好きです。
        </p>
        <h2 className='text-2xl font-semibold mt-8'>勉強中の分野</h2>
        <p className=' mt-2 pl-6'>
          サーバレスアーキテクチャの概念理解を深めようと、記事を漁ってベストプラクティスを模索しています。
          <br />
          Next.js×MicroCMS×Vercelを使ってブログを作成しています。
          <br />
          それ以外にも、Ruby on Railsを用いてアプリの作成も行なっています。
        </p>

        <h2 className='text-2xl font-semibold mt-8'>2024年度中の目標</h2>
        <ul className='list-disc pl-10 mt-2'>
          <li>AWS SAA取得</li>
          <li>Paiza Aランク到達(現在はBランク)</li>
          <li>Qiita,Zenn,自分のブログ等々でのアウトプットを最低月1ペースで行う。</li>
        </ul>
      </div>
    </div>
  );
}
