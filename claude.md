# Claude.md - kt-tech.blog

## プロジェクト概要

kt-tech.blogは、Next.js 13とTypeScriptで構築された技術ブログサイトです。microCMSをヘッドレスCMSとして使用し、レスポンシブデザインとダークモード対応、高いSEO最適化を実現している現代的なブログプラットフォームです。

## 技術スタック

### フロントエンド
- **Next.js 13.4.19** (App Router使用)
- **React 18.2.0**
- **TypeScript 5.2.2**
- **Tailwind CSS 3.3.3**
- **styled-components 6.1.8**

### UI・デザイン
- **Radix UI** (アクセシブルなプリミティブコンポーネント)
- **FontAwesome** (アイコン)
- **Lucide React** (モダンアイコン)
- **next-themes** (ダークモード切り替え)

### コンテンツ管理
- **microCMS** (ヘッドレスCMS)
- **Zenn Markdown** (Markdownレンダリング)
- **Highlight.js** (シンタックスハイライト)
- **Cheerio** (HTMLパースと操作)

### 分析・SEO
- **Google Analytics**
- **next-sitemap** (サイトマップ自動生成)

## 主要機能

- 📱 レスポンシブデザイン
- 🌙 ダークモード対応
- 🔍 リアルタイム検索機能
- 📄 ページネーション
- 🏷️ カテゴリ・タグ別フィルタリング
- 📅 アーカイブ機能（年月別）
- 📋 目次自動生成
- 🔗 リンクカード表示
- 📊 Google Analytics連携
- 🚀 SEO最適化

## ディレクトリ構造

```
kt-tech.blog/
├── src/
│   ├── app/                    # App Router (Next.js 13)
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── blogs/             # ブログ関連ルート
│   │   │   ├── [blogId]/      # ブログ詳細
│   │   │   └── page/[pageId]/ # ページネーション
│   │   ├── categories/        # カテゴリ別記事
│   │   ├── tags/              # タグ別記事
│   │   ├── searches/          # 検索機能
│   │   ├── about/             # Aboutページ
│   │   └── profile/           # プロフィール
│   ├── components/            # 再利用可能コンポーネント
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   ├── Modal/
│   │   ├── Form/
│   │   ├── Pagination/
│   │   ├── TableOfContents/
│   │   └── ui/               # shadcn/ui系コンポーネント
│   └── lib/
├── libs/
│   ├── microcms.ts           # microCMS API クライアント
│   └── gtag.ts               # Google Analytics
├── public/
├── styles/
└── 設定ファイル
```

## 開発手順

### 1. 環境セットアップ

```bash
# 依存関係のインストール
npm install
# または
yarn install
```

### 2. 環境変数設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```env
NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN=your-service-domain
NEXT_PUBLIC_MICROCMS_API_KEY=your-api-key
NEXT_PUBLIC_GA_ID=your-ga-id
SITE_URL=https://kt-tech.blog
```

### 3. 開発サーバー起動

```bash
npm run dev
# または
yarn dev
```

開発サーバーは `http://localhost:3000` で起動します。

### 4. ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# ビルド後のサーバー起動
npm run start
```

## 重要なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint実行 |
| `npm run lint:fix` | ESLint自動修正 |
| `npm run format` | Prettierでコードフォーマット |

## microCMS設定

### APIエンドポイント
- `blogs` - ブログ記事
- `categories` - カテゴリ
- `tags` - タグ

### 必要なフィールド

**Blogs API**
- `title` (テキスト) - 記事タイトル
- `body` (リッチエディタ) - 記事本文
- `eyecatch` (画像) - アイキャッチ画像
- `category` (コンテンツ参照 - categories) - カテゴリ
- `tags` (複数コンテンツ参照 - tags) - タグ

**Categories API**
- `name` (テキスト) - カテゴリ名

**Tags API**
- `name` (テキスト) - タグ名

## デプロイ

このプロジェクトはVercelでのデプロイに最適化されていますが、Cloudflare Pagesでも動作します。

### Vercel
```bash
npm install -g vercel
vercel
```

### Cloudflare Pages
`@cloudflare/next-on-pages` が含まれているため、Cloudflare Pagesでも動作します。

## 開発時の注意点

1. **型安全性**: TypeScriptの型チェックを必ず確認
2. **レスポンシブ**: モバイルファーストでの開発を心がける
3. **アクセシビリティ**: セマンティックHTMLとARIA属性の適切な使用
4. **パフォーマンス**: 画像最適化とStatic Generation活用
5. **SEO**: メタデータとOGP設定の確認

## トラブルシューティング

### よくある問題

1. **microCMS API接続エラー**
   - 環境変数の設定確認
   - APIキーの権限確認

2. **ビルドエラー**
   - TypeScriptの型エラー確認
   - 不要なimportの削除

3. **スタイルが適用されない**
   - Tailwind CSSの設定確認
   - CSS Modulesとの競合確認

## 貢献ガイドライン

1. 新機能追加前にIssueを作成
2. 適切なブランチ命名規則に従う (`feature/`, `fix/`, `chore/`)
3. コミットメッセージはConventional Commits形式
4. プルリクエスト前にlintとtypecheckを実行

## ライセンス

このプロジェクトはプライベートプロジェクトです。