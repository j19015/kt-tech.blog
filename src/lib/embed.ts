/**
 * Notion の embed / video / link_preview ブロックを埋め込みHTMLにする。
 *
 * これらのブロックは `default: break` に落ちて丸ごと消えていたため、
 * YouTube の解説動画も CodeSandbox の動くサンプルも、公開されたページには
 * 何も残らなかった。
 *
 * iframe は表示速度を確実に落とすので、
 * - YouTube はサムネイルだけ先に出し、クリックで iframe に差し替える
 * - それ以外の iframe は loading="lazy" + aspect-ratio で CLS を防ぐ
 * - 判別できないものはリンクとして出し、リンクカードにフォールバックさせる
 * という方針にしている。
 */

/** 属性値に入れて安全な形にする */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** YouTube の動画IDを取り出す。ID の文字種を検証して素性の知れない値を弾く */
function youtubeId(u: URL): string | null {
  let id: string | null = null;
  if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
  else if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
    if (u.pathname === '/watch') id = u.searchParams.get('v');
    else if (u.pathname.startsWith('/embed/')) id = u.pathname.slice('/embed/'.length);
    else if (u.pathname.startsWith('/shorts/')) id = u.pathname.slice('/shorts/'.length);
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

function iframeEmbed(src: string, title: string, ratio: string): string {
  return (
    `<div class="embed" style="aspect-ratio:${ratio}">` +
    `<iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" ` +
    `allowfullscreen sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>` +
    `</div>`
  );
}

/**
 * 埋め込みURLを HTML に変換する。
 * 対応していないURLでは null を返す（呼び出し側でリンクとして出す）。
 */
export function embedToHtml(rawUrl: string): string | null {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:') return null;

  const yt = youtubeId(u);
  if (yt) {
    // クリックされるまで iframe を作らない。
    // 記事を開いただけで YouTube の重いスクリプトを読み込むのを避ける。
    // ドメインは youtube-nocookie にして、再生前の追跡も減らす。
    const start = u.searchParams.get('t') || u.searchParams.get('start') || '';
    const startParam = /^\d+$/.test(start) ? `?start=${start}` : '';
    return (
      `<div class="embed embed--youtube" data-youtube="${esc(yt)}" data-start="${esc(startParam)}" style="aspect-ratio:16/9">` +
      `<button type="button" class="embed__play" aria-label="YouTube の動画を再生する">` +
      `<img src="https://i.ytimg.com/vi/${esc(yt)}/hqdefault.jpg" alt="" loading="lazy" decoding="async" />` +
      `<span class="embed__play-icon" aria-hidden="true"></span>` +
      `</button>` +
      `<noscript><a href="${esc(rawUrl)}" target="_blank" rel="noopener noreferrer">YouTube で見る</a></noscript>` +
      `</div>`
    );
  }

  if (/(^|\.)codesandbox\.io$/.test(u.hostname)) {
    const src = u.pathname.startsWith('/embed/')
      ? u.toString()
      : `https://codesandbox.io/embed${u.pathname.replace(/^\/s\//, '/')}`;
    return iframeEmbed(src, 'CodeSandbox', '16/10');
  }

  if (/(^|\.)stackblitz\.com$/.test(u.hostname)) {
    const src = u.searchParams.has('embed') ? u.toString() : `${u.toString()}${u.search ? '&' : '?'}embed=1`;
    return iframeEmbed(src, 'StackBlitz', '16/10');
  }

  if (/(^|\.)speakerdeck\.com$/.test(u.hostname) && u.pathname.startsWith('/player/')) {
    return iframeEmbed(u.toString(), 'Speaker Deck', '16/9');
  }

  if (/(^|\.)figma\.com$/.test(u.hostname)) {
    return iframeEmbed(
      `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(u.toString())}`,
      'Figma',
      '4/3'
    );
  }

  if (/(^|\.)google\.com$/.test(u.hostname) && u.pathname.startsWith('/maps/embed')) {
    return iframeEmbed(u.toString(), 'Google Maps', '16/9');
  }

  // X（Twitter）は公式の埋め込みスクリプトが重く外部JSに依存するため埋め込まない。
  // GitHub Gist も同様にスクリプト方式なので、どちらもリンクカードに任せる。
  return null;
}
