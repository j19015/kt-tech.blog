// `.env.local` から `.dev.vars` を作る。
//
// wrangler は `.env.local` を読まない（Next.js の作法とは別で、`.dev.vars` を見る）。
// これが無いと `wrangler pages dev` が環境変数なしで動き、Notion API を叩けず
// 全ページが 503 になる。原因が分かりにくいので毎回自動で同期する。
//
// `.dev.vars` は秘匿情報そのものなので .gitignore に入れてある。

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const SRC = '.env.local';
const DEST = '.dev.vars';

if (!existsSync(SRC)) {
  console.error(`${SRC} がありません。.env.example を参考に作成してください。`);
  process.exit(1);
}

const body = readFileSync(SRC, 'utf-8');
writeFileSync(DEST, body);

const count = body
  .split('\n')
  .filter((line) => line.trim() && !line.trim().startsWith('#') && line.includes('='))
  .length;

console.log(`${DEST} を更新しました（${count} 変数）`);
