# Claude.md - kt-tech.blog

## プロジェクト概要

kt-tech.blogは、Next.js 13とTypeScriptで構築された技術ブログサイトです。**Notion**をヘッドレスCMSとして使用し、レスポンシブデザインとダークモード対応、高いSEO最適化を実現しています。**Cloudflare Pages**にデプロイしています。

## 技術スタック

### フロントエンド
- **Next.js 13.4.19** (App Router使用)
- **React 18.2.0**
- **TypeScript 5.2.2**
- **Tailwind CSS 3.3.3**
- **styled-components 6.1.8**

### コンテンツ管理
- **Notion API** (`@notionhq/client` v5) — ヘッドレスCMS
- **Zenn Markdown** (Markdownレンダリング)
- **Highlight.js** (シンタックスハイライト)
- **Cheerio** (HTMLパースと操作)

### デプロイ・インフラ
- **Cloudflare Pages** (`@cloudflare/next-on-pages`)
- **Cloudflare R2** — 画像ホスティング（eyecatch等）
- **Edge Runtime必須** — 全ての動的ルートに `export const runtime = 'edge'` が必要

### 画像生成
- **Gemini Nano Banana Pro** (`gemini-3-pro-image-preview`) — eyecatch自動生成
- 生成スクリプト: `scripts/generate-eyecatch.mjs`

## 重要な制約事項

### Cloudflare Pages (Edge Runtime)
- **ISR (`revalidate`) は使用不可** — Cloudflare PagesはEdge Runtimeのみ対応
- 全ての動的ルートに `export const runtime = 'edge'` を設定すること
- `generateStaticParams()` は空配列を返す（ビルド時に生成しない）
- Node.js専用APIは使えない（`fs`, `path`等）

### Notion API
- **Data Source ID**: `2eca0ffb-73d1-811b-aa8e-000bb9c14a3c`（`database_id`ではない）
- SDK v5では `dataSources.query()` を使用（`databases.query()` は廃止）
- レート制限: 3リクエスト/秒
- `libs/notion.ts` にメモリキャッシュ実装済み

### 記事URL構造
- microCMS移行記事: `/blogs/{microCMS-ID}` (例: `/blogs/psl309s8itir`)
- Notion記事: `/blogs/{slug}` (例: `/blogs/production-deploy-troubleshooting`)
- SlugはNotionのSlugプロパティで管理

## ディレクトリ構造

```
kt-tech.blog/
├── src/
│   ├── app/                    # App Router (Next.js 13)
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── blogs/             # ブログ関連ルート
│   │   │   ├── [blogId]/      # ブログ詳細（Edge Runtime）
│   │   │   └── page/[pageId]/ # ページネーション（Edge Runtime）
│   │   ├── categories/        # カテゴリ別記事（Edge Runtime）
│   │   ├── tags/              # タグ別記事（Edge Runtime）
│   │   ├── archives/          # アーカイブ（Edge Runtime）
│   │   ├── searches/          # 検索機能
│   │   └── about/             # Aboutページ
│   ├── components/            # 再利用可能コンポーネント
│   └── lib/
├── libs/
│   ├── notion.ts              # Notion API クライアント
│   └── gtag.ts                # Google Analytics
├── scripts/
│   ├── generate-eyecatch.mjs      # eyecatch生成（未設定のみ）
│   └── generate-eyecatch-all.mjs  # eyecatch全記事生成
├── styles/
│   └── markdown.css           # 記事本文のスタイル（callout UI含む）
└── public/
    └── images/
```

## 環境変数

### 必須（.env.local / Cloudflare Pages Secrets）
```env
NOTION_API_KEY=ntn_xxx           # Notion APIトークン（Secret）
NOTION_DATABASE_ID=xxx           # Notion Data Source ID
NEXT_PUBLIC_GA_ID=G-xxx          # Google Analytics
SITE_URL=https://kt-tech.blog   # サイトURL
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
2. **ISR不可**: `revalidate` は使えない。Cloudflare PagesではEdge Runtimeのみ
3. **Notion SDK v5**: `databases.query` → `dataSources.query`、`database_id` → `data_source_id`
4. **画像ドメイン**: `next.config.js` の `remotePatterns` に追加が必要
5. **callout UI**: Notionのcalloutブロックは `:::callout` マーカー → プレースホルダー → HTML変換の3段階処理
6. **型安全性**: TypeScriptの型チェックを必ず確認
7. **レスポンシブ**: モバイルファーストでの開発

## 重要なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint実行 |
| `node scripts/generate-eyecatch.mjs` | eyecatch未設定記事に画像生成 |
| `node scripts/generate-eyecatch.mjs --dry-run` | 対象記事の確認のみ |
