'use client';
import { BlogProps } from '../../../libs/notion';
import { FadeIn } from '../FadeIn/FadeIn';
import { PostCard } from '../PostCard/PostCard';

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='max-w-3xl mx-auto px-4'>
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
