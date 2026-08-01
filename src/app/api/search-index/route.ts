import { getList } from '../../../../libs/notion';
import { isPublic } from '@/lib/blog';

export const runtime = 'edge';

/**
 * 検索モーダルの候補表示に使う軽量インデックス。
 *
 * 本文は含めない。`getList()` はそもそも本文を取得しないし、
 * 全記事の本文を返せば数百KBになってモーダルを開くたびに転送することになる。
 * タイトル・タグ・カテゴリだけなら記事が増えても数十KBに収まる。
 *
 * 新しいデータの置き場は作っていない。既に持っているものを返すだけ。
 */
export async function GET() {
  try {
    const { contents } = await getList();
    const index = contents.filter(isPublic).map((blog) => ({
      id: blog.id,
      title: blog.title,
      // 「この記事でわかること」も候補の絞り込みに使う
      description: [blog.ogpDescription, ...(blog.summary ?? [])].filter(Boolean).join(' '),
      tags: blog.tags?.map((t) => t.name) ?? [],
      category: blog.category?.name ?? '',
      series: blog.series?.name ?? '',
    }));

    return Response.json(index, {
      headers: {
        // 記事の追加が数分遅れて見えるのは許容できる。
        // モーダルを開くたびに Notion API を叩くほうが問題。
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch {
    // 候補が出ないだけで検索自体は /searches で完結するので、空配列を返して黙って諦める
    return Response.json([], { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
