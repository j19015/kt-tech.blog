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
2. トークンを 1Password の保管庫 `Private` / アイテム `kt-tech.blog` に `CLOUDFLARE_API_TOKEN`
   として入れる。アカウント ID も `CLOUDFLARE_ACCOUNT_ID` として入れる。
   GitHub Actions の同名シークレットとは別物なので混ぜないこと
3. state 用のバケットを作る（非公開。独自ドメインや公開アクセスは付けない）

   ```bash
   op run --env-file=.env.op -- npx wrangler r2 bucket create kt-tech-blog-tfstate
   ```

```bash
cd infra
./tf.sh init
```

### 認証の仕組み

`tf.sh` は [`.env.op`](.env.op) の参照を `op run` で解決して Terraform を動かす（実行時に
1Password の承認を求められる）。値は環境変数として Terraform のプロセスに渡るだけで、
ファイルには残らない。1Password から取るのは `CLOUDFLARE_API_TOKEN` と
`CLOUDFLARE_ACCOUNT_ID` の2つだけ。

state を置く R2 の認証（S3 互換キー）は、同じ API トークンから `tf.sh` が導出する。
R2 の権限を持つ API トークンはそのまま S3 互換キーとして使える仕様で、

- Access Key ID = トークン ID（`/user/tokens/verify` で取る）
- Secret Access Key = トークン値の SHA-256（16進）
- エンドポイント = `https://<CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com`（`init` の `-backend-config` で渡す）

なので、R2 専用のキーを別に持たなくてよい。

1Password を使わない場合は、`CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` を
シェルで export してから `./tf.sh` を実行する。両方あれば `op` は呼ばれない。

## 変更するとき

```bash
./tf.sh plan
./tf.sh apply
```

## 初回の apply のあとにやること

1. テーブルを作る

   ```bash
   op run --env-file=.env.op -- npx wrangler d1 execute kt-tech-blog-reactions --remote --file=../migrations/0001_reactions.sql
   ```

2. Pages（kt-tech-blog → 設定 → バインディング）に D1 を変数名 `DB` で追加する（Production）
3. Turnstile のシークレットを Pages の Secret に入れる。値は画面に出さずにそのまま渡す

   ```bash
   ./tf.sh output -raw turnstile_secret | op run --env-file=.env.op -- npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name kt-tech-blog
   ```

4. サイトキー（`./tf.sh output -raw turnstile_sitekey`、公開してよい値）を
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` として GitHub Secrets と Pages の環境変数の両方に入れる
5. 再デプロイする（環境変数とバインディングはデプロイ時に反映される）
