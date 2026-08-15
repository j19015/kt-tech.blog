/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.microcms-assets.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.kt-tech.blog' },
      // 旧配信元。Notion に保存済みの URL がそのまま渡ることがあるので残す
      { protocol: 'https', hostname: 'pub-9d03846db4364486bb0806774184931a.r2.dev' },
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'www.google.com' },
    ],
  },
  async headers() {
    return [
      {
        // 取り込んだ Noto Sans JP。ファイル名が内容ハッシュなので長期キャッシュしてよい。
        // 配信環境では public/_headers が効くが、ローカルの next start でも同じになるよう
        // ここにも書いておく。
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // トップページは新着記事の鮮度を優先して s-maxage を短くする。
        // Cloudflare Pages では ISR が使えないため、Edge Runtime + このヘッダで
        // 「5分ごとに裏で作り直す」ISR相当の挙動にしている。
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=86400, max-age=0' },
        ],
      },
      {
        source: '/blogs/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=0' },
        ],
      },
      {
        source: '/categories/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=0' },
        ],
      },
      {
        source: '/tags/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=0' },
        ],
      },
      {
        source: '/archives/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=0' },
        ],
      },
      {
        // まずは Report-Only で入れる。
        // 本文には Notion 由来の生HTMLが通るので多層防御として CSP は有効だが、
        // GA / AdSense / R2 / 埋め込み先まで許可漏れなく書けているかは
        // 実際の配信環境でしか確かめられない。いきなり強制すると、
        // 漏れがあったページで解析や広告や画像が黙って止まる。
        // ブラウザの Console に違反が出なくなったことを確認してから
        // Content-Security-Policy に切り替える。
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              // Next.js のインラインスクリプトと GA / AdSense
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com",
              // Tailwind とコンポーネントのインラインスタイル
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              // R2 のアイキャッチ / Notion の署名付き画像 / favicon / YouTube のサムネイル
              "img-src 'self' data: blob: https://img.kt-tech.blog https://pub-9d03846db4364486bb0806774184931a.r2.dev https://prod-files-secure.s3.us-west-2.amazonaws.com https://www.notion.so https://i.ytimg.com https://www.google.com https://*.googlesyndication.com https://*.google-analytics.com",
              "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
              // 記事内の埋め込み
              "frame-src https://www.youtube-nocookie.com https://codesandbox.io https://stackblitz.com https://speakerdeck.com https://www.figma.com https://www.google.com https://*.googlesyndication.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
