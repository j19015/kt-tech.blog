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
