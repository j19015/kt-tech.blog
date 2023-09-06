import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <div className='h-screen'>
        <div className="h-full grid grid-cols-12 gap-2 grid-flow-row">
          <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300'>
            main
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              Blog1
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              Blog2
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              Blog3
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              Blog4
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              Blog5
            </div>
          </div>
          <div className='col-span-12 md:col-span-4 m-4 rounded-lg bg-gray-300'>
            Sidebar
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              検索Form
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              注目記事
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              最新記事
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              カテゴリー
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
              アーカイブ
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
