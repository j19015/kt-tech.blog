import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getCategoryList, getCategoryDetail } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';


export const runtime = 'edge';
export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  const [{ contents }, category_show] = await Promise.all([
    getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getCategoryDetail(categoryId).catch(() => null),
  ]);
  if (!category_show) notFound();

  const filteredContents = contents.filter((blog) => blog.category?.id === decodeURIComponent(categoryId));

  if (filteredContents.length === 0) {
    notFound();
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.SITE_URL },
      { '@type': 'ListItem', position: 2, name: category_show.name },
    ],
  };

  return (
    <WithSidebar>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BreadcrumbNav
        items={[
          { label: 'Category', href: '/categories' },
          { label: category_show.name, current: true }
        ]}
      />
      <div className='text-center mt-1 w-full col-span-2'>
        <Title title={category_show.name} />
      </div>
      <Index contents={filteredContents} />
    </WithSidebar>
  );
}
