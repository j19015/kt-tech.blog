#!/usr/bin/env bash
# Terraform を R2 の state で動かすラッパー。使い方: ./tf.sh plan / ./tf.sh apply など
#
# 秘密情報は 1Password から op run で受け取る（参照は .env.op）。ファイルには残らない。
# CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID が既に環境にあれば op は呼ばない。
#
# state 用の R2 の認証は CLOUDFLARE_API_TOKEN から導出する。R2 の権限を持つ API トークンは
# そのまま S3 互換キーとして使える（Access Key ID = トークン ID、
# Secret Access Key = トークン値の SHA-256 の16進）。R2 専用のキーを別に持たなくてよい。
# 値は画面に出さない。
set -euo pipefail
cd "$(dirname "$0")"

if [[ -z ${CLOUDFLARE_API_TOKEN:-} || -z ${CLOUDFLARE_ACCOUNT_ID:-} ]]; then
  # op run の中で自分を呼び直す。呼び直したのにまだ空なら .env.op か 1Password 側の問題
  if [[ -n ${KT_TF_UNDER_OP:-} ]]; then
    echo "CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID を 1Password から受け取れませんでした（.env.op を確認）" >&2
    exit 1
  fi
  if ! command -v op >/dev/null 2>&1; then
    echo "1Password CLI（op）がありません。CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID を export して実行してください" >&2
    exit 1
  fi
  export KT_TF_UNDER_OP=1
  exec op run --env-file=.env.op -- "./$(basename "$0")" "$@"
fi

# トークン ID を取る。トークンはコマンドライン引数に載せず（ps で見える）、ヘッダーを標準入力から渡す
if ! verify_json=$(printf 'Authorization: Bearer %s\n' "$CLOUDFLARE_API_TOKEN" |
  curl -sS -H @- https://api.cloudflare.com/client/v4/user/tokens/verify); then
  echo "Cloudflare の API に接続できませんでした" >&2
  exit 1
fi
if ! token_id=$(printf '%s' "$verify_json" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except ValueError:
    sys.exit(1)
r = d.get("result") or {}
if d.get("success") and r.get("status") == "active" and r.get("id"):
    print(r["id"])
else:
    sys.exit(1)
'); then
  echo "CLOUDFLARE_API_TOKEN の検証に失敗しました（無効・失効・期限切れの可能性）" >&2
  exit 1
fi
unset verify_json

# s3 backend は init 以外（plan / apply / output など）でも state を読むので、常に設定する
export AWS_ACCESS_KEY_ID="$token_id"
AWS_SECRET_ACCESS_KEY=$(printf '%s' "$CLOUDFLARE_API_TOKEN" | shasum -a 256 | cut -d' ' -f1)
export AWS_SECRET_ACCESS_KEY
R2_ENDPOINT="https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com"

if [[ ${1:-} == init ]]; then
  shift
  exec terraform init -backend-config="endpoints={s3=\"${R2_ENDPOINT}\"}" "$@"
fi

exec terraform "$@"
