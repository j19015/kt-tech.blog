'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export const TableOfContents = ({ toc }: { toc: any }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className='lg:hidden border-2 rounded-lg table-contents m-5 mt-10 p-1'>
      <div className='flex justify-between px-3 py-2'>
        <h1 className='text-lg font-bold' style={{ marginTop: '0px !important' }}>
          目次
        </h1>
        <button onClick={() => setOpen(!isOpen)} className='text-lg'>
          <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
        </button>
      </div>
      <div className={isOpen ? 'block' : 'hidden'}>
        <ul className='pl-2'>
          {toc.map((data: any) => (
            <a key={data.id} href={`#${data.id}`}>
              <li
                className={`${
                  data.tag === 'h2' ? 'ml-5' : data.tag === 'h3' ? 'ml-10' : 'ml-1'
                } mb-2 hover:bg-gray-500 rounded`}
              >
                {data.tag === 'h1' ? data.text : '-' + data.text}
              </li>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents;
