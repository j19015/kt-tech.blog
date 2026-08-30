import { getList, getTagList, getCategoryList } from '../../../libs/notionCache';
import { isPublic } from '@/lib/blog';
import SidebarClient from './Sidebar';

const Sidebar = async () => {
  // データを並列で取得
  const [blogData, tagData, categoryData] = await Promise.all([
    getList(),
    getTagList(),
    getCategoryList()
  ]);

  const posts = blogData.contents.filter(isPublic);
  const tagList = tagData.contents;
  const categoryList = categoryData.contents.filter((c) => c.name !== 'PF');

  // アーカイブは全記事から集計する。
  // 以前は直近10件だけを見ていたため、過去の月がアーカイブに出てこなかった。
  const uniqueArchives = new Set<string>();
  posts.forEach((blog) => {
    const date = new Date(blog.createdAt);
    uniqueArchives.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  });
  const archives = Array.from(uniqueArchives).sort().reverse();

  return (
    <SidebarClient
      latestArticles={posts.slice(0, 5)}
      // 「ランダム」は全記事から選びたいので、ID とタイトルだけ別途渡す
      randomPool={posts.map((p) => p.id)}
      tagList={tagList}
      categoryList={categoryList}
      archives={archives}
      totalCount={posts.length}
    />
  );
};

export default Sidebar;