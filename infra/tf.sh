#!/usr/bin/env bash
# Terraform を R2 の state で動かすラッパー。使い方: ./tf.sh plan / ./tf.sh apply など
#
# state 用の認証は、アイキャッチ生成と同じ R2 のキーを ../.env.local から読む。
# 値は画面に出さない。Cloudflare 本体の操作は CLOUDFLARE_API_TOKEN を使う。
set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE=../.env.local
if [[ ! -f $ENV_FILE ]]; then
  echo "$ENV_FILE がありません" >&2
  exit 1
fi

# KEY=value の value だけを取り出す（前後の引用符は外す）
read_env() {
  local line
  line=$(grep -E "^$1=" "$ENV_FILE" | tail -n1 || true)
  line=${line#*=}
  line=${line%\"}; line=${line#\"}
  line=${line%\'}; line=${line#\'}
  printf '%s' "$line"
}

export AWS_ACCESS_KEY_ID="$(read_env R2_ACCESS_KEY)"
export AWS_SECRET_ACCESS_KEY="$(read_env R2_SECRET_KEY)"
R2_ENDPOINT="$(read_env R2_ENDPOINT)"

for v in AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY R2_ENDPOINT; do
  if [[ -z ${!v} ]]; then
    echo "$ENV_FILE から $v に当たる値を読めませんでした" >&2
    exit 1
  fi
done

# シェルで export していなければ .env.local の CLOUDFLARE_API_TOKEN を使う
if [[ -z ${CLOUDFLARE_API_TOKEN:-} ]]; then
  CLOUDFLARE_API_TOKEN="$(read_env CLOUDFLARE_API_TOKEN)"
  export CLOUDFLARE_API_TOKEN
fi
if [[ ${1:-} != init && -z ${CLOUDFLARE_API_TOKEN:-} ]]; then
  echo "CLOUDFLARE_API_TOKEN が設定されていません（README.md 参照）" >&2
  exit 1
fi

if [[ ${1:-} == init ]]; then
  shift
  exec terraform init -backend-config="endpoints={s3=\"${R2_ENDPOINT}\"}" "$@"
fi

exec terraform "$@"
