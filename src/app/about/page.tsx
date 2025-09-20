'use client';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Car, Code2, MapPin, Sparkles, Mountain, Briefcase, Rocket, Award, Search, CheckCircle, Users, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='max-w-6xl mx-auto p-4'
      >
        {/* Hero Section */}
        <motion.div 
          {...fadeInUp}
          className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 mb-12'
        >
          <div className='bg-card rounded-3xl p-12'>
            <div className='text-center'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='relative inline-block'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30' />
                <Image
                  src='/images/profile_image.png'
                  alt='Koki'
                  width={200}
                  height={200}
                  className='relative rounded-full border-4 border-white dark:border-gray-800 shadow-2xl'
                />
              </motion.div>
              
              <motion.h1 
                {...fadeInUp}
                className='text-5xl font-bold mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
              >
                Koki
              </motion.h1>
              
              <motion.p 
                {...fadeInUp}
                className='text-xl text-muted-foreground mt-2 mb-6'
              >
                Full Stack Engineer / AI Developer
              </motion.p>
              
              <motion.div 
                {...fadeInUp}
                className='flex justify-center gap-4'
              >
                <Link
                  href='https://github.com/j19015'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className='w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow'
                  >
                    <FontAwesomeIcon icon={faGithub} className='w-7 h-7' />
                  </motion.div>
                </Link>
                <Link
                  href='https://twitter.com/tech_koki'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className='w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow'
                  >
                    <FontAwesomeIcon icon={faTwitter} className='w-7 h-7' />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Introduction Section */}
        <motion.div
          variants={stagger}
          initial='initial'
          animate='animate'
          className='grid md:grid-cols-2 gap-8 mb-12'
        >
          <motion.div
            variants={fadeInUp}
            className='bg-card rounded-2xl p-8 border border-border shadow-lg'
          >
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center'>
                <Sparkles className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground'>自己紹介</h2>
            </div>
            <p className='text-muted-foreground leading-relaxed'>
              フルスタックエンジニアの<span className='font-semibold text-indigo-600 dark:text-indigo-400'>Koki</span>です。
              2年半の実務経験を通じて、フロントエンドからバックエンド、クラウドまで幅広く対応しています。
              現在は複数の企業で開発に携わりながら、技術と自然の両方を愛する生活を送っています。
            </p>
            <div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
              <MapPin className='w-4 h-4' />
              <span>静岡県浜松市 / Full Remote</span>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className='bg-card rounded-2xl p-8 border border-border shadow-lg'
          >
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center'>
                <Car className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground'>趣味</h2>
            </div>
            <p className='text-muted-foreground leading-relaxed'>
              ドライブが大好きで、愛車の<span className='font-semibold text-green-600 dark:text-green-400'>CX-3</span>で
              岐阜の山奥や富士の朝霧高原など、自然豊かな場所を巡っています。
              コードを書く日々と、自然の中でリフレッシュする時間のバランスを大切にしています。
            </p>
            <div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
              <Mountain className='w-4 h-4' />
              <span>Nature & Driving Enthusiast</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          className='bg-card rounded-2xl p-8 border border-border shadow-lg mb-12'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center'>
              <Briefcase className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-foreground'>職務経歴</h2>
          </div>
          
          <div className='space-y-6'>
            {experience.map((job, index) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className='relative pl-8 pb-6 border-l-2 border-indigo-200 dark:border-indigo-800 last:border-l-0'
              >
                <div className={`absolute -left-2.5 w-5 h-5 rounded-full ${
                  job.current 
                    ? 'bg-gradient-to-r from-green-400 to-green-600 animate-pulse' 
                    : 'bg-gray-400'
                }`} />
                
                <div className='bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <h3 className='font-bold text-lg text-gray-900 dark:text-gray-100'>{job.company}</h3>
                      <p className='text-sm text-indigo-600 dark:text-indigo-400 font-medium'>{job.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.current 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}>
                      {job.period}
                    </span>
                  </div>
                  
                  <div className='mb-3'>
                    <p className='text-sm font-medium text-muted-foreground mb-2'>プロジェクト:</p>
                    <ul className='list-disc list-inside text-sm text-muted-foreground space-y-1'>
                      {job.projects.map((project, i) => (
                        <li key={i}>{project}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className='flex flex-wrap gap-2'>
                    {job.tech.map((tech) => (
                      <span key={tech} className='px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md text-xs font-medium'>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          className='bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-800/50 dark:via-gray-800/40 dark:to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800 shadow-lg mb-12'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
              <Rocket className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-foreground'>技術スタック</h2>
          </div>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className='bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all'>
                <h3 className='font-semibold text-sm text-indigo-600 dark:text-indigo-400 mb-3 capitalize'>
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {items.map((item) => (
                    <span key={item} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs text-gray-700 dark:text-gray-200 font-medium'>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          className='bg-card rounded-2xl p-8 border border-border shadow-lg mb-12'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
              <Code2 className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-foreground'>スキルレベル</h2>
          </div>
          
          <div className='space-y-4'>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className='relative'
              >
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium text-foreground'>{skill.name}</span>
                  <span className='text-sm text-muted-foreground'>{skill.level}%</span>
                </div>
                <div className='h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className='h-full bg-gradient-to-r from-indigo-500 to-purple-500'
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Job Search Section */}
        <motion.div
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          className='bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800 shadow-lg'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center'>
              <Search className='w-6 h-6 text-white' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>転職活動中</h2>
              <p className='text-sm text-muted-foreground'>新しいチャレンジを求めています</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-emerald-100 dark:border-emerald-700'
          >
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2'>
              <Globe className='w-5 h-5 text-emerald-500' />
              希望条件
            </h3>
            
            <div className='space-y-3'>
              {[
                { icon: '🏠', label: '勤務形態', value: 'フルリモート希望（必須）' },
                { icon: '📍', label: '居住地', value: '静岡県浜松市（移住の予定なし）' },
                { icon: '💼', label: 'ポジション', value: 'フルスタック / バックエンド / フロントエンドエンジニア' },
                { icon: '💰', label: '年収', value: '現年収以上を希望（応相談）' },
                { icon: '⏰', label: '勤務時間', value: 'フレックス制度歓迎' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className='flex items-start gap-3'
                >
                  <span className='text-xl mt-0.5'>{item.icon}</span>
                  <div>
                    <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>{item.label}:</span>
                    <span className='ml-2 text-sm text-gray-900 dark:text-gray-100'>{item.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='grid md:grid-cols-2 gap-4'
          >
            <div className='bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800'>
              <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-indigo-500' />
                重視するポイント
              </h4>
              <ul className='space-y-2 text-sm'>
                {[
                  '技術的なチャレンジができる環境',
                  'モダンな技術スタックの採用',
                  'プロダクトの成長に貢献できる',
                  'エンジニアリング文化の醸成',
                  '継続的な学習機会の提供'
                ].map((point, i) => (
                  <li key={i} className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                    <span className='text-indigo-500 mt-1'>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl p-5 border border-pink-200 dark:border-pink-800'>
              <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                <Users className='w-5 h-5 text-pink-500' />
                理想のチーム・環境
              </h4>
              <ul className='space-y-2 text-sm'>
                {[
                  '心理的安全性の高いチーム',
                  'コードレビュー文化の定着',
                  'アジャイル・スクラム開発',
                  'ドキュメント文化の重視',
                  'オープンなコミュニケーション'
                ].map((point, i) => (
                  <li key={i} className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                    <span className='text-pink-500 mt-1'>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className='mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg'
          >
            <p className='text-sm text-center text-gray-700 dark:text-gray-300'>
              <span className='font-semibold'>お問い合わせ:</span> 
              ご興味を持っていただけた企業様は、
              <Link href='https://twitter.com/tech_koki' className='text-emerald-600 dark:text-emerald-400 hover:underline mx-1'>
                Twitter DM
              </Link>
              または
              <Link href='https://github.com/j19015' className='text-emerald-600 dark:text-emerald-400 hover:underline mx-1'>
                GitHub
              </Link>
              からご連絡ください
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}