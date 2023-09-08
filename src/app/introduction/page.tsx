import Image from 'next/image';
import Sidebar from '@/components/SIdebar/Sidebar';

export default function Home() {
  return (
    <>
      <div>
        <div className="grid grid-cols-12 gap-2 grid-flow-row">
          <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300'>
            <h1>開発中のものやPFのページになる予定</h1>
          </div>
          <Sidebar/>
        </div>
      </div>
    </>
  )
}
