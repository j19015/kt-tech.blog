
import Link from "next/link";
import { useEffect,useState } from 'react';
import Sidebar from "@/components/SIdebar/Sidebar"; // Sidebarのimportを修正
import { useSearchParams } from "next/navigation";
import { Blog, getList } from "../../../libs/microcms";
import Title from "@/components/Title/Title";

export default function StaticPage() {
//   const searchParams = useSearchParams();
//   const text = searchParams.get("text");
//   const [blogContents, setBlogContents] = useState<Blog[] | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { contents } = await getList();

//         if (text) {
//           const filteredContents = await filterData(contents)
//           await console.log("filter結果",filteredContents)
//           await setBlogContents(filteredContents);
//         } else {
//           setBlogContents(contents);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     const filterData= async(contents: Blog[])=>{
//         if(text){
//             const filteredContents = contents.filter(content => content.body.includes(text));
//             return filteredContents
//         }
//         else{
//             return null;
//         }
//     }

//     fetchData();
//     setBlogContents(null)
//   }, [text]);

//   useEffect(() => {
//     console.log("検索結果", blogContents);
//   }, [blogContents]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center mt-1 w-full col-span-2">
              <Title title={`開発中`}/>
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
