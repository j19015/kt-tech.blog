'use client';
import { BlogProps } from '../../../libs/notion';
import { FadeIn } from '../FadeIn/FadeIn';
import { PostCard } from '../PostCard/PostCard';

/**
 * 記事一覧。
 *
 * 幅は呼び出し側のコンテナに委ねる。以前は自分で `max-w-3xl mx-auto px-4` を
 * 持っていたため、`max-w-6xl` のセクションの中で勝手に細くなり、
 * 見出しとカードの左端がズレていた（トップページ）。
 */
export const Index = ({ contents }: BlogProps) => {
  return (
    <div>
      <div className='space-y-4'>
        {contents.map((blog) => (
          <FadeIn key={blog.id}>
            <PostCard blog={blog} />
          </FadeIn>
        ))}
      </div>

      {contents.length === 0 && (
        <div className='text-center py-16 text-slate-500 dark:text-slate-300'>
          記事が見つかりませんでした
        </div>
      )}
    </div>
  );
};

export default Index;
