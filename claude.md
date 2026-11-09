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
│   │   ├── about/             # Aboutページ
│   │   └── api/
│   │       ├── notion-image/[blockId]/ # Notion画像の署名URLを取り直す
│   │       └── reactions/[slug]/       # 「参考になった」の件数（D1）
│   ├── components/            # 再利用可能コンポーネント
│   │   └── Reaction/          # 「参考になった」ボタン（Turnstile）
│   └── lib/
├── libs/
│   ├── notion.ts              # Notion REST API クライアント（直接fetch）
│   └── gtag.ts                # Google Analytics
├── migrations/
│   └── 0001_reactions.sql     # D1 のスキーマ（reactions）
├── infra/                     # Terraform（D1・Turnstile）。手順は infra/README.md
├── env.d.ts                   # CloudflareEnv（D1 バインディングなど）の型
├── wrangler.dev.toml          # next dev 専用。ローカルの D1 を DB として生やす（本番は読まない）
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

ローカルの秘密情報は **1Password**（保管庫 `Private` / アイテム `kt-tech.blog`）に置き、
`op run` で実行時にだけプロセスへ渡す。参照の一覧はリポジトリ直下の `.env.op`
（`KEY=op://Private/kt-tech.blog/KEY`、値は入っていないのでコミット済み）。
Terraform 用は `infra/.env.op` に分けてある（`infra/tf.sh` が自分で `op run` する）。

| 用途 | コマンド |
|---|---|
| 開発サーバー | `npm run dev:op` |
| 本番相当の確認 | `npm run preview:op`（`.dev.vars` を生成する。平文なので使い終わったら消してよい） |
| スクリプト | `op run --env-file=.env.op -- node scripts/xxx.mjs` |
| Terraform | `cd infra && ./tf.sh plan` |

- `.env.local` も引き続き使える（互換）。`npm run dev` / `npm run preview` / `node scripts/...` は
  `.env.local` を読む。両方ある場合は `op run` で渡した値が優先される
- **値を画面やログに出さないこと。** 確認するときはキー名だけを出す
- GitHub Actions は GitHub Secrets のまま（1Password は使っていない）
- 1Password の `CLOUDFLARE_API_TOKEN` は Terraform 用のトークンで、GitHub Secrets の同名の値とは別物

### ビルド時 + ランタイム（Cloudflare Pages Settings + GitHub Secrets 両方に設定）
```env
NOTION_API_KEY=ntn_xxx           # Notion APIトークン（Secret）
NOTION_DATABASE_ID=xxx           # Notion Database ID (REST API用)
NEXT_PUBLIC_GA_ID=G-xxx          # Google Analytics
SITE_URL=https://kt-tech.blog   # サイトURL
```

### 「参考になった」（Issue #455）
```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx  # Turnstile のサイトキー。ビルド時に埋まるので GitHub Secrets と Pages の両方に。未設定ならボタンを出さない
TURNSTILE_SECRET_KEY=xxx            # Turnstile のシークレット。Pages の Secret のみ（ランタイムで使う）
```

D1 はバインディングで渡す（環境変数ではない）。Pages の Settings → Bindings で
D1 データベース `kt-tech-blog-reactions` を変数名 `DB` で Production / Preview に追加する。
バインディングが無い環境では `/api/reactions/*` が 503 を返し、ボタンは出ない。

### CI/CD用（GitHub Secretsのみ）
```env
CLOUDFLARE_API_TOKEN=xxx         # Cloudflare API
CLOUDFLARE_ACCOUNT_ID=xxx        # Cloudflare アカウントID
CLOUDFLARE_ZONE_ID=xxx           # キャッシュパージ用
```

### eyecatch生成スクリプト用（ローカルのみ。1Password の `.env.op` 経由）
```env
GEMINI_API_KEY=xxx               # Gemini API
R2_ENDPOINT=xxx                  # Cloudflare R2
R2_ACCESS_KEY=xxx                # R2アクセスキー
R2_SECRET_KEY=xxx                # R2シークレットキー
NEXT_PUBLIC_BUCKET_NAME=xxx      # R2バケット名
NEXT_PUBLIC_R2_BUCKET_URL=xxx    # R2パブリックURL
```

## Notion のデータベースプロパティ

必須のもの以外は、埋めなくても記事は問題なく表示される（プロパティ自体が
未作成のデータベースでも落ちない）。

| プロパティ | 型 | 必須 | 用途 |
|---|---|---|---|
| `Title` | Title | ○ | 記事タイトル |
| `Slug` | Text | | URL。未設定ならページIDを使う |
| `Status` | Select | ○ | `Published` のものだけ公開される |
| `Created` | Date | | 公開日。未設定なら Notion の作成日時 |
| `Category` | Select | | カテゴリ。`PF` は一覧・検索・関連記事から除外される |
| `Tags` | Multi-select | | タグ |
| `Eyecatch` | URL | | アイキャッチ。未設定ならページのカバー画像 |
| `OGP Description` | Text | | 検索結果・OGPの説明文 |
| `Summary` | Text（複数行） | | 「この記事でわかること」。改行で1項目 |
| `Prerequisites` | Text | | 対象読者・動作環境。要約の下に出る |
| `Changelog` | Text（複数行） | | 更新履歴。`YYYY-MM-DD 内容` を1行1件。日付で始まらない行は無視される |
| `Series` | Select | | 連載名 |
| `SeriesOrder` | Number | | 連載内の順序。未設定なら公開日順にフォールバック |

