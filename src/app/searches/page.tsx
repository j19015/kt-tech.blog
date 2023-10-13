import Sidebar from "@/components/SIdebar/Sidebar"; // Sidebarのimportを修正
import ClientIndex from "./client_index";
import { getList } from "../../../libs/microcms";

export default async function StaticPage() {

  const { contents } = await getList();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-1 w-full col-span-2">
              <ClientIndex contents={contents}/>
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
