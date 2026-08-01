/**
 * 記事本文の Markdown → HTML 変換。
 *
 * ページコンポーネントに直書きされていたが、コードブロックの描画規則が
 * 増えて単体で確かめたくなったので切り出した。Edge Runtime で動くよう
 * DOM に依存する処理は入れないこと。
 */
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import footnote from 'markdown-it-footnote';
import katex from '@vscode/markdown-it-katex';
import { stripEmoji } from './emoji';

import hljs from 'highlight.js/lib/core';

// highlight.js の既定エントリは190以上の言語定義を含み、Workersのバンドルサイズを圧迫する。
// 記事で実際に使う言語だけを登録する。
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

const LANGUAGES: Record<string, any> = {
  bash, css, diff, dockerfile, go, graphql, java, javascript, json, markdown,
  php, python, ruby, rust, scss, sql, typescript, xml, yaml,
  ini, // toml も ini で色付けできる
};
Object.entries(LANGUAGES).forEach(([name, lang]) => hljs.registerLanguage(name, lang));
// よく使われる別名
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' });
hljs.registerAliases(['js', 'jsx'], { languageName: 'javascript' });
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' });
hljs.registerAliases(['html', 'vue', 'svg'], { languageName: 'xml' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });
hljs.registerAliases(['toml'], { languageName: 'ini' });
hljs.registerAliases(['py'], { languageName: 'python' });
hljs.registerAliases(['rb'], { languageName: 'ruby' });

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// コードブロック右上に出す言語ラベル。
// 以前はCSSに言語ごとの ::before をハードコードしていたため、
// 列挙外の言語ではラベルが空文字になり、余白だけが2em空いていた。
// 別名も含めて引けるようにしておく。
// hljs.getLanguage().name は "HTML, XML" のような文字列を返すことがあり、正規化には使えない。
const LANG_LABELS: Record<string, string> = {
  bash: 'Bash', sh: 'Bash', shell: 'Bash', zsh: 'Bash',
  css: 'CSS', scss: 'SCSS',
  diff: 'Diff', dockerfile: 'Dockerfile',
  go: 'Go', graphql: 'GraphQL',
  ini: 'INI', toml: 'TOML',
  java: 'Java',
  javascript: 'JavaScript', js: 'JavaScript', jsx: 'JSX',
  typescript: 'TypeScript', ts: 'TypeScript', tsx: 'TSX',
  json: 'JSON', markdown: 'Markdown',
  php: 'PHP',
  python: 'Python', py: 'Python',
  ruby: 'Ruby', rb: 'Ruby',
  rust: 'Rust', sql: 'SQL',
  xml: 'XML', html: 'HTML', vue: 'Vue', svg: 'SVG',
  yaml: 'YAML', yml: 'YAML',
};

type CodeInfo = {
  /** 実際にハイライトする言語（`diff ts` なら ts） */
  lang: string;
  /** キャプション由来のファイル名。ヘッダーに出す */
  filename: string;
  /** `diff ts` 形式かどうか。行頭の +/- を取り除いて言語ハイライトする */
  isDiffOverlay: boolean;
  /** `{1,3-5}` で指定された強調行（1始まり） */
  marked: Set<number>;
};

/**
 * フェンスの情報文字列を解釈する。
 *
 * 対応する書式（Zenn 記法に合わせている）:
 *   ```ts
 *   ```ts:src/app/page.tsx
 *   ```ts {3,7-9}
 *   ```diff ts:src/app/page.tsx
 */
export function parseCodeInfo(lang: string, attrs: string): CodeInfo {
  const marked = new Set<number>();
  let rest = [lang, attrs].filter(Boolean).join(' ').trim();

  rest = rest
    .replace(/\{\s*([\d,\s-]+)\}/g, (_m, spec: string) => {
      spec.split(',').forEach((part) => {
        const [from, to] = part.split('-').map((n) => Number.parseInt(n.trim(), 10));
        if (!Number.isFinite(from)) return;
        const end = Number.isFinite(to) ? to : from;
        // 桁を打ち間違えた指定でループが暴走しないよう上限を設ける
        for (let i = from; i <= Math.min(end, from + 999); i += 1) marked.add(i);
      });
      return '';
    })
    .trim();

  // `diff` 単体は highlight.js の diff 言語として扱う（従来どおり）。
  // `diff ts` のように後ろに言語が続くときだけ差分オーバーレイにする。
  const isDiffOverlay = /^diff\s+\S/.test(rest);
  if (isDiffOverlay) rest = rest.replace(/^diff\s+/, '');

  // ファイル名には空白が入りうるので、最初の `:` から後ろを全部ファイル名とみなす
  const colon = rest.indexOf(':');
  const langName = (colon >= 0 ? rest.slice(0, colon) : rest.split(/\s+/)[0] ?? '').trim();
  const filename = colon >= 0 ? rest.slice(colon + 1).trim() : '';

  return { lang: langName, filename, isDiffOverlay, marked };
}

