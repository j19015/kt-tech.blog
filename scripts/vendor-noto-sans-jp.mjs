// Noto Sans JP を Google Fonts から取得してリポジトリに取り込むスクリプト。
//
// なぜ手元に持つのか:
//   `next/font/google` はビルドのたびに fonts.googleapis.com から CSS を取りに行く。
//   応答が途中で切れると next/font の URL 抽出が null になり、
//   `TypeError: Cannot read properties of null (reading '1')` でビルドごと落ちる
//   （node_modules/next/dist/compiled/@next/font/dist/google/loader.js:122）。
//   CSS の取得自体はリトライされるが、200 が返ってきた壊れた本文はリトライされないので、
//   デプロイが確率で落ちる。フォントを固定してしまえばビルドが外部に依存しなくなる。
//
// 使い方: node scripts/vendor-noto-sans-jp.mjs
//   フォントを更新したいときだけ手で叩く。通常のビルドでは走らない。
//
// 出力:
//   public/fonts/noto-sans-jp/*.woff2   … unicode-range で分割されたサブセット
//   styles/noto-sans-jp.css             … @font-face 一式（生成物。手で編集しない）
//   src/lib/font-preload.ts             … preload する latin サブセットのパス（生成物）

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

// next/font/google が組み立てるURLと同じもの。
// 使うのは 400 と 700 の2つだけ。500 も読ませていた頃は日本語ページで
// 32ファイル 646KB を落としており、その3分の1が 500 のブロックだった。
// CSS の font matching では 500 の指定は 400 にフォールバックするので、
// 見た目を変えずに読み込み量だけ減らせる。
// display=optional にしているのは CLS 対策。swap だとフォールバックから Noto Sans JP に
// 差し替わるときに日本語の行数が変わり、フッターが押し下げられて CLS 0.219 が出ていた。
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=optional';

// woff2 を返させるための UA。next/font と同じものを使う
// （fetch-css-from-google-fonts.js が指定しているのと同じ Chrome 104）。
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36';

// next/font が Arial のメトリクスから計算していた上書き値。
// これが無いとフォント読み込み前後で行の高さが変わり、レイアウトがずれる。
// 値は next/font が生成した CSS からそのまま持ってきている。
const FALLBACK_FACE = `@font-face {
  font-family: 'Noto Sans JP Fallback';
  src: local('Arial');
  ascent-override: 110.73%;
  descent-override: 27.49%;
  line-gap-override: 0.00%;
  size-adjust: 104.76%;
}`;

const FONT_DIR = path.join('public', 'fonts', 'noto-sans-jp');
const CSS_OUT = path.join('styles', 'noto-sans-jp.css');
const PRELOAD_OUT = path.join('src', 'lib', 'font-preload.ts');
const PUBLIC_PREFIX = '/fonts/noto-sans-jp';

// next/font は subsets に指定したサブセット（ここでは latin）だけを preload していた。
const PRELOAD_SUBSET = 'latin';

/**
 * preload 対象の woff2 を選ぶ。next/font の find-font-files-in-css.js と同じ手順にしてある。
 *
 * Google の CSS はサブセット名を @font-face の直前のコメントに置く。ただし日本語の
 * 120個ほどのスライスにはコメントが付かず、名前が付くのは末尾の cyrillic / vietnamese /
 * latin-ext / latin だけ。そのため「コメントを見たら現在のサブセットを更新する」だけだと、
 * latin の次に来る太さ違いの日本語スライスまで latin 扱いになる。
 * URL の初出だけを採るとこれが打ち消される（日本語スライスは太さ400のブロックで
 * サブセット名なしとして先に登場済みのため）。next/font もこの重複排除で1件に収束している。
 */
