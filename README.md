# kt-tech.blog

Notion で書いた記事を、Next.js 15 (Edge Runtime) + Cloudflare Pages で配信している技術ブログ。

**https://kt-tech.blog**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/architecture-dark.png">
  <img src="docs/architecture.png" alt="構成図: 読者のリクエストは Cloudflare の CDN キャッシュに届き、ミス時だけ Cloudflare Pages 上の Next.js 15 (Edge Runtime) が Notion REST API から記事を取得して描画する。「参考になった」の件数は Pages から D1 バインディング経由で Cloudflare D1 に読み書きし、押されたときは Turnstile の siteverify でトークンを検証する。アイキャッチ画像は Cloudflare R2 から配信され、Gemini で生成して R2 に置く。GitHub Actions がビルド・デプロイ・キャッシュのパージとウォームを行う。D1 と Turnstile はローカルの Terraform で管理し（state は R2）、Terraform に渡す API トークンは 1Password から op run で受け取る。アクセス解析は Google Analytics" width="100%">
</picture>

## 仕組み

| 流れ | 内容 |
|---|---|
| 配信 | 読者のリクエストはまず Cloudflare の CDN に届く。Cache Rule で `/blogs/` `/categories/` `/tags/` `/archives/` を 7 日間キャッシュしており、HIT 時の TTFB は約 0.06 秒 |
| 描画 | キャッシュミス時だけ Cloudflare Pages の Worker (Next.js 15, Edge Runtime) が Notion REST API を叩いてページを組み立てる |
| 執筆 | 記事は Notion のデータベースに書く。`Status` が `Published` のものだけ公開される |
| 画像 | アイキャッチは Gemini で生成 → WebP に変換 → Cloudflare R2 に置いて直接配信。Notion にアップロードした本文画像は署名 URL が 1 時間で切れるので、`/api/notion-image/[blockId]` 経由で都度取り直す |
| 「参考になった」 | 記事の HTML は CDN に置いたまま、件数だけをブラウザから `/api/reactions/[slug]` に取りに行く。件数は Cloudflare D1 に持ち、GET は CDN で 60 秒キャッシュする。押したとき（POST）は Turnstile のトークンをサーバー側で検証してから加算する |
| デプロイ | `main` への push で GitHub Actions がビルド → デプロイ → CDN 全パージ → 全記事ウォームまで行う |
| インフラ | D1 と Turnstile のウィジェットは Terraform（`infra/`）で管理する。秘密情報はローカルでは 1Password、CI では GitHub Secrets に置く |

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router, Edge Runtime) |
| 言語 / UI | TypeScript, React 19, Tailwind CSS, shadcn/ui |
| CMS | Notion REST API（`libs/notion.ts` で直接 `fetch`。SDK は crypto 依存で Edge では動かない） |
| 本文レンダリング | markdown-it, highlight.js, KaTeX, Mermaid |
| ホスティング | Cloudflare Pages (`@cloudflare/next-on-pages`) |
| CDN | Cloudflare CDN + Cache Rule（7 日 TTL） |
| 画像 | Cloudflare R2 (WebP), Gemini（アイキャッチ生成） |
| DB | Cloudflare D1（「参考になった」の件数のみ） |
| bot 対策 | Cloudflare Turnstile |
| IaC | Terraform（D1・Turnstile。state は R2） |
| 秘密情報 | 1Password CLI（`op run`）、GitHub Secrets、Pages の Secret |
| CI/CD | GitHub Actions |
| 分析 | Google Analytics |
| OGP | `next/og` で記事ごとに動的生成 |

## 主な機能

