// scripts/*.mjs が使う環境変数の読み込み。
//
// 秘密情報は 1Password に置き、`op run --env-file=.env.op -- node scripts/xxx.mjs` で
// 実行時にだけ process.env へ渡すのが基本。.env.local は互換のためのフォールバックで、
// process.env に無いキーだけを埋める（op run で渡した値を上書きしない）。
// .env.local が無くてもエラーにはしない。足りない値は各スクリプトが確認する。

import { existsSync, readFileSync } from 'node:fs';

/** KEY=value の行を読む。空行と # のコメントは飛ばし、値を囲む引用符は外す */
export function parseEnvFile(path) {
  const entries = {};
  for (const raw of readFileSync(path, 'utf-8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.length >= 2 && (val[0] === '"' || val[0] === "'") && val.at(-1) === val[0]) {
      val = val.slice(1, -1);
    }
    if (key && val) entries[key] = val;
  }
  return entries;
}

export function loadEnv(path = '.env.local') {
  if (!existsSync(path)) return;
  for (const [key, val] of Object.entries(parseEnvFile(path))) {
    if (!process.env[key]) process.env[key] = val;
  }
}

