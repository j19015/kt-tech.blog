import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'kt-tech.blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.06)', display: 'flex' }} />

        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#f1f5f9',
            letterSpacing: '-2px',
            display: 'flex',
          }}
        >
          kt-tech.blog
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#64748b',
            marginTop: '16px',
            display: 'flex',
          }}
        >
          技術と創造性が交わる場所
        </div>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px',
          }}
        >
          {['React', 'Next.js', 'TypeScript', 'Cloudflare', 'AI'].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '16px',
                color: '#94a3b8',
                background: 'rgba(148, 163, 184, 0.1)',
                padding: '6px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                display: 'flex',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
