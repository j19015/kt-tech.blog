import { notFound } from "next/navigation";
import { getList,getCategoryList } from "../../../../../../libs/microcms";
import Sidebar from "@/components/SIdebar/Sidebar"; // Sidebarのimportを修正
import Paginate from "@/components/Pagination/Paginate";
import Index from "@/components/Index/Index";
import Link from "next/link"

const ITEMS_PER_PAGE = 6; // 1ページあたりのアイテム数

export async function generateStaticParams({
    params: { categoryId },
  }: {
    params: { categoryId: string};
  }) {
  try {
    //ブログ取得
    const { contents } = await getList();

    const categoryList = await getCategoryList();
    
    console.log(categoryList)

    const paths: { categoryId: string; pageId: string; }[] = [];

    // 各ページのパスを生成
    categoryList.contents.map((category)=>{
        const filteredContents = contents.filter((blog) => blog.category?.id === category.id);
        console.log(category.name,filteredContents.length)
        const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
        for (let page = 1; page <= totalPages; page++) {
            paths.push({
                categoryId: category.id,
                pageId: String(page)
            });
        }

    });
    
    console.log(paths)

    return [...paths];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default async function StaticPaginationPage({
  params: { categoryId ,pageId},
}: {
  params: { categoryId: string,pageId: string };
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

    // コンテンツを表示するロジックをここに追加

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8"> {/* グリッドを設定 */}
          <div className="lg:col-span-2"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
            <div className="text-center mt-1 w-full col-span-2">
              <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-indigo-900 mb-6 underline">Blog</h2>
            </div>
            <Index contents={contentSlice}/>
            <Paginate currentPage={Number(pageId)} totalPage={Math.ceil(filteredContents.length/6)} kind={`/categories/${categoryId}`}></Paginate>
          </div>
          <div className="lg:col-span-1"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
            <Sidebar />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <>
        <p>Error fetching data.</p>
      </>
    );
  }
}
