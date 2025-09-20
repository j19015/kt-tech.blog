'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Eye, BarChart3, AlertTriangle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const sections = [
    {
      icon: <Shield className='w-5 h-5' />,
      title: '1. 個人情報の利用目的',
      content: '当サイトでは、メールでのお問い合わせ、メールマガジンへの登録などの際に、名前、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。'
    },
    {
      icon: <Eye className='w-5 h-5' />,
      title: '2. 個人情報の第三者への開示',
      content: '当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。',
      list: [
        '本人のご了解がある場合',
        '法令等への協力のため、開示が必要となる場合'
      ]
    },
    {
      icon: <BarChart3 className='w-5 h-5' />,
      title: '3. アクセス解析ツールについて',
      content: '当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。'
    },
    {
      icon: <AlertTriangle className='w-5 h-5' />,
      title: '4. 免責事項',
      list: [
        '当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的ではございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が直接メールでご連絡下さい。確認後、対応させて頂きます。',
        '当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。',
        '当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。情報の正確性・完全性を保証するものではございませんので、予めご了承ください。',
        '当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。',
        '当サイトを閲覧する際の推奨ブラウザは、「Google Chrome」、「Mozilla Firefox」の各最新版となります。その他のブラウザで閲覧した場合、表示が崩れたり、正常に動作しない場合がございますので、予めご了承ください。'
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
          />
          
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className='w-full max-w-3xl max-h-[85vh] overflow-hidden'
            >
            <div className='bg-card border border-border rounded-2xl shadow-2xl'>
              {/* Header */}
              <div className='sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center'>
                    <Shield className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                      Privacy Policy
                    </h2>
                    <p className='text-xs text-muted-foreground mt-0.5'>プライバシーポリシー</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Content */}
              <div className='p-6 overflow-y-auto max-h-[calc(85vh-88px)] scroll_bar'>
                <div className='space-y-8'>
                  {sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='group'
                    >
                      <div className='flex items-start gap-3 mb-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                          <div className='text-indigo-600 dark:text-indigo-400'>
                            {section.icon}
                          </div>
                        </div>
                        <h3 className='text-lg font-semibold text-foreground pt-2'>
                          {section.title}
                        </h3>
                      </div>
                      
                      {section.content && (
                        <p className='text-muted-foreground leading-relaxed ml-13'>
                          {section.content}
                        </p>
                      )}
                      
                      {section.list && (
                        <ul className='ml-13 mt-3 space-y-2'>
                          {section.list.map((item, idx) => (
                            <li key={idx} className='flex items-start gap-2 text-muted-foreground'>
                              <span className='w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0' />
                              <span className='leading-relaxed'>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className='mt-8 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl'
                >
                  <p className='text-sm text-muted-foreground text-center'>
                    最終更新日: {new Date().toLocaleDateString('ja-JP')}
                  </p>
                </motion.div>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;