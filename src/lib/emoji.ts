/**
 * 目次やアンカーIDのために絵文字を落とす。
 *
 * 以前は Unicode のブロック範囲を手で並べていたため、
 * - 🩹🪝🫠（Symbols and Pictographs Extended-A）や ⬆⭐ が漏れて一部だけ残り、
 * - 逆に ✓（U+2713）✗（U+2717）のような「絵文字ではない記号」まで消えていた。
 *
 * `\p{Extended_Pictographic}` は絵文字として描画されうる文字だけを指す
 * Unicode のプロパティなので、範囲を列挙する必要がなく、記号は巻き込まない。
 * 直後の異体字セレクタ（U+FE0F）と、肌色・国旗などの結合列もまとめて落とす。
 */
export function stripEmoji(text: string): string {
  return text
    .replace(
      /\p{Extended_Pictographic}(\u{FE0F}|\u{FE0E})?(\u{200D}\p{Extended_Pictographic}(\u{FE0F}|\u{FE0E})?)*[\u{1F3FB}-\u{1F3FF}]?/gu,
      ''
    )
    // 国旗（Regional Indicator の2文字組）は Extended_Pictographic ではない
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '')
    // 絵文字が消えた跡の連続スペースを詰める
    .replace(/\s{2,}/g, ' ')
    .trim();
}