function findPreloadUrls(css, subset) {
  const seen = new Map(); // url -> preload するか
  let current = '';
  for (const line of css.split('\n')) {
    const comment = /^\s*\/\*\s*(.+?)\s*\*\/\s*$/.exec(line);
    if (comment) {
      current = comment[1];
      continue;
    }
    const url = /src:\s*url\((https:\/\/[^)]+)\)/.exec(line);
    if (url && !seen.has(url[1])) seen.set(url[1], current === subset);
  }
  return [...seen].filter(([, preload]) => preload).map(([url]) => url);
}

async function main() {
  const res = await fetch(CSS_URL, { headers: { 'user-agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Google Fonts の CSS が取れなかった: ${res.status}`);
  const css = await res.text();

  // 壊れた応答をそのまま取り込まないための検査。
  // next/font がここで落ちているので、同じ壊れ方を検出する。
  const urls = [...css.matchAll(/src:\s*url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error('CSS に font のURLが1つも無い。応答が壊れている可能性がある');
  const bad = urls.filter((u) => !/\.(woff2|woff|ttf|otf)$/.test(u));
  if (bad.length > 0) throw new Error(`拡張子が font でないURLが混ざっている（応答が途中で切れた）: ${bad[0]}`);

  const unique = [...new Set(urls)];
  console.log(`@font-face: ${(css.match(/@font-face/g) ?? []).length} 件 / woff2: ${unique.length} ファイル`);

  await rm(FONT_DIR, { recursive: true, force: true });
  await mkdir(FONT_DIR, { recursive: true });

  // Google のURLは .../s/notosansjp/v<版>/<ハッシュ>.woff2 で、ファイル名は内容が変わらない限り変わらない。
  // その名前をそのまま使うと、更新時に差分が出たファイルだけが入れ替わる。
  const nameOf = (u) => path.basename(new URL(u).pathname);
  let total = 0;
  for (const url of unique) {
    const r = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
    if (!r.ok) throw new Error(`woff2 が取れなかった: ${url} (${r.status})`);
    const buf = Buffer.from(await r.arrayBuffer());
    await writeFile(path.join(FONT_DIR, nameOf(url)), buf);
    total += buf.length;
  }
  console.log(`取得: ${(total / 1024 / 1024).toFixed(2)} MB`);

  // URL を差し替えるだけ。unicode-range も weight も Google が返したものをそのまま使う。
  let out = css.replace(
    /src:\s*url\((https:\/\/[^)]+)\)/g,
    (_, u) => `src: url(${PUBLIC_PREFIX}/${nameOf(u)})`
  );

  out =
    `/* 生成物。手で編集しない。更新は node scripts/vendor-noto-sans-jp.mjs */\n` +
    `/* 元: ${CSS_URL} */\n\n` +
    `${FALLBACK_FACE}\n\n` +
    `:root {\n  --font-noto-sans-jp: 'Noto Sans JP', 'Noto Sans JP Fallback';\n}\n\n` +
    out.trimStart();

  await writeFile(CSS_OUT, out);

  // latin だけ preload する（next/font の subsets: ['latin'] と同じ挙動）。
  // 日本語のサブセットは unicode-range 任せで、必要になったものだけ読まれる。
  const latin = findPreloadUrls(css, PRELOAD_SUBSET);
  if (latin.length !== 1) {
    throw new Error(`${PRELOAD_SUBSET} のサブセットが1件に決まらない（${latin.length}件）`);
  }
  await writeFile(
    PRELOAD_OUT,
    `// 生成物。手で編集しない。更新は node scripts/vendor-noto-sans-jp.mjs\n` +
      `// 本文が出るまでの間、最初に要る latin サブセットだけを先に取りに行かせる。\n` +
      `export const NOTO_SANS_JP_PRELOAD = '${PUBLIC_PREFIX}/${nameOf(latin[0])}';\n`
  );

  const files = await readdir(FONT_DIR);
  console.log(`書き出し: ${CSS_OUT} (${(out.length / 1024).toFixed(1)} KB) / ${FONT_DIR} (${files.length} ファイル)`);
  console.log(`preload: ${PUBLIC_PREFIX}/${nameOf(latin[0])}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
