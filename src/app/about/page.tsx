import { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const metadata: Metadata = {
  title: 'About',
  description: 'フルスタックエンジニア Koki のプロフィール。React, Next.js, TypeScript, AWS, Python などの技術スタックと経歴。',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { Github } from 'lucide-react';
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiRuby,
  SiRubyonrails, SiPostgresql, SiMysql, SiGooglecloud,
  SiTailwindcss, SiRedux, SiGit,
  SiPrisma, SiPython, SiGo, SiDocker, SiGithubactions,
  SiCircleci, SiFirebase, SiFastapi, SiReactquery
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { VscVscode, VscAzure } from 'react-icons/vsc';

// X icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

/**
 * 見出しと、余った幅いっぱいに伸びる細い罫線。
 * 色を足さずに章の切れ目を作れるので、ページ全体の色数を抑えられる。
 */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className='mb-8 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400'>
    {children}
    <span aria-hidden className='h-px flex-1 bg-slate-200 dark:bg-slate-700' />
  </h2>
);

export default function About() {
  // color を持たないものは本文色を継承する。ブランド色が黒に近い（Next.js, CircleCI）と
  // ダークモードで背景に溶けるため、そこだけテーマ追従に逃がしている。
  const techIcons: { [key: string]: { icon: React.ReactNode; color?: string } } = {
    'TypeScript': { icon: <SiTypescript />, color: '#3178C6' },
    'JavaScript': { icon: <SiJavascript />, color: '#F7DF1E' },
    'Python': { icon: <SiPython />, color: '#3776AB' },
    'Go': { icon: <SiGo />, color: '#00ADD8' },
    'Ruby': { icon: <SiRuby />, color: '#CC342D' },
    'React': { icon: <SiReact />, color: '#61DAFB' },
    'Next.js': { icon: <SiNextdotjs /> },
    'Rails': { icon: <SiRubyonrails />, color: '#CC0000' },
    'FastAPI': { icon: <SiFastapi />, color: '#009688' },
    'Tailwind CSS': { icon: <SiTailwindcss />, color: '#06B6D4' },
    'Prisma': { icon: <SiPrisma />, color: '#2D3748' },
    'PostgreSQL': { icon: <SiPostgresql />, color: '#4169E1' },
    'MySQL': { icon: <SiMysql />, color: '#4479A1' },
    'AWS': { icon: <FaAws />, color: '#FF9900' },
    'GCP': { icon: <SiGooglecloud />, color: '#4285F4' },
    'Azure': { icon: <VscAzure />, color: '#0078D4' },
    'Firebase': { icon: <SiFirebase />, color: '#FFCA28' },
    'Docker': { icon: <SiDocker />, color: '#2496ED' },
    'GitHub Actions': { icon: <SiGithubactions />, color: '#2088FF' },
    'CircleCI': { icon: <SiCircleci /> },
    'Redux': { icon: <SiRedux />, color: '#764ABC' },
    'TanStack Query': { icon: <SiReactquery />, color: '#FF4154' },
    'Git': { icon: <SiGit />, color: '#F05032' },
    'VS Code': { icon: <VscVscode />, color: '#007ACC' },
  };

  // 25個をフラットに並べると探せないので、役割ごとに畳む。
  const techGroups = [
    { label: '言語', items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Ruby'] },
    { label: 'フロントエンド', items: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'Zustand', 'TanStack Query'] },
    { label: 'バックエンド', items: ['Rails', 'FastAPI', 'Prisma', 'PostgreSQL', 'MySQL'] },
    { label: 'インフラ / CI', items: ['AWS', 'Azure', 'GCP', 'Firebase', 'Docker', 'GitHub Actions', 'CircleCI'] },
    { label: 'ツール', items: ['Git', 'VS Code'] },
  ];

  // 顧客のプロダクト名・利用規模は書かない。自分が使った技術と担った役割だけを残す。
  const experience = [
    {
      company: 'アジャイル開発企業',
      period: '2026.07 - 現在',
      type: '正社員',
      role: 'フルスタックエンジニア',
      description: 'アジャイル開発手法を用いた Web アプリケーションの開発。フロントエンドからバックエンド、クラウドインフラまで横断して担当。',
      tech: ['React', 'Next.js', 'TypeScript', 'AWS'],
      current: true
    },
    {
      company: 'SaaS 企業',
      period: '2023.04 - 2026.06',
      type: '正社員',
      role: 'フルスタックエンジニア',
      description: '大規模ライブ配信基盤の開発。React での視聴画面実装と、AWS CDK によるサーバーレスアーキテクチャの設計・実装を担当。',
      tech: ['React', 'TypeScript', 'AWS CDK', 'Lambda', 'Firebase'],
      current: false
    },
    {
      company: 'AI 系企業',
      period: '2025.12 - 現在',
      type: '業務委託',
      role: 'フルスタックエンジニア',
      description: 'LLM・RAG を用いた社内向け検索ツールの設計・実装。要件定義から運用まで担当。',
      tech: ['Next.js', 'FastAPI', 'Python', 'AWS'],
      current: true
    },
    {
      company: 'AI 系スタートアップ',
      period: '2025.01 - 現在',
      type: '業務委託',
      role: 'フルスタックエンジニア',
      description: 'Azure OpenAI を活用した Web アプリケーションの開発。フロントエンドから Azure Functions まで一貫して担当。',
      tech: ['Next.js', 'TypeScript', 'Azure OpenAI', 'Azure Functions'],
      current: true
    },
    {
      company: 'IT 企業',
      period: '2024.04 - 2025.11',
      type: '業務委託',
      role: 'フルスタックエンジニア',
      description: 'Web アプリケーションの開発。技術選定からインフラ構築まで一貫して担当し、リプレイスから運用まで伴走。',
      tech: ['Next.js', 'TypeScript', 'Prisma', 'AWS'],
      current: false
    },
    {
      company: '個人事業主',
      period: '2024.01 - 2024.09',
      type: '業務委託',
      role: '受託開発',
      description: '業務管理 Web アプリケーションの受託開発。要件定義から運用まで全工程を単独で完遂。',
      tech: ['Next.js', 'Node.js', 'PostgreSQL'],
      current: false
    },
    {
      company: 'プログラミングスクール',
      period: '2021.11 - 2025.07',
      type: '業務委託',
      role: 'テックメンター',
      description: 'プログラミング学習者への技術サポート・コードレビュー。3年8ヶ月にわたりエンジニア育成に貢献。',
      tech: ['Ruby on Rails', 'AWS'],
      current: false
    }
  ];

  const employmentTypes = ['正社員', '業務委託'] as const;

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
      description: '上記の専門学校と併修し、大卒資格を取得。'
    }
  ];

  const achievements = [
    'ハッカソン準優勝（6チーム中2位）',
    'ハッカソン4位入賞（約120名中）',
    '技術ブログ運営・技術記事執筆',
    '個人開発から業務委託案件への発展'
  ];

  const socialLinkClass =
    'inline-flex min-h-[44px] items-center gap-2 border-b border-slate-300 px-1 text-sm text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-100 dark:hover:text-slate-100';

  return (
    <>
      <BreadcrumbNav items={[{ label: 'About', current: true }]} />

      {/* ヘッダー・フッター・記事ページと同じ max-w-6xl。ここだけ幅が違うと左端がずれる */}
      <div className='mx-auto max-w-6xl px-4'>
        {/* ヒーロー。情報を詰めず、名前と一行だけ置いて余白を大きく取る */}
        <header className='py-20 sm:py-28'>
          <img
            src='/images/meow_koki.webp'
            alt='Koki'
            className='mb-8 h-24 w-24 rounded-full object-cover'
          />
          <h1 className='font-serif text-5xl font-medium tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl'>
            Koki
          </h1>
          <p className='mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300'>
            バックエンドからフロントエンド、クラウドまで横断して作るフルスタックエンジニアです。
            静岡からフルリモートで働いています。
          </p>
          <div className='mt-8 flex flex-wrap items-center gap-6'>
            <Link href='https://github.com/j19015' target='_blank' rel='noopener noreferrer' className={socialLinkClass}>
              <Github className='h-4 w-4' />
              GitHub
            </Link>
            <Link href='https://x.com/tech_koki' target='_blank' rel='noopener noreferrer' className={socialLinkClass}>
              <XIcon className='h-4 w-4' />
              X
            </Link>
          </div>
        </header>

        <div className='lg:flex lg:items-start lg:gap-16'>
          <div className='min-w-0 flex-1'>
            {/* Introduction */}
            <section className='mb-20'>
              <SectionHeading>自己紹介</SectionHeading>
              <div className='space-y-5 text-[17px] leading-[1.9] text-slate-700 dark:text-slate-300'>
                <p>
                  バックエンドからキャリアをスタートし、現在はReact / Next.js / TypeScriptを中心としたフロントエンド開発から、Python / Node.jsのバックエンド、AWS / Azureのクラウド構築まで一貫して担当しています。
                </p>
                <p>
                  正社員としてプロダクト開発に携わりながら、複数企業で業務委託エンジニアとしても活動。大規模なライブ配信基盤の開発を経て、現在はアジャイル開発企業に所属しています。LLM・RAGを活用したAIツール、Webアプリケーションの立ち上げなど、技術選定から運用まで一貫して経験しています。
                </p>
                <p>
                  短期間で複数の技術スタックを習得し、フロントエンド・バックエンド・インフラを横断した開発経験を積んできました。
                </p>
              </div>
            </section>

            {/* Strengths */}
            <section className='mb-20'>
              <SectionHeading>強み</SectionHeading>
              <div className='space-y-10'>
                {strengths.map((strength, index) => (
                  <div key={strength.title} className='flex gap-5'>
                    <span
                      aria-hidden
                      className='w-8 flex-shrink-0 pt-1 font-serif text-2xl leading-none tabular-nums text-slate-300 dark:text-slate-600'
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
                        {strength.title}
                      </h3>
                      <p className='mt-2 text-[17px] leading-[1.9] text-slate-600 dark:text-slate-400'>
                        {strength.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section className='mb-20'>
              <SectionHeading>職務経歴</SectionHeading>

              {/* 正社員と業務委託が時系列で混ざると前後して見えるので、雇用形態で分ける */}
              {employmentTypes.map((type) => (
                <div key={type} className='mb-12 last:mb-0'>
                  <h3 className='mb-6 text-xs font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500'>
                    {type}
                  </h3>
                  <div className='space-y-10'>
                    {experience
                      .filter((job) => job.type === type)
                      .map((job) => (
                        <article key={job.company + job.period} className='sm:flex sm:gap-8'>
                          <div className='mb-2 flex items-center gap-2 sm:mb-0 sm:w-36 sm:flex-shrink-0 sm:flex-col sm:items-start sm:gap-1 sm:pt-1'>
                            <span className='font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500'>
                              {job.period}
                            </span>
                            {job.current && (
                              <span className='inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400'>
                                <span aria-hidden className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                                現在
                              </span>
                            )}
                          </div>
                          <div className='min-w-0'>
                            <h4 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
                              {job.company}
                            </h4>
                            <p className='mt-0.5 text-sm text-slate-500 dark:text-slate-400'>{job.role}</p>
                            <p className='mt-3 text-[17px] leading-[1.9] text-slate-600 dark:text-slate-400'>
                              {job.description}
                            </p>
                            <div className='mt-3 flex flex-wrap gap-x-4 gap-y-1'>
                              {job.tech.map((tech) => (
                                <span
                                  key={tech}
                                  className='font-mono text-xs text-slate-400 dark:text-slate-500'
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Tech Stack */}
            <section className='mb-20'>
              <SectionHeading>技術スタック</SectionHeading>

              <div className='space-y-8'>
                {techGroups.map((group) => (
                  <div key={group.label} className='sm:flex sm:gap-8'>
                    <h3 className='mb-3 text-xs font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 sm:mb-0 sm:w-36 sm:flex-shrink-0 sm:pt-2'>
                      {group.label}
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {group.items.map((tech) => {
                        const techInfo = techIcons[tech];
                        return (
                          <div
                            key={tech}
                            className='flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                          >
                            {/* アイコンのない技術は頭文字の丸で埋めて、行の高さと左端を揃える */}
                            {techInfo ? (
                              <span
                                style={techInfo.color ? { color: techInfo.color } : undefined}
                                className='text-base text-slate-800 dark:text-slate-100'
                              >
                                {techInfo.icon}
                              </span>
                            ) : (
                              <span
                                aria-hidden
                                className='flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              >
                                {tech.charAt(0)}
                              </span>
                            )}
                            <span className='text-sm text-slate-700 dark:text-slate-300'>{tech}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className='mb-20'>
              <SectionHeading>学歴</SectionHeading>

              <div className='space-y-8'>
                {education.map((edu) => (
                  <div key={edu.school} className='sm:flex sm:gap-8'>
                    <span className='mb-1 block font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500 sm:mb-0 sm:w-36 sm:flex-shrink-0 sm:pt-1.5'>
                      {edu.period}
                    </span>
                    <div>
                      <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>{edu.school}</h3>
                      <p className='mt-2 text-[17px] leading-[1.9] text-slate-600 dark:text-slate-400'>
                        {edu.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section className='mb-20'>
              <SectionHeading>実績</SectionHeading>

              <ul className='space-y-4'>
                {achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className='flex gap-4 text-[17px] leading-[1.9] text-slate-600 dark:text-slate-400'
                  >
                    <span aria-hidden className='mt-[0.9rem] h-px w-5 flex-shrink-0 bg-slate-300 dark:bg-slate-600' />
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>

            {/* Career Vision */}
            <section className='mb-20'>
              <SectionHeading>キャリアビジョン</SectionHeading>
              <p className='text-[17px] leading-[1.9] text-slate-600 dark:text-slate-300'>
                BE/FEを横断できるフルスタックエンジニアとして技術力を磨きつつ、将来的にはテックリードやプロダクトマネージャーとして、チームを技術面からリードできる存在を目指しています。
              </p>
            </section>
          </div>

          {/* 連絡先。lg 以上では追従させ、読んでいる間ずっと視界に残す */}
          <aside className='mb-20 lg:sticky lg:top-24 lg:mb-0 lg:w-60 lg:flex-shrink-0'>
            <div className='border-t border-slate-200 pt-6 dark:border-slate-700 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0'>
              <h2 className='font-serif text-xl text-slate-900 dark:text-slate-100'>お仕事のご相談</h2>
              <p className='mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400'>
                業務委託でのご相談をお受けしています。フルリモートで対応します。
              </p>
              <Link
                href='https://x.com/tech_koki'
                target='_blank'
                rel='noopener noreferrer'
                className='group mt-5 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-slate-900 dark:text-slate-100'
              >
                <XIcon className='h-4 w-4' />
                <span className='border-b border-slate-900 pb-0.5 transition-colors group-hover:border-transparent dark:border-slate-100'>
                  X から連絡する
                </span>
                <span aria-hidden className='transition-transform group-hover:translate-x-1'>
                  →
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
