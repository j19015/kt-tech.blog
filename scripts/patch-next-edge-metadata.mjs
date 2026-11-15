#!/usr/bin/env node
/**
 * Edge Runtime のページでも、メタデータ（title・description・canonical・robots・OGP）を
 * <head> に出すための Next.js へのパッチ。postinstall で毎回当てる。
 *
 * Next.js 15.2 から、メタデータは <body> の後ろにストリームで流すのが既定になった。
 * Node.js ランタイムなら next.config の `htmlLimitedBots` で切り替えられるが、
 * Edge 用のテンプレート（build/templates/edge-ssr-app.js）は
 * `serveStreamingMetadata: true` を直書きしていて、設定が効かない。
 * このサイトは全ページが Edge なので、canonical がすべて <body> の途中（約48KB目）に出ていた。
 * Google は <body> の canonical を無視するので、Search Console で
 * 「重複しています。ユーザーにより、正規ページとして選択されていません」になっていた。
 *
 * ストリームをやめても待つのは generateMetadata の分だけで、記事本体の取得と同じ
 * キャッシュに乗る。HTML は CDN にキャッシュされるので、ほとんどの閲覧には影響しない。
 *
 * Next.js を上げてテンプレートの書き方が変わったら、黙って素通りせずに失敗させる。
 * そのときは、上の書き方がまだ直書きされているかを見て、このスクリプトを直すか消す。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
let nextDir;
try {
  nextDir = dirname(require.resolve('next/package.json'));
} catch {
  // next が入っていない（依存を入れる途中など）なら何もしない
  process.exit(0);
}

const FROM = 'serveStreamingMetadata: true,';
const TO = 'serveStreamingMetadata: false,';
const files = ['dist/build/templates/edge-ssr-app.js', 'dist/esm/build/templates/edge-ssr-app.js'];

let failed = false;
for (const rel of files) {
  const file = join(nextDir, rel);
  if (!existsSync(file)) {
    console.error(`[patch-next-edge-metadata] 見つからない: ${rel}`);
    failed = true;
    continue;
  }
  const src = readFileSync(file, 'utf8');
  if (src.includes(TO)) continue; // 当て済み
  if (!src.includes(FROM)) {
    console.error(`[patch-next-edge-metadata] 想定の書き方が無い: ${rel}`);
    failed = true;
    continue;
  }
  writeFileSync(file, src.replace(FROM, TO));
  console.log(`[patch-next-edge-metadata] patched ${rel}`);
}
if (failed) process.exit(1);
