# Claude.md - kt-tech.blog

## プロジェクト概要

kt-tech.blogは、Next.js 15とTypeScriptで構築された技術ブログサイトです。**Notion API**（REST直接fetch）をヘッドレスCMSとして使用し、**Cloudflare Pages**（Edge Runtime）にデプロイしています。CDN Cache Ruleで全ページを高速配信。

## 技術スタック

### フロントエンド
- **Next.js 15.1.0** (App Router)
- **React 19.2.4**
- **TypeScript 5.2.2**
- **Tailwind CSS 3.3.3**

### コンテンツ管理
- **Notion REST API** — ヘッドレスCMS（`libs/notion.ts`で直接fetch、SDKは未使用）
- **markdown-it** + **markdown-it-anchor** — Markdownレンダリング
- **Highlight.js** — シンタックスハイライト（ライト/ダーク対応）

### デプロイ・インフラ
- **Cloudflare Pages** (`@cloudflare/next-on-pages`)
- **Cloudflare R2** — 画像ホスティング（eyecatch等）
- **Cloudflare CDN Cache Rule** — 動的ページを7日間キャッシュ
- **GitHub Actions** — CI/CD（ビルド→デプロイ→キャッシュパージ→ウォーム）
- **Edge Runtime必須** — 全ての動的ルートに `export const runtime = 'edge'` が必要

### 画像生成
- **Gemini Nano Banana Pro** (`gemini-3-pro-image-preview`) — eyecatch自動生成
- **sharp** — PNG→WebP変換
- 生成スクリプト: `scripts/generate-eyecatch.mjs`

## 重要な制約事項

### Cloudflare Pages (Edge Runtime)
- **ISR (`revalidate`) は使用不可** — Edge Runtimeのみ対応
- **`generateStaticParams()` は使用不可** — Edge Runtimeと非互換
- 全ての動的ルートに `export const runtime = 'edge'` を設定すること
- Node.js専用APIは使えない（`fs`, `path`, `crypto`等）
- `@notionhq/client` は使えない（crypto依存）→ REST API直接fetch

### Notion API
- **Database ID (REST)**: `2eca0ffb73d181ffba0aecf7cad44701`
- **Data Source ID (SDK/MCP)**: `2eca0ffb-73d1-811b-aa8e-000bb9c14a3c`
- `libs/notion.ts` で直接 `fetch()` を使用（Edge Runtime互換）
- Edge Runtimeではグローバル変数がリクエスト間で共有されないため、ランタイムでのレート制限は不要

### 記事URL構造
- microCMS移行記事: `/blogs/{microCMS-ID}` (例: `/blogs/psl309s8itir`)
- Notion記事: `/blogs/{slug}` or `/blogs/{page-id}` (例: `/blogs/production-deploy-troubleshooting`)
- SlugはNotionのSlugプロパティで管理

### キャッシュ戦略
- Cloudflare CDN Cache Rule: `/blogs/`, `/categories/`, `/tags/`, `/archives/` を7日間キャッシュ
- デプロイ時に全キャッシュパージ→全ページウォーム（CI/CDで自動実行）
- CDNキャッシュHIT時: TTFB 0.06秒

## ディレクトリ構造

```
kt-tech.blog/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── blogs/
│   │   │   ├── [blogId]/      # ブログ詳細（Edge Runtime + loading.tsx）
│   │   │   └── page/[pageId]/ # ページネーション（Edge Runtime + loading.tsx）
│   │   ├── categories/        # カテゴリ別記事（Edge Runtime + loading.tsx）
│   │   ├── tags/              # タグ別記事（Edge Runtime + loading.tsx）
│   │   ├── archives/          # アーカイブ（Edge Runtime + loading.tsx）
│   │   ├── searches/          # 検索機能
│   │   └── about/             # Aboutページ
│   ├── components/            # 再利用可能コンポーネント
│   └── lib/
├── libs/
│   ├── notion.ts              # Notion REST API クライアント（直接fetch）
│   └── gtag.ts                # Google Analytics
├── scripts/
│   ├── generate-eyecatch.mjs      # eyecatch生成（未設定のみ、WebP出力）
│   └── generate-eyecatch-all.mjs  # eyecatch全記事生成（WebP出力）
├── styles/
│   ├── markdown.css           # 記事本文のスタイル（callout UI含む）
│   └── hljs-theme.css         # シンタックスハイライト（ライト/ダーク対応）
├── .github/workflows/
│   ├── deploy.yml             # デプロイ + キャッシュパージ + ウォーム
│   └── pr-check.yml           # PR チェック（ビルド + Lighthouse）
└── public/
    └── images/
```

## 環境変数

### ビルド時 + ランタイム（Cloudflare Pages Settings + GitHub Secrets 両方に設定）
```env
NOTION_API_KEY=ntn_xxx           # Notion APIトークン（Secret）
NOTION_DATABASE_ID=xxx           # Notion Database ID (REST API用)
NEXT_PUBLIC_GA_ID=G-xxx          # Google Analytics
SITE_URL=https://kt-tech.blog   # サイトURL
```

### CI/CD用（GitHub Secretsのみ）
```env
CLOUDFLARE_API_TOKEN=xxx         # Cloudflare API
CLOUDFLARE_ACCOUNT_ID=xxx        # Cloudflare アカウントID
CLOUDFLARE_ZONE_ID=xxx           # キャッシュパージ用
```

### eyecatch生成スクリプト用（.env.localのみ）
```env
GEMINI_API_KEY=xxx               # Gemini API
R2_ENDPOINT=xxx                  # Cloudflare R2
R2_ACCESS_KEY=xxx                # R2アクセスキー
R2_SECRET_KEY=xxx                # R2シークレットキー
NEXT_PUBLIC_BUCKET_NAME=xxx      # R2バケット名
NEXT_PUBLIC_R2_BUCKET_URL=xxx    # R2パブリックURL
```

## 開発時の注意点

1. **Edge Runtime**: 動的ルートには必ず `export const runtime = 'edge'` を設定
2. **ISR/SSG不可**: `revalidate` も `generateStaticParams` も使えない
3. **Notion API**: REST API直接fetch（SDKはcrypto依存で使えない）
4. **画像ドメイン**: `next.config.js` の `remotePatterns` に追加が必要
5. **callout UI**: Notionのcalloutブロックは `:::callout` マーカー → プレースホルダー → HTML変換の3段階処理
6. **見出し**: 絵文字は `stripEmoji()` で自動除去される
7. **ビルド**: `npx @cloudflare/next-on-pages` で一括ビルド（`--skip-build`不可）
8. **`.npmrc`**: `legacy-peer-deps=true` が必要（vercel build互換）
9. **コミットメッセージ**: wrangler deployで日本語が拒否されるためCI/CDではASCII指定

## 重要なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint実行 |
| `npx @cloudflare/next-on-pages` | Cloudflare Pages用ビルド |
| `node scripts/generate-eyecatch.mjs` | eyecatch未設定記事に画像生成（WebP） |
| `node scripts/generate-eyecatch.mjs --dry-run` | 対象記事の確認のみ |
