import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Library, BookOpen } from 'lucide-react';
import { getList } from '../../../../libs/notion';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { groupBySeries } from '@/lib/series';
import { seriesMetaOf } from '@/lib/seriesMeta';
import { SeriesPostList } from '@/components/Series/SeriesPostList';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const runtime = 'edge';

type Props = { params: Promise<{ seriesSlug: string }> };

/**
 * slug から連載を引く。
 *
 * slug → 連載名の対応表は持たず、毎回全記事から作り直している。
 * 連載の数はたかが知れているし、対応表を別に保存すると
 * Notion 側で連載名を変えたときに二重管理になるため。
 */
async function findSeries(slugParam: string) {
  const slug = decodeURIComponent(slugParam);
  const { contents } = await getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }));
  return groupBySeries(contents).find((s) => s.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesSlug } = await params;
  const series = await findSeries(seriesSlug);
  if (!series) {
    return { title: '連載が見つかりません', robots: { index: false, follow: false } };
  }

  const title = `${series.name}（全${series.posts.length}回）`;
  // 連載ごとの説明があればそれを使う。定型文のままだと連載が増えるほど
  // 検索結果で見分けのつかないページが並ぶ。
  const description =
    seriesMetaOf(series.name)?.tagline ??
    `連載「${series.name}」の記事一覧です。第1回から順に読めます。`;
  const url = `${siteUrl}/series/${seriesSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { seriesSlug } = await params;
  const series = await findSeries(seriesSlug);
  if (!series) notFound();

  return (
    <div className='max-w-4xl mx-auto px-4 pb-16'>
      <BreadcrumbNav
        items={[
          { label: 'Series', href: '/series' },
          { label: series.name, current: true },
        ]}
      />

      <div className='flex items-center gap-2 px-2'>
        <Library className='h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400' aria-hidden='true' />
        <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100'>{series.name}</h1>
      </div>
      {seriesMetaOf(series.name) && (
        <p className='mt-3 px-2 text-slate-600 dark:text-slate-300'>
          {seriesMetaOf(series.name)!.tagline}
        </p>
      )}
      <p className='mt-2 px-2 text-sm text-slate-500 dark:text-slate-400'>全{series.posts.length}回</p>

      <Link
        href={`/blogs/${series.posts[0].id}`}
        className='mt-4 mb-8 mx-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
      >
        <BookOpen className='h-4 w-4' aria-hidden='true' />
        第1回から読む
      </Link>

      {/* 検索エンジンに「順序のある記事の集まり」だと伝える */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: series.name,
            numberOfItems: series.posts.length,
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            itemListElement: series.posts.map((post, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${siteUrl}/blogs/${post.id}`,
              name: post.title,
            })),
          }),
        }}
      />

      <SeriesPostList
        posts={series.posts.map((p) => ({ id: p.id, title: p.title, publishedAt: p.publishedAt }))}
      />
    </div>
  );
}
