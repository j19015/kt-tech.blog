import { ImageResponse } from 'next/og';
import { getDetail, type Blog } from '../../../../libs/notionCache';
import { siteOgImage } from '@/lib/siteOgImage';

export const runtime = 'edge';
export const alt = 'kt-tech.blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ blogId: string }> }) {
  const { blogId } = await params;

  // 記事ページと同じ getDetail を使う。Published かどうか（と、page ID 経路では
  // 記事DBのページかどうか）の判定をここでも同じにするため。
  // 以前は Slug 検索と `/pages/{id}` を自前で叩いていて Status を見ていなかったので、
  // Draft の記事でも slug か page ID を知っていればタイトルが画像に描かれていた。
  // キャッシュ（notionCache）も記事ページと共有するので、通常は Notion を叩かない。
  let post: Blog;
  try {
    post = await getDetail(blogId);
  } catch {
    // 存在しない・未公開・取得失敗のいずれも、記事の情報を出さずに汎用画像を返す
    return siteOgImage();
  }

  const title = post.title || 'kt-tech.blog';
  const category = post.category?.name || '';

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
