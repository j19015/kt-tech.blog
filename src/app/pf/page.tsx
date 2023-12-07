import React from 'react';
import { getList } from "../../..//libs/microcms";
import { Blog } from "../../../libs/microcms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '@/components/SIdebar/Sidebar';
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {

  const { contents } = await getList();

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  const latestBlogs: Blog[] = contents.filter(article => article.category?.name === 'PF').slice(0, 4);
  return (
    <div className="p-4">
      <div className="flex justify-center flex-wrap">
        {latestBlogs.map((blog) => (
          <div key={blog.id} className="max-w-sm rounded-lg shadow-lg m-5 content">
            <Link href={`/blogs/${blog.id}`}>
                <Image
                  className="rounded-t-lg"
                  src={blog.eyecatch?.url ? blog.eyecatch?.url : `../../../public/images/no_image`}
                  alt={blog.title}
                  width={1200}
                  height={630}
                />
            </Link>
            <div className="p-5">
              <Link href={`/blogs/${blog.id}`}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight">{blog.title}</h5>
              </Link>
              {/* 以下の部分は、必要に応じて記事の簡単な説明やその他の情報を追加できます */}
              <p className="mb-3 font-normal">記事の簡単な説明や日付などをここに表示します。</p>
              <Link href={`/blogs/${blog.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                  詳細を読む
                  {/* アイコンや追加のスタイリングは必要に応じて */}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
