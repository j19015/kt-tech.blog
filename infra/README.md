# infra

kt-tech.blog の Cloudflare リソースのうち、Terraform で管理しているもの。

| リソース | 管理方法 |
|---|---|
| D1 `kt-tech-blog-reactions` | Terraform（`main.tf`） |
| Turnstile ウィジェット `kt-tech.blog reactions` | Terraform（`main.tf`） |
| D1 のテーブル | `migrations/*.sql` を wrangler で流す |
| Pages プロジェクト（バインディング・環境変数） | ダッシュボード（理由は `main.tf` の冒頭） |
| Cache Rule・R2 のアイキャッチ用バケットなど | ダッシュボード（未移行） |

state は非公開の R2 バケット `kt-tech-blog-tfstate` に置いている。Turnstile のシークレットが
平文で入るので、このバケットに公開アクセスや独自ドメインを付けないこと。

## 準備（初回だけ）

1. Cloudflare の API トークンを作る（My Profile → API Tokens → Create Token → Custom token）
   - Account / D1 / Edit
   - Account / Turnstile Sites / Edit
   - Account / Account Settings / Read
   - Account / Cloudflare Pages / Edit（シークレットを Pages に入れるときに使う）
   - Account / Workers R2 Storage / Edit（state 用のバケットを作るときに使う）
2. `../.env.local` に `CLOUDFLARE_API_TOKEN=...` を1行足す（gitignore 済み。
   GitHub Actions の同名シークレットとは別物）。シェルで export した値があればそちらが優先される
3. state 用のバケットを作る（非公開。独自ドメインや公開アクセスは付けない）

   ```bash
   CLOUDFLARE_API_TOKEN=$(grep '^CLOUDFLARE_API_TOKEN=' ../.env.local | cut -d= -f2-) \
     npx wrangler r2 bucket create kt-tech-blog-tfstate
   ```

4. state 用の認証は `../.env.local` の `R2_ACCESS_KEY` / `R2_SECRET_KEY` / `R2_ENDPOINT` を
   `tf.sh` が読む。このキー（R2 の API トークン `kt-blog-api-token`）は `microcms-image` だけに
   絞ってあるので、R2 → API トークンの編集で `kt-tech-blog-tfstate` も対象に加える。

```bash
cd infra
./tf.sh init
```

## 変更するとき

```bash
./tf.sh plan
./tf.sh apply
```

## 初回の apply のあとにやること

1. テーブルを作る

   ```bash
   npx wrangler d1 execute kt-tech-blog-reactions --remote --file=../migrations/0001_reactions.sql
   ```

2. Pages（kt-tech-blog → 設定 → バインディング）に D1 を変数名 `DB` で追加する（Production）
3. Turnstile のシークレットを Pages の Secret に入れる。値は画面に出さずにそのまま渡す

   ```bash
   ./tf.sh output -raw turnstile_secret | npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name kt-tech-blog
   ```

4. サイトキー（`./tf.sh output -raw turnstile_sitekey`、公開してよい値）を
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` として GitHub Secrets と Pages の環境変数の両方に入れる
5. 再デプロイする（環境変数とバインディングはデプロイ時に反映される）
