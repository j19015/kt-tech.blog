import { notFound } from 'next/navigation';
import { getList } from '../../../../../libs/microcms';
import Sidebar from '@/components/SIdebar/Sidebar'; // Sidebarのimportを修正
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';

const ITEMS_PER_PAGE = 6; // 1ページあたりのアイテム数

export async function generateStaticParams() {
  try {
    //ブログ取得
    const { contents } = await getList();

    const articles = contents.filter((article) => article.category?.name !== 'PF');

    //ブログ件数を取得
    const totalItems = articles.length;

    // ページ数を計算
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    //path入れる用の変数
    const paths = [];

    // 各ページのパスを生成
    for (let page = 1; page <= totalPages; page++) {
      paths.push({
        pageId: page.toString(),
      });
    }
    //console.log(paths)

    return [...paths];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function StaticPaginationPage({
  params: { pageId },
}: {
  params: { pageId: string };
}) {
  if (!pageId) {
    notFound();
  }

  // ページ番号からコンテンツの範囲を計算
  const currentPage = parseInt(pageId, 10);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // コンテンツを取得
  try {
    const { contents } = await getList();

    const contentSlice = contents
      .filter((article) => article.category?.name !== 'PF')
      .slice(startIndex, endIndex);

    // コンテンツを表示するロジックをここに追加

    return (
      <>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8'>
          {' '}
          {/* グリッドを設定 */}
          <div className='lg:col-span-2'>
            {' '}
            {/* 通常の画面サイズでは2列分のスペースを占有 */}
            <Index contents={contentSlice} />
            <Paginate
              currentPage={Number(pageId)}
              totalPage={Math.ceil(contents.length / ITEMS_PER_PAGE)}
              kind={`/blogs`}
            ></Paginate>
          </div>
          <div className='lg:col-span-1'>
            {' '}
            {/* 通常の画面サイズでは1列分のスペースを占有 */}
            <Sidebar />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <>
        <p>Error fetching data.</p>
      </>
    );
  }
}
