# kt-tech.blog

技術ブログサイト。Notion APIをヘッドレスCMSとして、Next.js 15 + Cloudflare Pagesで運用。

**https://kt-tech.blog**

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 15.1 (App Router, Edge Runtime) |
| 言語 | TypeScript 5.2, React 19 |
| スタイリング | Tailwind CSS 3.3 |
| CMS | Notion REST API (直接fetch) |
| デプロイ | Cloudflare Pages (`@cloudflare/next-on-pages`) |
| CDN | Cloudflare CDN + Cache Rule (7日TTL) |
| 画像 | Cloudflare R2 (WebP), Gemini API (eyecatch自動生成) |
| CI/CD | GitHub Actions (ビルド→デプロイ→キャッシュパージ→ウォーム→Ping) |
| 分析 | Google Analytics, Search Console API |
| OGP | next/og で動的生成 |

## 主な機能

- Notion記事の自動レンダリング (markdown-it + highlight.js)
- ライト/ダークモード対応 (コードブロック含む)
- CDN Cache Ruleで全ページ0.06秒配信
- RSS/Atomフィード (`/feed.xml`)
- 動的OGP画像生成 (記事タイトル入り)
- サイトマップ動的生成 (`sitemap.ts`)
- AI検索対応 (llms.txt, AIクローラー許可)
- PWA対応 (manifest.json)
- コードブロックCopyボタン + 言語ラベル
- 画像lightbox (クリック拡大)
- 前/次の記事ナビゲーション
- 検索ハイライト
- スケルトンローディング
- eyecatch自動生成 (Gemini API → WebP → R2)

## 開発

```bash
npm install --legacy-peer-deps
npm run dev
```

## ビルド・デプロイ

```bash
# Cloudflare Pages用ビルド
npx @cloudflare/next-on-pages

# 手動デプロイ
gh workflow run deploy.yml
```

## 環境変数

`.env.local`:
```
NOTION_API_KEY=
NOTION_DATABASE_ID=
NEXT_PUBLIC_GA_ID=
SITE_URL=https://kt-tech.blog
```

## ディレクトリ構成

```
src/app/          # App Router
libs/notion.ts    # Notion REST API クライアント
styles/           # markdown.css, hljs-theme.css
scripts/          # eyecatch生成, WebP変換
.github/          # CI/CD, PR template, Lighthouse budget
public/           # 静的ファイル, manifest.json, llms.txt
```

## Author

**Koki** - [@meow_koki](https://x.com/meow_koki) - [GitHub](https://github.com/j19015)
