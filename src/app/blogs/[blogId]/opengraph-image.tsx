import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'kt-tech.blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ blogId: string }> }) {
  const { blogId } = await params;

  // Notion APIから記事タイトルを取得
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  let title = 'kt-tech.blog';
  let category = '';

  try {
    // まずSlugで検索
    const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filter: { property: 'Slug', rich_text: { equals: blogId } } }),
    });
    const data = await res.json();
    let page = data.results?.[0];

    if (!page) {
      // Page IDで取得
      const pageRes = await fetch(`https://api.notion.com/v1/pages/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      });
      page = await pageRes.json();
    }

    if (page?.properties) {
      title = page.properties.Title?.title?.[0]?.plain_text || title;
      category = page.properties.Category?.select?.name || '';
    }
  } catch { /* fallback to default */ }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        {category && (
          <div
            style={{
              display: 'flex',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                color: '#94a3b8',
                background: 'rgba(148,163,184,0.15)',
                padding: '6px 16px',
                borderRadius: '999px',
              }}
            >
              {category}
            </span>
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 40 ? '40px' : '48px',
            fontWeight: 700,
            color: '#f1f5f9',
            lineHeight: 1.4,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: 'auto',
          }}
        >
          <span style={{ fontSize: '24px', color: '#64748b' }}>kt-tech.blog</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