/**
 * highlight.js が返す HTML を行単位に分割する。
 *
 * 単純に `\n` で split すると、テンプレートリテラルやブロックコメントのように
 * 複数行にまたがる `<span>` が途中で切れてタグが壊れる。
 * 行末で開いているタグを閉じ、次の行頭で開き直すことで各行を独立した断片にする。
 * （highlight.js の出力に現れるタグは `<span>` だけなのでこの単純化が成立する）
 */
export function splitHighlightedLines(html: string): string[] {
  const lines: string[] = [];
  const open: string[] = [];
  let buf = '';
  const token = /<span[^>]*>|<\/span>|\n|[^<\n]+|</g;
  let m: RegExpExecArray | null;
  while ((m = token.exec(html)) !== null) {
    const tok = m[0];
    if (tok === '\n') {
      lines.push(buf + '</span>'.repeat(open.length));
      buf = open.join('');
    } else if (tok === '</span>') {
      open.pop();
      buf += tok;
    } else if (tok.startsWith('<span')) {
      open.push(tok);
      buf += tok;
    } else {
      buf += tok;
    }
  }
  lines.push(buf + '</span>'.repeat(open.length));
  return lines;
}

/** コードブロックをヘッダー付きのラッパーで包む */
function wrapCodeBlock(inner: string, info: CodeInfo, label: string): string {
  const aria = info.filename
    ? `${info.filename} のコード`
    : label
      ? `${label}のコード`
      : 'コード';
  const name = info.filename
    ? `<span class="code-block__name" title="${escapeHtml(info.filename)}">${escapeHtml(info.filename)}</span>`
    : '<span class="code-block__name"></span>';
  const langLabel = label ? `<span class="code-block__lang">${escapeHtml(label)}</span>` : '';
  return (
    `<div class="code-block">` +
    `<div class="code-block__bar">${name}${langLabel}</div>` +
    // tabindex を付けないと、横スクロールするコードブロックにキーボードで到達できない
    `<pre role="region" tabindex="0" aria-label="${escapeHtml(aria)}">${inner}</pre>` +
    `</div>`
  );
}

/**
 * フェンス（```）1つ分の HTML を組み立てる。
 *
 * markdown-it の `highlight` オプションは、戻り値が `<pre` で始まらないと
 * さらに `<pre><code>` で包んでしまう。ヘッダー付きの `<div>` を返したいので
 * fence のレンダラごと差し替えている。
 */
