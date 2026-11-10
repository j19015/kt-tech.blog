# kt-tech.blog の Cloudflare リソースのうち、Terraform で持つもの。
#
# Pages プロジェクト（kt-tech-blog）はここでは管理しない。
# - シークレットの環境変数があるプロジェクトは import できない（公式ドキュメントに明記）
# - 管理すると NOTION_API_KEY などの値をすべて state に入れることになる
# - v5.28 時点で、シークレットを更新すると plain_text に化ける不具合がある（#7450）
# そのため D1 のバインディングと Turnstile のシークレットは、ダッシュボードで Pages に設定する。
# 手順は README.md を参照。

variable "account_id" {
  description = "Cloudflare のアカウント ID（秘密情報ではない）"
  type        = string
  default     = "4b738e4e7cfeb60d3cee1bacfec732ea"
}

variable "site_domain" {
  description = "Turnstile を使うドメイン"
  type        = string
  default     = "kt-tech.blog"
}

# 「参考になった」の件数（#455）。テーブルは migrations/ を wrangler で流す
resource "cloudflare_d1_database" "reactions" {
  account_id = var.account_id
  name       = "kt-tech-blog-reactions"

  read_replication = {
    mode = "disabled"
  }

  # 作り直すとデータが全部消える（公式ドキュメントに明記）
  lifecycle {
    prevent_destroy = true
  }
}

# 「参考になった」ボタンの bot 判定。読者には基本的に何も表示しない
resource "cloudflare_turnstile_widget" "reactions" {
  account_id = var.account_id
  name       = "kt-tech.blog reactions"
  domains    = [var.site_domain]
  mode       = "managed"
}

output "d1_database_id" {
  description = "Pages の D1 バインディング（変数名 DB）に選ぶデータベースの ID"
  value       = cloudflare_d1_database.reactions.id
}

output "turnstile_sitekey" {
  description = "NEXT_PUBLIC_TURNSTILE_SITE_KEY に入れる値（公開してよい）"
  value       = cloudflare_turnstile_widget.reactions.sitekey
}

output "turnstile_secret" {
  description = "Pages の Secret TURNSTILE_SECRET_KEY に入れる値。`./tf.sh output -raw turnstile_secret` で表示"
  value       = cloudflare_turnstile_widget.reactions.secret
  sensitive   = true
}

# ------------------------------------------------------------- レート制限（#570）

variable "zone_name" {
  description = "サイトのゾーン"
  type        = string
  default     = "kt-tech.blog"
}

variable "api_rate_limit_per_10s" {
  description = "同じ IP・同じ colo から /api/ に10秒間で通すリクエスト数"
  type        = number
  # 画像の多い記事（本文画像は1枚ごとに /api/notion-image を通る）を開いても
  # 引っかからず、連打だけを止める値。普通の閲覧では1ページで数回しか叩かない
  default = 60
}

data "cloudflare_zone" "site" {
  filter = {
    name = var.zone_name
  }
}

# /api/ への連打を IP 単位で止める。
# /api/notion-image は1回ごとに Notion API を呼ぶので、連打されると記事の描画と共有している
# Notion の枠（平均3リクエスト/秒）を使い切られる。記事ページ（/blogs/）は CDN から返り、
# 存在しない slug も Notion を呼ばない（#575）ので対象にしない。
#
# Free プランの制約: ルールは1本、期間とブロック時間は10秒、キーは IP + colo のみ。
# ゾーンに http_ratelimit の ruleset は1つしか持てないので、ダッシュボードで足さないこと。
resource "cloudflare_ruleset" "rate_limit" {
  zone_id     = data.cloudflare_zone.site.zone_id
  name        = "kt-tech.blog rate limit"
  description = "Terraform で管理（infra/main.tf）"
  kind        = "zone"
  phase       = "http_ratelimit"

  rules = [{
    ref         = "api_burst"
    description = "/api/ への連打を IP 単位で10秒止める"
    expression  = "(starts_with(http.request.uri.path, \"/api/\"))"
    action      = "block"
    ratelimit = {
      characteristics     = ["cf.colo.id", "ip.src"]
      period              = 10
      requests_per_period = var.api_rate_limit_per_10s
      mitigation_timeout  = 10
    }
  }]
}
