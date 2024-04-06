import { notFound } from 'next/navigation';
import { getList, getCategoryList, getCategoryDetail } from '../../../../../../libs/microcms';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';

const ITEMS_PER_PAGE = 6; // 1ページあたりのアイテム数

export async function generateStaticParams({
  params: { categoryId },
}: {
  params: { categoryId: string };
}) {
  try {
    //ブログ取得
    const { contents } = await getList();

    const categoryList = await getCategoryList();

    console.log(categoryList);

    const paths: { categoryId: string; pageId: string }[] = [];

    // 各ページのパスを生成
    categoryList.contents.map((category) => {
      const filteredContents = contents.filter((blog) => blog.category?.id === category.id);
      console.log(category.name, filteredContents.length);
      const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
      for (let page = 1; page <= totalPages; page++) {
        paths.push({
          categoryId: category.id,
          pageId: String(page),
        });
      }
    });

    console.log(paths);

    return [...paths];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function StaticPaginationPage({
  params: { categoryId, pageId },
}: {
  params: { categoryId: string; pageId: string };
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
    //listAll
    const { contents } = await getList();

    //fileter
    const filteredContents = contents.filter((blog) => blog.category?.id === categoryId);

    //silce
    const contentSlice = filteredContents.slice(startIndex, endIndex);

    //category取得
    const category = await getCategoryDetail(categoryId);

    // コンテンツを表示するロジックをここに追加

    return (
      <>
        <div className='text-center mt-1 w-full col-span-2'>
          <Title title={category.name} />
        </div>
        <Index contents={contentSlice} />
        <Paginate
          currentPage={Number(pageId)}
          totalPage={Math.ceil(filteredContents.length / 6)}
          kind={`/categories/${categoryId}`}
        ></Paginate>
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
