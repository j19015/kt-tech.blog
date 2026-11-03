import { ImageResponse } from 'next/og';

export const SITE_OG_SIZE = { width: 1200, height: 630 };

/**
 * サイト共通の OG 画像（記事タイトルなし）。
 *
 * トップの `opengraph-image.tsx` と、記事の OG 画像で「公開されている記事が
 * 見つからなかった」ときの代わりに使う。記事側で Draft や存在しない slug の
 * タイトルを描かないようにするため、ここには記事の情報を一切渡さない。
 */
export function siteOgImage(): ImageResponse {
  // 幾何学的背景画像をR2から取得してbase64化
  const bgUrl = 'https://img.kt-tech.blog/images/site-ogp.png';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* 背景画像 */}
        <img
          src={bgUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* オーバーレイ */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
          }}
        />
        {/* テキスト */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-2px',
              display: 'flex',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            kt-tech.blog
          </div>
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '12px',
              display: 'flex',
            }}
          >
            技術と創造性が交わる場所
          </div>
        </div>
      </div>
    ),
    { ...SITE_OG_SIZE }
  );
}
