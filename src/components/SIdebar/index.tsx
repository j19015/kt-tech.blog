import { getList, getTagList, getCategoryList } from '../../../libs/microcms';
import SidebarClient from './Sidebar';

const Sidebar = async () => {
  // データを並列で取得
  const [blogData, tagData, categoryData] = await Promise.all([
    getList({ limit: 10, orders: '-createdAt' }),
    getTagList(),
    getCategoryList()
  ]);

  const latestArticles = blogData.contents;
  const tagList = tagData.contents;
  const categoryList = categoryData.contents;

  // アーカイブの生成
  const uniqueArchives = new Set<string>();
  blogData.contents.forEach((blog) => {
    const date = new Date(blog.createdAt);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    uniqueArchives.add(yearMonth);
  });
  const archives = Array.from(uniqueArchives).sort().reverse();

  return (
    <SidebarClient
      latestArticles={latestArticles}
      tagList={tagList}
      categoryList={categoryList}
      archives={archives}
    />
  );
};

export default Sidebar;