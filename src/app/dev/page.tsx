import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/SIdebar/Sidebar';

export default function Home() {
  return (

    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2 h-screen"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className="bg-white text-black p-8 m-4 rounded-lg h-screen">
            <div className="text-center mt-1 w-full col-span-2">
              <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-indigo-900 mb-6 underline">Dev</h2>
            </div>
            <div className='h-4/5 flex flex-col justify-center items-center'>
              <div className="text-center mt-1">
                <h1 className="text-4xl text-center font-bold mb-5">公開準備中</h1>
                <div className='text-center'>
                  <FontAwesomeIcon icon={faClock} size="6x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
      </div>
    </>

  );
}