function renderFence(rawInfo: string, str: string): string {
  const info = parseCodeInfo(rawInfo.trim(), '');
  const key = info.lang.toLowerCase();

  // Mermaid は DOM が要るので Edge では描画できない。ソースをそのまま残し、
  // クライアント側の MermaidRenderer が SVG に差し替える。
  // JS が無効でも図の定義がコードとして読める状態は保たれる。
  if (key === 'mermaid') {
    return (
      `<div class="mermaid-block">` +
      `<div class="mermaid-block__figure" aria-hidden="true"></div>` +
      `<pre class="mermaid-block__source" role="region" tabindex="0" aria-label="Mermaid 図の定義"><code class="hljs language-mermaid">${escapeHtml(str)}</code></pre>` +
      `</div>`
    );
  }

  const label = LANG_LABELS[key] ?? (key && key !== 'text' ? key.toUpperCase() : '');
  const source = str.replace(/\n$/, '');
  const highlightable = Boolean(info.lang) && Boolean(hljs.getLanguage(info.lang));
  const needsLines = info.isDiffOverlay || info.marked.size > 0;

  if (!needsLines) {
    // 行単位の装飾が不要なら従来どおり一塊で出す（DOM が軽く、コピーも素直）
    const body = highlightable
      ? hljs.highlight(source, { language: info.lang }).value
      : escapeHtml(source);
    const cls = highlightable ? `hljs language-${escapeHtml(info.lang)}` : 'hljs';
    return wrapCodeBlock(`<code class="${cls}">${body}</code>`, info, label);
  }

  const rawLines = source.split('\n');
  let markers: string[] = [];
  let body = source;
  if (info.isDiffOverlay) {
    markers = rawLines.map((l) => (l.startsWith('+') ? '+' : l.startsWith('-') ? '-' : ''));
    // unified diff 形式（文脈行が半角スペース始まり）かどうかで剥がし方を変える
    const unified = rawLines.every((l) => l === '' || /^[+\- ]/.test(l));
    body = rawLines
      .map((l) => (/^[+-]/.test(l) || (unified && l.startsWith(' ')) ? l.slice(1) : l))
      .join('\n');
  }

  const highlighted = highlightable
    ? hljs.highlight(body, { language: info.lang }).value
    : escapeHtml(body);
  // 行数がずれると +/- の対応が崩れるので、分割結果を元の行数に合わせる
  const lines = splitHighlightedLines(highlighted).slice(0, rawLines.length);

  const rendered = lines
    .map((line, i) => {
      const cls = ['code-line'];
      if (markers[i] === '+') cls.push('code-line--added');
      else if (markers[i] === '-') cls.push('code-line--removed');
      if (info.marked.has(i + 1)) cls.push('code-line--marked');
      return `<span class="${cls.join(' ')}">${line}</span>`;
    })
    // 改行は行スパンの外に置く。textContent に改行が残るのでコピーが壊れない
    .join('\n');

  const codeCls = [
    'hljs',
    highlightable ? `language-${escapeHtml(info.lang)}` : '',
    'has-code-lines',
    info.isDiffOverlay ? 'has-diff' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return wrapCodeBlock(`<code class="${codeCls}">${rendered}</code>`, info, label);
}

export const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  // typographer は "..." を … に、-- を – に変換してしまう。
  // 技術記事ではコマンドやJSONの引用符が壊れるため無効にする。
  typographer: false,
});
md.renderer.rules.fence = (tokens, idx) => `${renderFence(tokens[idx].info || '', tokens[idx].content)}\n`;
// インデント（半角スペース4つ）で書かれたコードも同じ見た目にそろえる。
// 情報文字列を持てないので言語なし扱い。
md.renderer.rules.code_block = (tokens, idx) => `${renderFence('', tokens[idx].content)}\n`;
/**
 * 見出しの id を作る。
 *
 * 以前は `encodeURIComponent` していたため、日本語の見出しが
 * `%E5%88%B6%E7%B4%84` のように1文字9文字へ膨らみ、共有した URL が
 * 読めない長さになっていた。HTML5 では id に日本語をそのまま使えるし、
 * 旧来のパーセントエンコード済みリンクも、ブラウザがフラグメントを
 * デコードして一致を探すため引き続き同じ見出しに着地する。
 *
 * ただし URL のフラグメントや属性値で扱いに困る記号だけは落とす。
 */
export function headingSlug(text: string): string {
  // 絵文字はIDに入れても意味がなく、URLに載ると読みにくいので落とす
  return stripEmoji(String(text))
    .trim()
    .toLowerCase()
    .replace(/["'<>`#%\\/?&=+]/g, '')
    .replace(/\s+/g, '-');
}

// 脚注。「※ ただし Node 20 未満では〜」のような補足を本文の流れから
// 外に出せるようにする。これまでは括弧書きで挟むか callout を使うしかなく、
// callout だと「注意喚起」と「余談」が見分けられなかった。
md.use(footnote);
// 数式。KaTeX は DOM に依存しない純粋な文字列変換なので Edge でも動き、
// サーバー側で HTML まで作れる（クライアントに KaTeX の JS を送らずに済む）。
md.use(katex, {
  // 数式が壊れていてもページ全体を落とさず、その箇所だけ赤字で出す
  throwOnError: false,
  errorColor: '#dc2626',
});
md.use(anchor, {
  slugify: headingSlug,
  // 見出しの右側に本物のリンクを置く。
  // aria-hidden にしているのは、スクリーンリーダーは見出し自体で移動でき、
  // 見出しごとに「#」のリンクが読み上げられると邪魔になるため（GitHub と同じ方針）。
  // aria-hidden な要素をフォーカス可能にしたままにはできないので tabindex も落とす。
  permalink: anchor.permalink.linkInsideHeader({
    class: 'heading-anchor',
    symbol: '#',
    placement: 'after',
    space: false,
    ariaHidden: true,
    renderAttrs: () => ({ tabindex: '-1' }),
  }),
});
