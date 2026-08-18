# kt-tech.blog

Notion をヘッドレス CMS にした技術ブログ。Next.js 15 の App Router を Cloudflare Pages（Edge Runtime）で配信している。

**https://kt-tech.blog**

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 15.1 (App Router, Edge Runtime) |
| 言語 | TypeScript 5.2, React 19 |
| スタイリング | Tailwind CSS 3.3, shadcn/ui |
| CMS | Notion REST API（`libs/notion.ts` で直接 fetch。SDK は Edge 非互換） |
| 本文 | markdown-it, highlight.js, KaTeX, Mermaid |
| デプロイ | Cloudflare Pages（`@cloudflare/next-on-pages` + wrangler 4） |
| キャッシュ | `Cache-Control`（トップ 5分、記事系 1時間、SWR 1日）+ デプロイ時パージ |
| 画像 | Cloudflare R2（カスタムドメイン `img.kt-tech.blog`、WebP、サイズ別） |
| フォント | Noto Sans JP をリポジトリに同梱（`next/font/google` は使わない） |
| CI/CD | GitHub Actions（Node 22。ビルド → デプロイ → キャッシュパージ → ウォーム → sitemap ping） |
| 分析 | Google Analytics、Web Vitals |
| OGP | `next/og` で記事タイトル入り画像を動的生成 |

## 主な機能

**コンテンツ**

- Notion の `Published` 記事を Edge で取得して描画
- コードブロック（Copy、言語ラベル、行ハイライト、`diff` 表示）
- Mermaid 図、KaTeX 数式、脚注、callout、YouTube 等の埋め込み
- 記事内の図解（本文の `:::figure{id="..."}` を SVG に差し替え）
- 連載（`/series`）、関連記事、前後ナビ
- 「この記事でわかること」・対象読者・更新履歴

**サイト**

- ライト / ダーク（コードブロック含む）
- 検索（`⌘K` / `Ctrl+K` のモーダル、結果ハイライト）
- あとで読む（この端末の localStorage。`/bookmarks`）
- RSS（`/feed.xml`）、サイトマップ（`sitemap.ts`）
- AI 検索向け（`llms.txt`、主要クローラーを robots で許可）
- PWA（`manifest.json`）
- About / Contact / Privacy

**配信**

- アイキャッチは Gemini（Nano Banana Pro）で生成 → WebP → R2。一覧は thumb、トップは medium
- Notion の署名付き画像は 1 時間で切れるので、本文では `/api/notion-image/[blockId]` 経由で取り直す
- 画像 lightbox、目次、読書進捗、キーボードナビ

## ページ

| パス | 内容 |
|------|------|
| `/` | トップ（新着・更新・カテゴリ） |
| `/blogs/page/{n}` | 記事一覧 |
| `/blogs/{slug}` | 記事。Slug 未設定ならページ ID |
| `/series` | 連載一覧 |
| `/categories` `/tags` `/archives` | 分類別 |
| `/searches` | 検索 |
| `/bookmarks` | あとで読む |
| `/about` `/contact` `/privacy` | 静的ページ |

microCMS 時代の記事は `/blogs/{microCMS-ID}` のまま残している。

## 開発

```bash
npm install   # .npmrc で legacy-peer-deps=true
npm run dev   # http://localhost:3000
```

Node.js 22（CI と同じ）を想定。`.env.local` が無いと Notion を読めない。

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

`preview` は次の 3 つをまとめて実行する。

| | 内容 |
|---|---|
| `preview:env` | `.env.local` → `.dev.vars` を同期。wrangler は `.env.local` を読まないので、無いと全ページ 503 |
| `pages:build` | `@cloudflare/next-on-pages` で本番と同じビルド |
| `preview:serve` | `wrangler pages dev`。`nodejs_compat` フラグが無いと Worker が起動せず 503 |

## ビルド・デプロイ

`main` への push、手動実行、Notion 更新の `repository_dispatch` で [deploy.yml](.github/workflows/deploy.yml) が走る。

```bash
# Cloudflare Pages 用ビルド（ローカル）
npm run pages:build

# 手動デプロイ
gh workflow run deploy.yml
```

PR では [pr-check.yml](.github/workflows/pr-check.yml) が lint・Pages ビルド・Lighthouse を回す。

## 環境変数

ランタイム（`.env.local` と Cloudflare Pages / GitHub Secrets）:

```
NOTION_API_KEY=
NOTION_DATABASE_ID=
NEXT_PUBLIC_GA_ID=
SITE_URL=https://kt-tech.blog
```

デプロイ用（GitHub Secrets）:

```
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ZONE_ID=
```

アイキャッチ生成など手元スクリプト用（`.env.local` のみ）:

```
GEMINI_API_KEY=
R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=
NEXT_PUBLIC_BUCKET_NAME=
NEXT_PUBLIC_R2_BUCKET_URL=
```

## よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー |
| `npm run preview` | 本番相当（Pages Worker）で確認 |
| `npm run lint` | ESLint |
| `npm run pages:build` | Cloudflare Pages 用ビルド |
| `node scripts/generate-eyecatch.mjs` | eyecatch 未設定の記事に画像を生成（`--dry-run` 可） |
| `node scripts/generate-eyecatch-thumbnails.mjs` | 既存画像の thumb / medium 版を R2 に置く |
| `node scripts/vendor-noto-sans-jp.mjs` | Noto Sans JP の再取り込み（フォント更新時のみ） |

## ディレクトリ構成

```
src/app/                 # App Router（記事・連載・検索・API など）
src/components/          # UI
src/figures/             # 記事埋め込み SVG
src/lib/                 # markdown, series, eyecatch など
libs/notion.ts           # Notion REST クライアント
styles/                  # markdown.css, hljs-theme.css, 同梱フォントの CSS
scripts/                 # eyecatch、WebP、フォント取り込み、preview 用 env 同期
public/fonts/            # Noto Sans JP（woff2）
public/llms.txt
public/manifest.json
.github/workflows/       # deploy.yml, pr-check.yml
```

動的ルートには `export const runtime = 'edge'` が必要。Cloudflare Pages では ISR（`revalidate`）も `generateStaticParams` も使えない。

## Author

**Koki** - [@tech_koki](https://x.com/tech_koki) - [GitHub](https://github.com/j19015)
