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
/**
 * @param priorityCount 先頭から何件をファーストビュー扱いにするか。
 *   一覧ページのように最初に目に入る場所では 1 を渡す。
 *   トップの「最新記事」のように画面下部に置かれる場合は 0（既定）のまま。
 *   ここを増やしすぎると eager な画像が CSS やフォントと帯域を奪い合い、
 *   トップの FCP が 1.3s → 5.9s に落ちた。
 */
export const Index = ({ contents, priorityCount = 0 }: BlogProps & { priorityCount?: number }) => {
  return (
    <div>
      <div className='space-y-4'>
        {/*
          ファーストビューに入る分は遅延読み込みもフェードインもしない。
          FadeIn は opacity-0 から始まるため、包んだままだと中の画像が LCP 候補から
          外れ、IntersectionObserver が発火するまで «何も描かれていない» 扱いになる。
        */}
        {contents.map((blog, index) =>
          index < priorityCount ? (
            <PostCard key={blog.id} blog={blog} priority />
          ) : (
            <FadeIn key={blog.id}>
              <PostCard blog={blog} />
            </FadeIn>
          )
        )}
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
