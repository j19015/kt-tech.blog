import Link from 'next/link';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';

export default function About() {
  const skills = [
    { name: 'Next.js', level: 90 },
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 85 },
    { name: 'Ruby on Rails', level: 75 },
    { name: 'AWS', level: 70 },
    { name: 'Tailwind CSS', level: 90 },
  ];

  const techStack = {
    languages: ['JavaScript', 'TypeScript', 'Ruby'],
    frontend: ['React', 'Next.js', 'Tailwind CSS', 'MUI', 'CSS Modules'],
    backend: ['Rails', 'Prisma', 'PostgreSQL', 'MySQL'],
    cloud: ['AWS', 'GCP', 'Azure'],
    stateManagement: ['Redux', 'TanStack Query', 'Zustand'],
    tools: ['Git', 'VS Code', 'Notion', 'Slack']
  };

  const experience = [
    {
      company: 'SaaS企業 A社',
      period: '2023.04 - 現在',
      role: '正社員 / フルスタックエンジニア',
      projects: ['動画配信プラットフォーム開発', 'ウェビナーシステム構築'],
      tech: ['React', 'TypeScript', 'AWS'],
      current: true
    },
    {
      company: 'AI系スタートアップ B社',
      period: '2025.01 - 現在',
      role: '業務委託 / AIエンジニア',
      projects: ['生成AI活用型コンテンツプラットフォーム', 'レビュー自動化システム'],
      tech: ['Next.js', 'AI/ML', 'TypeScript'],
      current: true
    },
    {
      company: 'IT企業 C社',
      period: '2024.04 - 現在',
      role: '業務委託 / フロントエンドエンジニア',
      projects: ['位置情報サービス開発'],
      tech: ['React', 'TypeScript', 'Map API'],
      current: true
    },
    {
      company: '個人事業主',
      period: '2024.01 - 2024.09',
      role: 'フリーランス',
      projects: ['マッチングサービスWebアプリケーション'],
      tech: ['Next.js', 'Rails', 'PostgreSQL'],
      current: false
    }
  ];

  return (
    <>
      <BreadcrumbNav items={[{ label: 'About', current: true }]} />

      <div className='max-w-3xl mx-auto px-4 py-8'>
        {/* Profile */}
        <div className='mb-16'>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            Koki
          </h1>
          <p className='text-base text-slate-600 dark:text-slate-400 mb-4'>
            Full Stack Engineer / AI Developer
          </p>
          <div className='flex gap-4 text-sm'>
            <Link
              href='https://github.com/j19015'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
            >
              GitHub
            </Link>
            <Link
              href='https://twitter.com/tech_koki'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
            >
              Twitter
            </Link>
          </div>
        </div>

        {/* Introduction */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            自己紹介
          </h2>
          <p className='text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4'>
            フルスタックエンジニアのKokiです。2年半の実務経験を通じて、フロントエンドからバックエンド、クラウドまで幅広く対応しています。現在は複数の企業で開発に携わりながら、技術と自然の両方を愛する生活を送っています。
          </p>
          <p className='text-base text-slate-600 dark:text-slate-400 leading-relaxed'>
            ドライブが大好きで、愛車のCX-3で岐阜の山奥や富士の朝霧高原など、自然豊かな場所を巡っています。コードを書く日々と、自然の中でリフレッシュする時間のバランスを大切にしています。
          </p>
          <p className='text-sm text-slate-500 dark:text-slate-400 mt-4'>
            静岡県浜松市 / Full Remote
          </p>
        </section>

        {/* Experience */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            職務経歴
          </h2>

          <div className='space-y-8'>
            {experience.map((job) => (
              <div key={job.company} className='border-l-2 border-slate-200 dark:border-slate-700 pl-4'>
                <div className='mb-2'>
                  <h3 className='font-bold text-base text-slate-900 dark:text-slate-100'>
                    {job.company}
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    {job.role}
                  </p>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>
                    {job.period}
                  </p>
                </div>

                <div className='mb-3'>
                  <p className='text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                    プロジェクト:
                  </p>
                  <ul className='list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1'>
                    {job.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {job.tech.map((tech) => (
                    <span key={tech} className='text-xs text-slate-500 dark:text-slate-400'>
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

          <div className='space-y-6'>
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category}>
                <h3 className='text-sm font-bold text-slate-700 dark:text-slate-300 mb-2'>
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {items.map((item) => (
                    <span key={item} className='text-sm text-slate-600 dark:text-slate-400'>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className='mb-16'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
            スキルレベル
          </h2>

          <div className='space-y-4'>
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {skill.name}
                  </span>
                  <span className='text-sm text-slate-500 dark:text-slate-400'>
                    {skill.level}%
                  </span>
                </div>
                <div className='h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-slate-900 dark:bg-slate-100 transition-all'
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Job Search */}
        <section className='mb-16 p-6 border border-slate-200 dark:border-slate-700 rounded-lg'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
            転職活動中
          </h2>
          <p className='text-sm text-slate-600 dark:text-slate-400 mb-6'>
            新しいチャレンジを求めています
          </p>

          <div className='mb-6'>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100 mb-4'>
              希望条件
            </h3>

            <dl className='space-y-3 text-sm'>
              <div>
                <dt className='text-slate-600 dark:text-slate-400 inline'>勤務形態:</dt>
                <dd className='ml-2 text-slate-900 dark:text-slate-100 inline'>フルリモート希望（必須）</dd>
              </div>
              <div>
                <dt className='text-slate-600 dark:text-slate-400 inline'>居住地:</dt>
                <dd className='ml-2 text-slate-900 dark:text-slate-100 inline'>静岡県浜松市（移住の予定なし）</dd>
              </div>
              <div>
                <dt className='text-slate-600 dark:text-slate-400 inline'>ポジション:</dt>
                <dd className='ml-2 text-slate-900 dark:text-slate-100 inline'>フルスタック / バックエンド / フロントエンドエンジニア</dd>
              </div>
              <div>
                <dt className='text-slate-600 dark:text-slate-400 inline'>年収:</dt>
                <dd className='ml-2 text-slate-900 dark:text-slate-100 inline'>現年収以上を希望（応相談）</dd>
              </div>
              <div>
                <dt className='text-slate-600 dark:text-slate-400 inline'>勤務時間:</dt>
                <dd className='ml-2 text-slate-900 dark:text-slate-100 inline'>フレックス制度歓迎</dd>
              </div>
            </dl>
          </div>

          <div className='space-y-6'>
            <div>
              <h4 className='text-base font-bold text-slate-900 dark:text-slate-100 mb-3'>
                重視するポイント
              </h4>
              <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                <li>• 技術的なチャレンジができる環境</li>
                <li>• モダンな技術スタックの採用</li>
                <li>• プロダクトの成長に貢献できる</li>
                <li>• エンジニアリング文化の醸成</li>
                <li>• 継続的な学習機会の提供</li>
              </ul>
            </div>

            <div>
              <h4 className='text-base font-bold text-slate-900 dark:text-slate-100 mb-3'>
                理想のチーム・環境
              </h4>
              <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                <li>• 心理的安全性の高いチーム</li>
                <li>• コードレビュー文化の定着</li>
                <li>• アジャイル・スクラム開発</li>
                <li>• ドキュメント文化の重視</li>
                <li>• オープンなコミュニケーション</li>
              </ul>
            </div>
          </div>

          <div className='mt-6 pt-4 border-t border-slate-200 dark:border-slate-700'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              お問い合わせ: ご興味を持っていただけた企業様は、
              <Link href='https://twitter.com/tech_koki' className='text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mx-1'>
                Twitter DM
              </Link>
              または
              <Link href='https://github.com/j19015' className='text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mx-1'>
                GitHub
              </Link>
              からご連絡ください
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
