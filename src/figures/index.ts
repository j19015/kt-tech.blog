/**
 * 記事本文に埋め込む図解（SVG）の定義。
 *
 * Notion 記事本文に `:::figure{id="gatekeeper-keys"}` と1行書くと、
 * blogs/[blogId]/page.tsx がここの SVG に差し替える。
 *
 * ルール:
 * - 色は直書きせず、markdown.css の CSS 変数を参照するクラス（fig-*）を使う。
 *   これでブログのライト/ダーク切り替えにそのまま追従する。
 * - 文字は 11〜13px 相当。説明文は図に入れず caption に書く。
 * - <style> や <script> は入れない（本文 HTML にそのまま挿入されるため）。
 */

export type Figure = {
  /** 図の下に出る説明。 */
  caption: string;
  /** SVG 本体。読み上げ用の説明は svg の aria-label に書く。 */
  svg: string;
};

const arrowDefs = (idPrefix: string) => `
  <defs>
    <marker id="${idPrefix}-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"></path>
    </marker>
    <marker id="${idPrefix}-deny" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" class="fig-f-deny"></path>
    </marker>
    <marker id="${idPrefix}-allow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" class="fig-f-allow"></path>
    </marker>
  </defs>`;

export const figures: Record<string, Figure> = {
  'gatekeeper-keys': {
    caption:
      '鍵の置き場所が変わるだけで、事故の上限が変わる。門番は「リポジトリAのイシューは読める／ソースコードは読めない／プルリクの統合は人間の承認が要る」といった粒度で線を引ける。',
    svg: `<svg viewBox="0 0 760 330" role="img" aria-label="従来はAIエージェントがAPIキーを直接持ち外部サービスの全権限に届くのに対し、Cloudflare OSでは鍵をGatekeeperが保持し、エージェントは限定された操作だけを依頼できるという対比図">
      ${arrowDefs('gk')}
      <line x1="380" y1="20" x2="380" y2="310" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5" opacity=".3"></line>

      <text x="30" y="38" class="fig-t-deny fig-label">これまで</text>

      <rect x="30" y="60" width="150" height="58" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="105" y="85" text-anchor="middle" font-size="13" fill="currentColor">AIエージェント</text>
      <text x="105" y="104" text-anchor="middle" font-size="11.5" class="fig-t-deny">🔑 APIキーを保持</text>

      <line x1="105" y1="118" x2="105" y2="188" class="fig-s-deny" stroke-width="2" marker-end="url(#gk-deny)"></line>
      <text x="117" y="158" font-size="11.5" class="fig-t-deny">全権限で直接呼ぶ</text>

      <rect x="30" y="190" width="300" height="58" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="180" y="215" text-anchor="middle" font-size="13" fill="currentColor">外部サービス（GitHub / Google / Slack …）</text>
      <text x="180" y="234" text-anchor="middle" font-size="11.5" fill="currentColor" opacity=".72">できることは、キーの権限すべて</text>

      <text x="30" y="285" font-size="11.5" class="fig-t-deny">誤作動・乗っ取り = 鍵の権限がそのまま実行される</text>

      <text x="420" y="38" class="fig-t-allow fig-label">Cloudflare OS</text>

      <rect x="420" y="60" width="150" height="58" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="495" y="85" text-anchor="middle" font-size="13" fill="currentColor">AIエージェント</text>
      <text x="495" y="104" text-anchor="middle" font-size="11.5" fill="currentColor" opacity=".72">鍵を持たない</text>

      <line x1="495" y1="118" x2="495" y2="148" stroke="currentColor" stroke-width="2" marker-end="url(#gk-ink)"></line>
      <text x="507" y="139" font-size="11.5" fill="currentColor">「イシュー一覧を出して」</text>

      <rect x="420" y="150" width="300" height="58" rx="3" fill="none" class="fig-s-allow" stroke-width="2"></rect>
      <text x="570" y="175" text-anchor="middle" font-size="13" class="fig-t-allow">Gatekeeper（門番）</text>
      <text x="570" y="194" text-anchor="middle" font-size="11.5" class="fig-t-allow">🔑 鍵はここ / 範囲を検査 / 記録を残す</text>

      <line x1="495" y1="208" x2="495" y2="248" class="fig-s-allow" stroke-width="2" marker-end="url(#gk-allow)"></line>
      <text x="507" y="233" font-size="11.5" class="fig-t-allow">許可された1リポジトリだけ</text>

      <rect x="420" y="250" width="300" height="46" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="570" y="278" text-anchor="middle" font-size="13" fill="currentColor">外部サービス</text>
    </svg>`,
  },

  'observation-log': {
    caption:
      '成果物は「どのデータから生まれたか」を忘れない。共有のたびに、受け取る側の権限が元データに対して問い直される。',
    svg: `<svg viewBox="0 0 760 245" role="img" aria-label="エージェントが機密テーブルを読んで作ったダッシュボードには読んだ記録が付随し、権限のない同僚が開こうとするとGatekeeperが再検証して表示を止める流れの図">
      ${arrowDefs('ob')}

      <rect x="24" y="60" width="130" height="56" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="89" y="84" text-anchor="middle" font-size="12.5" fill="currentColor">機密テーブル</text>
      <text x="89" y="102" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">Aさんだけ閲覧可</text>

      <line x1="154" y1="88" x2="212" y2="88" stroke="currentColor" stroke-width="1.8" marker-end="url(#ob-ink)"></line>
      <text x="183" y="78" text-anchor="middle" font-size="11" fill="currentColor">読む</text>

      <rect x="214" y="60" width="120" height="56" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="274" y="92" text-anchor="middle" font-size="12.5" fill="currentColor">エージェント</text>

      <line x1="334" y1="88" x2="392" y2="88" stroke="currentColor" stroke-width="1.8" marker-end="url(#ob-ink)"></line>
      <text x="363" y="78" text-anchor="middle" font-size="11" fill="currentColor">作る</text>

      <rect x="394" y="50" width="160" height="76" rx="3" fill="none" class="fig-s-accent" stroke-width="2"></rect>
      <text x="474" y="76" text-anchor="middle" font-size="12.5" fill="currentColor">ダッシュボード</text>
      <text x="474" y="97" text-anchor="middle" font-size="11" class="fig-t-accent">観測記録が付随</text>
      <text x="474" y="114" text-anchor="middle" font-size="11" class="fig-t-accent" opacity=".85">「機密テーブルを見た」</text>

      <line x1="554" y1="88" x2="612" y2="88" stroke="currentColor" stroke-width="1.8" marker-end="url(#ob-ink)"></line>
      <text x="583" y="78" text-anchor="middle" font-size="11" fill="currentColor">共有</text>

      <rect x="614" y="60" width="120" height="56" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="674" y="84" text-anchor="middle" font-size="12.5" fill="currentColor">同僚Bさん</text>
      <text x="674" y="102" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">権限なし</text>

      <path d="M 674 126 L 674 166 L 474 166 L 474 142" fill="none" class="fig-s-deny" stroke-width="1.8" marker-end="url(#ob-deny)"></path>
      <text x="474" y="190" text-anchor="middle" font-size="11.5" class="fig-t-deny">開こうとした瞬間、Gatekeeperが元データへの権限を再検証</text>
      <text x="474" y="210" text-anchor="middle" font-size="11.5" class="fig-t-deny">→ 権限がなければ中身は出てこない</text>
    </svg>`,
  },

  'figure-pipeline': {
    caption:
      'SVG は markdown-it を通さない。プレースホルダーに退避しておき、本文が HTML になったあとで差し戻す。これで整形に壊されず、色だけ CSS 変数に委ねられる。',
    svg: `<svg viewBox="0 0 720 450" role="img" aria-label="Notionに1行書いた図解マーカーが、Markdown化・プレースホルダーへの退避・markdown-itによるHTML化・SVGへの差し戻しという順で処理され、最終的にテーマ追従するfigureになるまでの流れ図">
      ${arrowDefs('pl')}

      <rect x="40" y="16" width="300" height="56" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="190" y="40" text-anchor="middle" font-size="12.5" fill="currentColor">Notion の本文に 1 行</text>
      <text x="190" y="59" text-anchor="middle" font-size="11" class="fig-t-accent fig-label">:::figure{id="..."}</text>

      <line x1="190" y1="72" x2="190" y2="104" stroke="currentColor" stroke-width="1.8" marker-end="url(#pl-ink)"></line>
      <text x="360" y="94" font-size="11.5" fill="currentColor" opacity=".8">libs/notion.ts が Markdown 化</text>

      <rect x="40" y="106" width="300" height="46" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="190" y="134" text-anchor="middle" font-size="12.5" fill="currentColor">Markdown 文字列</text>

      <line x1="190" y1="152" x2="190" y2="184" stroke="currentColor" stroke-width="1.8" marker-end="url(#pl-ink)"></line>
      <text x="360" y="174" font-size="11.5" fill="currentColor" opacity=".8">SVG は通さず、印だけ残して退避</text>

      <rect x="40" y="186" width="300" height="46" rx="3" fill="none" class="fig-s-allow" stroke-width="2"></rect>
      <text x="190" y="214" text-anchor="middle" font-size="12" class="fig-t-allow fig-label">FIGURE_PLACEHOLDER_0</text>

      <line x1="190" y1="232" x2="190" y2="264" stroke="currentColor" stroke-width="1.8" marker-end="url(#pl-ink)"></line>
      <text x="360" y="254" font-size="11.5" fill="currentColor" opacity=".8">markdown-it が本文を HTML 化</text>

      <rect x="40" y="266" width="300" height="46" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="190" y="294" text-anchor="middle" font-size="12.5" fill="currentColor">HTML（印はそのまま残る）</text>

      <line x1="190" y1="312" x2="190" y2="344" stroke="currentColor" stroke-width="1.8" marker-end="url(#pl-ink)"></line>
      <text x="360" y="334" font-size="11.5" fill="currentColor" opacity=".8">印を SVG に差し戻す</text>

      <rect x="40" y="346" width="300" height="64" rx="3" fill="none" class="fig-s-accent" stroke-width="2"></rect>
      <text x="190" y="372" text-anchor="middle" font-size="12.5" fill="currentColor">figure + SVG</text>
      <text x="190" y="392" text-anchor="middle" font-size="11" class="fig-t-accent">色は CSS 変数 → ライト / ダークに追従</text>
    </svg>`,
  },

  'multiplexer-layers': {
    caption:
      'tmux と herdr は同じ枠に収まるので入れ替えるだけで済む。cmux は上の2層を1つのアプリとして持つため、選んだ時点で Ghostty を手放すことになる。色を付けた枠が、選択によって置き換わる部分。',
    svg: `<svg viewBox="0 0 760 300" role="img" aria-label="tmuxとherdrはマルチプレクサ層だけを入れ替えるのに対し、cmuxはターミナルエミュレータとマルチプレクサの2層を1つのアプリとして持つことを示す対比図">
      ${arrowDefs('mx')}
      <line x1="384" y1="14" x2="384" y2="272" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5" opacity=".3"></line>

      <text x="24" y="22" font-size="12.5" fill="currentColor" class="fig-label">A. 中身だけ入れ替える</text>

      <rect x="24" y="34" width="344" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="196" y="56" text-anchor="middle" font-size="12.5" fill="currentColor">Ghostty</text>
      <text x="196" y="73" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">ターミナルエミュレータ（そのまま）</text>

      <rect x="24" y="96" width="344" height="62" rx="3" fill="none" class="fig-s-accent" stroke-width="2"></rect>
      <text x="196" y="120" text-anchor="middle" font-size="13" class="fig-t-accent">tmux ⇄ herdr</text>
      <text x="196" y="140" text-anchor="middle" font-size="11" class="fig-t-accent" opacity=".85">マルチプレクサ（ここだけ交換）</text>

      <rect x="24" y="172" width="166" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="107" y="201" text-anchor="middle" font-size="12" fill="currentColor">claude</text>
      <rect x="202" y="172" width="166" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="285" y="201" text-anchor="middle" font-size="12" fill="currentColor">zsh</text>

      <text x="24" y="246" font-size="11.5" fill="currentColor" opacity=".8">SSH 先でも動く / Linux でも動く</text>

      <text x="400" y="22" font-size="12.5" fill="currentColor" class="fig-label">B. ターミナルごと乗り換える</text>

      <rect x="400" y="34" width="336" height="124" rx="3" fill="none" class="fig-s-accent" stroke-width="2"></rect>
      <text x="568" y="76" text-anchor="middle" font-size="13" class="fig-t-accent">cmux</text>
      <text x="568" y="97" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">libghostty を内蔵</text>
      <text x="568" y="128" text-anchor="middle" font-size="11" class="fig-t-accent" opacity=".85">上の2層を1つのアプリが持つ</text>

      <rect x="400" y="172" width="160" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="480" y="201" text-anchor="middle" font-size="12" fill="currentColor">claude</text>
      <rect x="576" y="172" width="160" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="656" y="201" text-anchor="middle" font-size="12" fill="currentColor">埋め込みブラウザ</text>

      <text x="400" y="246" font-size="11.5" fill="currentColor" opacity=".8">macOS 専用 / SSH 先では使えない</text>
    </svg>`,
  },

  'multiplexer-axis': {
    caption:
      '同じ層にいても向いている先が違う。tmux が中央なのは劣っているからではなく、エージェントという概念を持たない汎用ツールだから。縦位置に意味はなく、ラベルの重なりを避けているだけ。',
    svg: `<svg viewBox="0 0 760 180" role="img" aria-label="人間が操作しやすい方向とエージェントが操作しやすい方向の軸上に、cmuxが人間寄り、herdrがエージェント寄り、tmuxが中央に位置することを示す図">
      ${arrowDefs('ax')}

      <line x1="90" y1="104" x2="670" y2="104" stroke="currentColor" stroke-width="1.5" opacity=".45" marker-end="url(#ax-ink)" marker-start="url(#ax-ink)"></line>

      <text x="90" y="130" font-size="11.5" fill="currentColor" opacity=".8">人間が操作しやすい</text>
      <text x="670" y="130" text-anchor="end" font-size="11.5" fill="currentColor" opacity=".8">エージェントが操作しやすい</text>

      <circle cx="176" cy="104" r="6" fill="currentColor"></circle>
      <line x1="176" y1="98" x2="176" y2="72" stroke="currentColor" stroke-width="1.5"></line>
      <text x="176" y="62" text-anchor="middle" font-size="13" fill="currentColor" class="fig-label">cmux</text>
      <text x="176" y="42" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">縦タブ・通知・埋め込みブラウザ</text>

      <circle cx="380" cy="104" r="6" fill="currentColor"></circle>
      <line x1="380" y1="110" x2="380" y2="140" stroke="currentColor" stroke-width="1.5"></line>
      <text x="380" y="158" text-anchor="middle" font-size="13" fill="currentColor" class="fig-label">tmux</text>
      <text x="380" y="175" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">どちらにも特化しない汎用ツール</text>

      <circle cx="588" cy="104" r="6" fill="currentColor"></circle>
      <line x1="588" y1="98" x2="588" y2="72" stroke="currentColor" stroke-width="1.5"></line>
      <text x="588" y="62" text-anchor="middle" font-size="13" fill="currentColor" class="fig-label">herdr</text>
      <text x="588" y="42" text-anchor="middle" font-size="11" fill="currentColor" opacity=".72">状態検知・待機 API・エージェント間の連携</text>
    </svg>`,
  },

  'herdr-selfmatch': {
    caption:
      'pane run はコマンド文字列をペインに打ち込むので、その文字列自体が画面に残る。待ち受ける語がコマンドに含まれていると、実行前のエコーに当たって即座に成功が返る。出力にしか現れない値を待つか、行頭・行末のアンカーを付けて回避する。',
    svg: `<svg viewBox="0 0 760 252" role="img" aria-label="herdrのwait-outputがコマンド自身のエコーにマッチして、実行完了を待たずに0.08秒で返ってしまう仕組みを示した図">
      ${arrowDefs('sm')}

      <text x="24" y="22" font-size="12.5" fill="currentColor" class="fig-label">1. pane run が送る文字列</text>
      <rect x="24" y="32" width="420" height="38" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
      <text x="40" y="56" font-size="12.5" fill="currentColor">sleep 5 &amp;&amp; echo <tspan class="fig-t-deny">MARKER</tspan></text>
      <text x="456" y="56" font-size="11.5" fill="currentColor" opacity=".72">MARKER で待つ、と指定したつもり</text>

      <text x="24" y="102" font-size="12.5" fill="currentColor" class="fig-label">2. ペインの画面に出るもの</text>
      <rect x="24" y="112" width="712" height="88" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"></rect>

      <text x="44" y="142" font-size="12" fill="currentColor" opacity=".85">% sleep 5 &amp;&amp; echo <tspan class="fig-t-deny">MARKER</tspan></text>
      <line x1="300" y1="138" x2="340" y2="138" class="fig-s-deny" stroke-width="1.8" marker-end="url(#sm-deny)"></line>
      <text x="352" y="142" font-size="11.5" class="fig-t-deny">コマンド自体のエコー。送った瞬間に出る</text>
      <text x="352" y="160" font-size="11" class="fig-t-deny" opacity=".85">wait-output はここに当たり、t=0.08s で返る</text>

      <text x="44" y="184" font-size="12" class="fig-t-allow">MARKER</text>
      <line x1="300" y1="180" x2="340" y2="180" class="fig-s-allow" stroke-width="1.8" marker-end="url(#sm-allow)"></line>
      <text x="352" y="184" font-size="11.5" class="fig-t-allow">本当の実行結果。t=5s に出る</text>

      <text x="24" y="234" font-size="12" class="fig-t-deny">→ 5秒待つつもりが、実行前に「完了」が返る</text>
    </svg>`,
  },
};

/**
 * 本文中の `:::figure{id="..."}` にマッチする。
 * 独立した1行だけを対象にするので、文中でこの記法自体を引用しても置換されない。
 */
export const FIGURE_PATTERN = /^:::figure\{id="([^"]+)"\}[ \t]*$/gm;

export function renderFigure(id: string): string | null {
  const fig = figures[id];
  if (!fig) return null;
  return `<figure class="figure"><div class="figure-scroll">${fig.svg}</div><figcaption>${fig.caption}</figcaption></figure>`;
}
