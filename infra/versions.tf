terraform {
  required_version = ">= 1.10"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
  }

  # state は非公開の R2 バケットに置く。Turnstile のシークレットが平文で入るため、
  # 公開ドメイン（img.kt-tech.blog）を繋いでいるアイキャッチ用のバケットには置かないこと。
  # エンドポイントはアカウントごとに違うので、tf.sh が -backend-config で渡す。
  backend "s3" {
    bucket = "kt-tech-blog-tfstate"
    key    = "kt-tech-blog/terraform.tfstate"
    region = "auto"

    # R2 は S3 互換だが AWS ではないので、AWS 前提の確認をすべて切る
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

provider "cloudflare" {
  # 認証は環境変数 CLOUDFLARE_API_TOKEN から読む（ファイルには書かない）
}
