// `wrangler pages dev` 用の `.dev.vars` を作る。
//
// wrangler は `.env.local` も process.env も読まない（Next.js の作法とは別で、`.dev.vars` を見る）。
// これが無いと `wrangler pages dev` が環境変数なしで動き、Notion API を叩けず
// 全ページが 503 になる。原因が分かりにくいので毎回自動で同期する。
//
// 値の出どころ（後のものが優先）:
// 1. `.env.local`（あれば）
// 2. process.env のうち `.env.op` に名前があるキー。`npm run preview:op`
//    （= op run --env-file=.env.op -- npm run preview）で 1Password の値が入る
// process.env 全体は書き出さない（PATH などや無関係な秘密情報まで平文で残るため）。
//
// `.dev.vars` は秘匿情報が平文で入るファイル。.gitignore 済みだが、1Password 運用で
// ディスクに残したくなければ確認が終わったら `rm .dev.vars` で消してよい
// （次の `npm run preview` / `preview:op` で作り直される）。

import { existsSync, writeFileSync } from 'node:fs';
import { parseEnvFile } from './load-env.mjs';

const LOCAL = '.env.local';
const OP_REFS = '.env.op';
const DEST = '.dev.vars';

const vars = existsSync(LOCAL) ? parseEnvFile(LOCAL) : {};

let fromProcess = 0;
if (existsSync(OP_REFS)) {
  for (const key of Object.keys(parseEnvFile(OP_REFS))) {
    const val = process.env[key];
    if (val) {
      vars[key] = val;
      fromProcess++;
    }
  }
}

const count = Object.keys(vars).length;
if (count === 0) {
  console.error(
    `${DEST} に書く値がありません。npm run preview:op（1Password）で実行するか、${LOCAL} を作成してください。`,
  );
  process.exit(1);
}

// 普通の値はそのまま書く。空白・#・引用符・改行を含む値だけダブルクォートで囲んでエスケープする
const quote = (val) => (/^[^\s#"'`\\]*$/.test(val) ? val : JSON.stringify(val));
const body = Object.entries(vars)
  .map(([key, val]) => `${key}=${quote(val)}`)
  .join('\n');
writeFileSync(DEST, `${body}\n`, { mode: 0o600 });

console.log(`${DEST} を更新しました（${count} 変数、うち process.env から ${fromProcess}）`);