**記事**
- Notion ブロックを Markdown 経由で HTML に変換（書き方の対応表は [claude.md](claude.md#本文の書き方notion-ブロックの扱い)）
- コードブロック: ファイル名、行ハイライト、diff 表示、Copy ボタン、ライト/ダーク対応のハイライト
- Callout、脚注、数式 (KaTeX)、Mermaid、YouTube などの埋め込み、リンクカード
- 目次、読了プログレスバー、前後の記事、関連記事、シリーズ（連載）ナビゲーション
- 「この記事でわかること」・対象読者・更新履歴の表示（Notion のプロパティから）
- 「参考になった」ボタン（件数は D1、bot 判定は Turnstile）

**サイト**
- カテゴリ / タグ / アーカイブ / シリーズ一覧、全文検索（ハイライト付き）
- ブックマーク・読書統計（ブラウザのローカルに保存）
- ライト/ダークモード、スケルトンローディング、画像 lightbox

**配信・SEO**
- RSS (`/feed.xml`)、サイトマップ (`sitemap.ts`)、`robots.ts`
- 記事タイトル入りの OGP 画像を動的生成
- AI 検索向けの `llms.txt`、PWA (`manifest.json`)

## 開発

Node.js 22 を使う（CI と同じ）。

```bash
npm install --legacy-peer-deps
npm run dev:op                     # → http://localhost:3000（1Password から環境変数を渡す）
# .env.local を使う場合は npm run dev（下の「環境変数」を参照）
```

### 本番と同じ状態で確認する

```bash
npm run preview:op   # → http://localhost:8788（.env.local を使う場合は npm run preview）
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
| `preview:env` | `.env.local` と（`preview:op` のときは）1Password の値から `.dev.vars` を作る。wrangler は `.env.local` も環境変数も読まないので、無いと全ページ 503。`.dev.vars` は平文なので、使い終わったら消してよい |
| `pages:build` | `@cloudflare/next-on-pages` で本番と同じビルド |
| `preview:serve` | `wrangler pages dev`。`nodejs_compat` フラグが無いと Worker が起動せず 503 |

### コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev:op` | 開発サーバー（1Password から環境変数を渡す） |
| `npm run dev` | 開発サーバー（`.env.local` を読む） |
| `npm run lint` | ESLint |
| `npm run preview:op` | 本番と同じビルドをローカルで起動（1Password） |
| `npm run preview` | 同上（`.env.local`） |
| `npm run pages:build` | Cloudflare Pages 用ビルド |
| `npm run db:migrate:local` | ローカルの D1 にスキーマを適用 |
| `op run --env-file=.env.op -- node scripts/generate-eyecatch.mjs` | アイキャッチ未設定の記事に画像を生成（`--dry-run` で対象確認のみ） |
| `op run --env-file=.env.op -- node scripts/lint-content.mjs` | Notion の記事を品質チェック |

## デプロイ

`main` に push（マージ）すると [`deploy.yml`](.github/workflows/deploy.yml) が走る。手動なら:

```bash
gh workflow run deploy.yml
```

1. `@cloudflare/next-on-pages` でビルド
2. `wrangler pages deploy` で Cloudflare Pages にデプロイ
3. CDN キャッシュを全パージ
4. トップ・一覧・公開中の全記事を叩いてキャッシュをウォーム
5. 検索エンジンにサイトマップを通知

PR では [`pr-check.yml`](.github/workflows/pr-check.yml) が lint とビルドを確認する。

> [!NOTE]
> CDN が 7 日キャッシュするので、Notion での編集はデプロイ（パージ → ウォーム）するまで反映されない。
> ただし Worker 側にも記事キャッシュ（本文 15 分）があり、編集直後にデプロイすると古い本文でウォームされて CDN に載り直す。
> 最後の編集から 15 分以上空けてからデプロイすること。

## 環境変数

ローカルの秘密情報は 1Password（保管庫 `Private` / アイテム `kt-tech.blog`）に置いている。
[`.env.op`](.env.op) に `KEY=op://Private/kt-tech.blog/KEY` 形式の参照だけを並べてあり
（値は入っていないのでコミットしてある）、`op run --env-file=.env.op -- <コマンド>` で
実行中のプロセスにだけ値が渡る。`dev:op` / `preview:op` はこれを包んだもの。
Terraform 用の参照は [`infra/.env.op`](infra/.env.op) に分けてある。

`.env.local` に書いても動く（`npm run dev` などはこれを読む）。両方ある場合は `op run` で
渡した値が優先される。`dev` を `op run` に置き換えずに `dev:op` を足したのは、1Password を
使わない環境（CI や別のマシン）でも今までどおり `npm run dev` で動くようにするため。

アプリが使う値（Cloudflare Pages の Settings と GitHub Secrets にも同じものを設定する）:

```env
NOTION_API_KEY=          # Notion インテグレーションのトークン
NOTION_DATABASE_ID=      # 記事データベースの ID
NEXT_PUBLIC_GA_ID=       # Google Analytics
SITE_URL=https://kt-tech.blog
```

<details>
<summary>CI 用・アイキャッチ生成用</summary>

GitHub Secrets のみ:

```env
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ZONE_ID=      # キャッシュパージ用
```

アイキャッチ生成スクリプト用（ローカルのみ。`.env.op` に入っている）:

```env
GEMINI_API_KEY=
R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=
NEXT_PUBLIC_BUCKET_NAME=
NEXT_PUBLIC_R2_BUCKET_URL=
```

</details>

<details>
<summary>「参考になった」ボタン（D1 + Turnstile）</summary>

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=   # ビルド時に埋まる。GitHub Secrets にも置く。未設定ならボタンを出さない
TURNSTILE_SECRET_KEY=             # Pages の Secret
```

件数は D1（`kt-tech-blog-reactions`、Pages のバインディング名 `DB`）に持つ。
`NOTION_API_KEY` と `TURNSTILE_SECRET_KEY` は Pages では Secret（暗号化）として置いている。
ローカルでは `npm run db:migrate:local` のあと `npm run dev` で、`wrangler.dev.toml` のローカル D1 につながる。
詳しくは [claude.md](claude.md#参考になったd1の運用)。

</details>

## Notion データベース

`Title` と `Status` 以外は空でも表示できる。プロパティの一覧と本文の書き方は [claude.md](claude.md#notion-のデータベースプロパティ) にまとめてある。

## インフラ

Cloudflare のリソースのうち、D1 と Turnstile のウィジェットは [`infra/`](infra/) の Terraform で管理している。

| リソース | 管理方法 |
|---|---|
| D1 `kt-tech-blog-reactions`、Turnstile ウィジェット | Terraform（`infra/main.tf`） |
| D1 のテーブル | `migrations/*.sql` を wrangler で流す |
| Pages プロジェクト（バインディング・環境変数） | ダッシュボード |
| Cache Rule、アイキャッチ用の R2 バケットなど | ダッシュボード（未移行） |

- state は非公開の R2 バケット `kt-tech-blog-tfstate` に置く。Turnstile のシークレットが平文で入るので、公開アクセスや独自ドメインは付けない
- Pages プロジェクトを Terraform で持たないのは、シークレットのあるプロジェクトを import できず、持つと `NOTION_API_KEY` などがすべて state に入るため（詳しくは `infra/main.tf` の冒頭）
- `infra/tf.sh` が 1Password から API トークンを受け取って Terraform を動かす。R2 の S3 互換キーも同じトークンから導出するので、別に持たない

```bash
cd infra
./tf.sh plan
./tf.sh apply
```

準備と apply 後の手順は [infra/README.md](infra/README.md) を参照。

## セキュリティ

| 対象 | 対策 |
|---|---|
| 「参考になった」の連打・bot | Turnstile のトークンをサーバー側で siteverify に投げて検証する。あわせて Origin が自サイトか、記事が公開中か（Notion で確認）を見てから加算する |
| 本文の生 HTML | CSP を入れている（今は `Report-Only`。違反が出なくなったら強制に切り替える）。`X-Frame-Options: DENY` などは強制済み |
| 秘密情報 | ローカルは 1Password から `op run` で実行中のプロセスにだけ渡す。CI は GitHub Secrets、Pages は Secret。リポジトリには参照（`.env.op`）しか置かない |
| 費用 | Budget alerts で、請求額が $10 を超えたらメールで通知する |

## ディレクトリ構成

```
src/app/           App Router（記事・一覧・検索・OGP・RSS・sitemap、api/reactions）
src/components/    UI コンポーネント（Reaction/ が「参考になった」ボタン）
libs/              Notion REST API クライアント（notion.ts）と記事キャッシュ（notionCache.ts）
styles/            記事本文とコードハイライトの CSS
scripts/           アイキャッチ生成、コンテンツ lint、preview 用の補助
migrations/        D1 のスキーマ（wrangler d1 migrations で流す）
infra/             Terraform（D1・Turnstile）と、1Password 経由で動かす tf.sh
docs/              構成図（architecture.html が元データ）
.github/workflows/ デプロイと PR チェック
public/            静的ファイル、manifest.json、llms.txt
.env.op            1Password の参照だけを並べたファイル（値は入っていない）
wrangler.dev.toml  next dev 専用。ローカルの D1 を DB として生やす
env.d.ts           CloudflareEnv（D1 バインディングなど）の型
```

## 開発時の制約

- 動的ルートには必ず `export const runtime = 'edge'` を付ける
- Edge Runtime なので ISR (`revalidate`) と `generateStaticParams` は使えない
- Node.js 専用 API（`fs`, `path`, `crypto` など）は使えない
- 外部画像のドメインは `next.config.js` の `remotePatterns` に追加する

詳しくは [claude.md](claude.md) を参照。

## 構成図の更新

`docs/architecture.html` をブラウザで開き、`.canvas` 要素をライト / ダーク（`<html data-theme="dark">`）それぞれでスクリーンショットして `docs/architecture.png` / `docs/architecture-dark.png` を差し替える。図のスタイルは [stack-diagram](https://github.com/caru-ini/stack-diagram) のテンプレートを使っている。

PNG は `.canvas` の2倍の解像度（今は 1020×800 なので 2040×1600）で撮る。キャンバスの大きさを変えるときは、`.canvas` と `svg.edges` の width/height と `viewBox` の3か所をそろえる。

## Author

**Koki** — [@tech_koki](https://x.com/tech_koki) / [GitHub](https://github.com/j19015)
