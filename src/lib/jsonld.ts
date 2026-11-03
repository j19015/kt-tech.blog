/**
 * JSON-LD を `<script type="application/ld+json">` に直接埋めるための文字列にする。
 *
 * `JSON.stringify` は `<` をそのまま出すので、記事タイトルなど Notion 由来の文字列に
 * `</script><script>...` が入っていると、そこで script 要素が閉じて後ろが HTML として
 * 解釈される。`<` `>` `&` を JSON のユニコードエスケープ（`<` は "\" + "u003c"）に
 * 置き換えれば、HTML としては閉じタグに見えず、JSON としては同じ値のまま読める。
 *
 * LINE SEPARATOR / PARAGRAPH SEPARATOR（U+2028 / U+2029）は JSON では生で書けるが、
 * 古い JavaScript の文字列では改行扱いで構文エラーになるため、こちらも合わせて逃がす。
 */
const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  [String.fromCharCode(0x2028)]: '\\u2028',
  [String.fromCharCode(0x2029)]: '\\u2029',
};

const ESCAPE_RE = new RegExp(`[${Object.keys(ESCAPES).join('')}]`, 'g');

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(ESCAPE_RE, (c) => ESCAPES[c]);
}
