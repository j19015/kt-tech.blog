import Link from 'next/link';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { Github } from 'lucide-react';
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiRuby,
  SiRubyonrails, SiPostgresql, SiMysql, SiAmazonwebservices, SiGooglecloud,
  SiTailwindcss, SiRedux, SiGit,
  SiPrisma, SiPython, SiGo, SiDocker, SiGithubactions,
  SiCircleci, SiFirebase, SiSass
} from 'react-icons/si';
import { VscVscode, VscAzure } from 'react-icons/vsc';

// X icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

export default function About() {
  const techIcons: { [key: string]: { icon: React.ReactNode; color: string } } = {
    'TypeScript': { icon: <SiTypescript />, color: '#3178C6' },
    'JavaScript': { icon: <SiJavascript />, color: '#F7DF1E' },
    'Python': { icon: <SiPython />, color: '#3776AB' },
    'Go': { icon: <SiGo />, color: '#00ADD8' },
    'Ruby': { icon: <SiRuby />, color: '#CC342D' },
    'React': { icon: <SiReact />, color: '#61DAFB' },
    'Next.js': { icon: <SiNextdotjs />, color: '#000000' },
    'Rails': { icon: <SiRubyonrails />, color: '#CC0000' },
    'Tailwind CSS': { icon: <SiTailwindcss />, color: '#06B6D4' },
    'Sass': { icon: <SiSass />, color: '#CC6699' },
    'Prisma': { icon: <SiPrisma />, color: '#2D3748' },
    'PostgreSQL': { icon: <SiPostgresql />, color: '#4169E1' },
    'MySQL': { icon: <SiMysql />, color: '#4479A1' },
    'AWS': { icon: <SiAmazonwebservices />, color: '#FF9900' },
    'GCP': { icon: <SiGooglecloud />, color: '#4285F4' },
    'Azure': { icon: <VscAzure />, color: '#0078D4' },
    'Firebase': { icon: <SiFirebase />, color: '#FFCA28' },
    'Docker': { icon: <SiDocker />, color: '#2496ED' },
    'GitHub Actions': { icon: <SiGithubactions />, color: '#2088FF' },
    'CircleCI': { icon: <SiCircleci />, color: '#343434' },
    'Redux': { icon: <SiRedux />, color: '#764ABC' },
    'Git': { icon: <SiGit />, color: '#F05032' },
    'VS Code': { icon: <VscVscode />, color: '#007ACC' },
  };

  const techStack = [
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Ruby',
    'React', 'Next.js', 'Rails', 'Tailwind CSS', 'Sass',
    'Prisma', 'PostgreSQL', 'MySQL',
    'AWS', 'GCP', 'Azure', 'Firebase',
    'Docker', 'GitHub Actions', 'CircleCI',
    'Redux', 'Git', 'VS Code'
  ];

  const experience = [
    {
      company: 'SaaS企業',
      period: '2023.04 - 現在',
      role: '正社員 / フルスタックエンジニア',
      description: '動画配信プラットフォームの開発・運用。フロントエンドからバックエンド、インフラまで一貫して担当。',
      tech: ['React', 'TypeScript', 'AWS', 'Firebase'],
      current: true
    },
    {
      company: 'AI系スタートアップ',
      period: '2025.01 - 現在',
      role: '業務委託 / フルスタックエンジニア',
      description: '生成AIを活用したコンテンツプラットフォームの開発。Azure OpenAIを用いたAI機能の設計・実装。',
      tech: ['Next.js', 'TypeScript', 'Azure'],
      current: true
    },
    {
      company: 'IT企業',
      period: '2024.04 - 現在',
      role: '業務委託 / フルスタックエンジニア',
      description: '位置情報サービスの開発。技術選定からインフラ構築まで担当。',
      tech: ['Next.js', 'TypeScript', 'AWS'],
      current: true
    },
    {
      company: '個人事業主',
      period: '2024.01 - 2024.09',
      role: '受託開発',
      description: '業務管理Webアプリケーションの受託開発。要件定義から運用まで全工程を単独で担当。',
      tech: ['Next.js', 'Rails', 'PostgreSQL'],
      current: false
    },
    {
      company: 'プログラミングスクール',
      period: '2021.11 - 2025.07',
      role: '業務委託 / テックメンター',
      description: 'プログラミング学習者への技術サポート・コードレビュー。',
      tech: ['Ruby on Rails', 'AWS'],
      current: false
    }
  ];

  const strengths = [
    {
      title: 'BE/FEを横断したフルスタック開発力',
      description: 'バックエンドからキャリアをスタートし、現在はフロントエンドをメインにBE/FEを横断した開発を行っています。技術選定・設計から実装・運用まで一貫して担当できることが強みです。'
    },
    {
      title: '圧倒的な稼働量と吸収力',
      description: '本業をこなしながら複数の業務委託案件を並行して担当。不明点があれば納得できるまで徹底的に調査・学習を行い、短期間で複数の技術スタックを習得してきました。'
    },
    {
      title: '0→1のプロダクト開発経験',
      description: 'クライアントへのヒアリングから要件定義、技術選定、設計、実装、運用まで全工程を単独で担当した経験があります。プロダクトの立ち上げフェーズに強みがあります。'
    }
  ];

  const education = [
    {
      school: '情報系専門学校',
      period: '2019.04 - 2023.03',
      description: 'システム開発やIoTについて学習。VR × メタバースの授業プラットフォームを卒業研究として開発。'
    },
    {
      school: '通信制大学（理工学部）',
      period: '2019.04 - 2023.03',
      description: '専門学校と併修で大卒資格を取得。'
    }
  ];

  return (
    <>
      <BreadcrumbNav items={[{ label: 'About', current: true }]} />

      <div className='max-w-3xl mx-auto px-4 py-8'>
        {/* Profile */}
        <div className='mb-16'>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
            Koki
          </h1>
          <p className='text-base text-slate-600 dark:text-slate-300 mb-4'>
            Full Stack Engineer
          </p>
          <p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
            静岡県 / フルリモート / 実務経験 3年以上
          </p>
          <div className='flex items-center gap-4'>
            <Link
              href='https://github.com/j19015'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-500 dark:text-slate-400'
              aria-label='GitHub'
            >
              <Github className='w-5 h-5' />
            </Link>
            <Link
              href='https://twitter.com/tech_koki'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-500 dark:text-slate-400'
              aria-label='X (Twitter)'
            >
              <XIcon className='w-5 h-5' />
            </Link>
          </div>
        </div>

        {/* Introduction */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            自己紹介
          </h2>
          <div className='space-y-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed'>
            <p>
              「明日やろうは馬鹿やろう」をモットーに、新しい技術や未経験の領域に積極的に挑戦してきたフルスタックエンジニアです。
            </p>
            <p>
              バックエンドからキャリアをスタートし、現在はフロントエンドをメインにBE/FEを横断した開発を行っています。本業で動画配信プラットフォームの開発に携わりながら、複数企業で業務委託エンジニアとしても活動しています。
            </p>
            <p>
              ドライブが趣味で、愛車で自然豊かな場所を巡っています。コードを書く日々と、自然の中でリフレッシュする時間のバランスを大切にしています。
            </p>
          </div>
        </section>

        {/* Strengths */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            強み
          </h2>
          <div className='space-y-6'>
            {strengths.map((strength, index) => (
              <div key={index} className='border-l-2 border-slate-300 dark:border-slate-600 pl-4'>
                <h3 className='font-bold text-slate-900 dark:text-slate-100 mb-2'>
                  {strength.title}
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            職務経歴
          </h2>

          <div className='space-y-6'>
            {experience.map((job) => (
              <div
                key={job.company + job.period}
                className={`p-4 rounded-lg border ${
                  job.current
                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className='flex items-start justify-between gap-4 mb-2'>
                  <div>
                    <h3 className='font-bold text-slate-900 dark:text-slate-100'>
                      {job.company}
                    </h3>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      {job.role}
                    </p>
                  </div>
                  <span className='flex-shrink-0 text-xs text-slate-500 dark:text-slate-400'>
                    {job.period}
                  </span>
                </div>

                <p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>
                  {job.description}
                </p>

                <div className='flex flex-wrap gap-1.5'>
                  {job.tech.map((tech) => (
                    <span
                      key={tech}
                      className='px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            技術スタック
          </h2>

          <div className='flex flex-wrap gap-3'>
            {techStack.map((tech) => {
              const techInfo = techIcons[tech];
              return (
                <div
                  key={tech}
                  className='flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg'
                >
                  {techInfo && (
                    <span style={{ color: techInfo.color }} className='text-lg'>
                      {techInfo.icon}
                    </span>
                  )}
                  <span className='text-sm text-slate-700 dark:text-slate-300'>{tech}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Education */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            学歴
          </h2>

          <div className='space-y-4'>
            {education.map((edu) => (
              <div key={edu.school} className='flex items-start gap-4'>
                <span className='flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 w-28'>
                  {edu.period}
                </span>
                <div>
                  <h3 className='font-medium text-slate-900 dark:text-slate-100'>
                    {edu.school}
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            実績
          </h2>

          <ul className='space-y-3 text-sm text-slate-600 dark:text-slate-400'>
            <li>• ハッカソン準優勝（6チーム中2位）</li>
            <li>• ハッカソン4位入賞（約120名中）</li>
            <li>• 技術ブログ運営・技術記事執筆</li>
            <li>• 個人開発から業務委託案件への発展</li>
          </ul>
        </section>

        {/* Career Vision */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            キャリアビジョン
          </h2>
          <p className='text-base text-slate-600 dark:text-slate-300 leading-relaxed'>
            BE/FEを横断できるフルスタックエンジニアとして技術力を磨きつつ、将来的にはテックリードやプロダクトマネージャーとして、チームを技術面からリードできる存在を目指しています。
          </p>
        </section>

        {/* Contact */}
        <section className='p-6 border border-slate-200 dark:border-slate-700 rounded-lg'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            お仕事のご依頼
          </h2>
          <p className='text-sm text-slate-600 dark:text-slate-300 mb-4'>
            正社員・業務委託ともにお受けしています。フルリモート勤務を希望しています。
          </p>
          <p className='text-sm text-slate-600 dark:text-slate-300'>
            ご興味を持っていただけた方は、
            <Link
              href='https://twitter.com/tech_koki'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-700 dark:text-slate-300 underline mx-1'
            >
              X (Twitter)
            </Link>
            からご連絡ください。
          </p>
        </section>
      </div>
    </>
  );
}