## 本文の書き方（Notion ブロックの扱い）

| Notion での書き方 | 出力 |
|---|---|
| Heading 1 / 2 / 3 | `h2` / `h3` / `h4`（`h1` は記事タイトルなので1段下げる） |
| コードブロックのキャプション | ファイル名として表示。`言語:ファイル名` 形式（Zenn 記法） |
| 同キャプションに `{1,3-5}` | その行をハイライト |
| コードブロックの言語 `diff ts` | 差分表示。行頭の `+` / `-` を色分けする |
| コードブロックの言語 `mermaid` | 図として描画（クライアント側） |
| Equation（ブロック/インライン） | KaTeX で数式に |
| Embed / Video（YouTube・CodeSandbox 等） | 埋め込み。判別できないURLはリンクカード |
| Quote の最終行 `— 出典` | `<cite>` として切り出す |
| Callout の色 | 種別に対応（gray/brown→メモ、green→Tips、blue/purple→ポイント、yellow/orange→注意、red/pink→重要） |
| 本文に `[^1]` と `[^1]: 説明` | 脚注 |
| `[toc]` だけの段落 | 目次の目印として除去される（コードブロック内の `[toc]` は残る） |

## 開発時の注意点

1. **Edge Runtime**: 動的ルートには必ず `export const runtime = 'edge'` を設定
2. **ISR/SSG不可**: `revalidate` も `generateStaticParams` も使えない
3. **Notion API**: REST API直接fetch（SDKはcrypto依存で使えない）
4. **画像ドメイン**: `next.config.js` の `remotePatterns` に追加が必要
5. **callout UI**: Notionのcalloutブロックは `:::callout` マーカー → プレースホルダー → HTML変換の3段階処理
6. **見出し**: 絵文字は本文にそのまま残す。目次とアンカーIDを作るときだけ `stripEmoji()`（`src/lib/emoji.ts`）で落とす
7. **ビルド**: `npx @cloudflare/next-on-pages` で一括ビルド（`--skip-build`不可）
8. **`.npmrc`**: `legacy-peer-deps=true` が必要（vercel build互換）
9. **コミットメッセージ**: wrangler deployで日本語が拒否されるためCI/CDではASCII指定
10. **Workerバンドルサイズ**: Edge向けビルドは非同期チャンクを分割せず1ファイルに畳み込む。
    クライアント専用の重いライブラリ（mermaid など）は `next/dynamic` の `ssr: false` で
    隔離しないと Worker のバンドルに載る（`src/components/Mermaid/MermaidLoader.tsx` 参照）
11. **Notion画像の署名切れ**: アップロード画像のURLは1時間で失効するため、本文には
    `/api/notion-image/[blockId]` を埋めてリクエスト時に取り直す
12. **色**: `--foreground` / `--background`（shadcn のトークン、値は slate）に一本化。
    `--foreground-rgb` 系は廃止済み
13. **CSP**: `next.config.js` に Report-Only で入れてある。配信環境の Console に違反が
    出なくなったら `Content-Security-Policy` にキー名を変えて有効化する

## 「参考になった」（D1）の運用

- 件数は D1 `kt-tech-blog-reactions` の `reactions` テーブルに1記事1行（キーは `Blog.id`）
- **wrangler.toml は置かない。** Pages に wrangler.toml があると `wrangler pages deploy` が
  それを設定の正とし、ダッシュボードのバインディングや `nodejs_compat` を上書きする。
  バインディングはダッシュボードで管理し、ローカル用の設定は `wrangler.dev.toml` に分けてある
- 本番へのスキーマ適用（初回・変更時。ファイル名で DB を引くので ID は書かなくてよい）:
  `npx wrangler d1 execute kt-tech-blog-reactions --remote --file=migrations/0001_reactions.sql`
- ローカルで試す: `npm run db:migrate:local` → `.env.local` に Turnstile のテスト用キー
  （サイトキー `1x00000000000000000000AA` / シークレット `1x0000000000000000000000000000000AA`、
  必ず通る公開のダミー）を入れて `npm run dev`。データは `.wrangler/` に残る
- `npm run preview`（wrangler pages dev）には D1 を渡していないので、ボタンは出ない

## 重要なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run dev:op` | 開発サーバー起動（1Password から環境変数を渡す） |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint実行 |
| `npm run db:migrate:local` | ローカルの D1 に migrations/ を適用 |
| `npx @cloudflare/next-on-pages` | Cloudflare Pages用ビルド |
| `op run --env-file=.env.op -- node scripts/generate-eyecatch.mjs` | eyecatch未設定記事に画像生成（WebP） |
| `op run --env-file=.env.op -- node scripts/generate-eyecatch.mjs --dry-run` | 対象記事の確認のみ |
