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

### 本番と同じ状態で確認する

```bash
npm run preview   # → http://localhost:8788
```

**`npm run start` は本番の再現にならない。** `next start` は Node.js サーバーとして動くが、
本番は Cloudflare Pages（`@cloudflare/next-on-pages` が生成する Worker）で動いており、
CSS のバンドル結果もページごとの読み込みも別物になる。実際 `next start` では

- 記事ページに layout の CSS が読み込まれず、`--font-noto-sans-jp` が未定義になる
- ソースを変えてビルドし直しても、古い出力を返し続けることがある

といった食い違いが出る。フォントや画像 URL のように「本番でどう配信されるか」が
問われる変更は、必ず `npm run preview` で確認すること。

`preview` は次の3つをまとめて実行する。

| | 内容 |
|---|---|
| `preview:env` | `.env.local` → `.dev.vars` を同期。wrangler は `.env.local` を読まないので、無いと全ページ 503 |
| `pages:build` | `@cloudflare/next-on-pages` で本番と同じビルド |
| `preview:serve` | `wrangler pages dev`。`nodejs_compat` フラグが無いと Worker が起動せず 503 |

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

**Koki** - [@tech_koki](https://x.com/tech_koki) - [GitHub](https://github.com/j19015)
