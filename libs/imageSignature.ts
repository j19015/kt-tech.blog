/**
 * 本文画像の URL（/api/notion-image/{blockId}）に付ける署名（#570）。
 *
 * `/api/notion-image` は UUID の形なら何でも受け付け、そのたびに Notion の
 * `GET /blocks/{id}` を呼んでいた。でたらめな UUID を投げ続けるだけで、記事の描画と
 * 共有している Notion API の枠（平均3リクエスト/秒）を外から使い切れた。
 *
 * 本文を組み立てるときに blockId の HMAC を `?s=` として埋め、API 側では署名が
 * 合わないものを Notion に問い合わせずに 404 にする。本文に載せたブロックの URL しか
 * 通らないので、記事に無いブロックで Notion を叩かれることもない。
 *
 * 鍵は NOTION_API_KEY から導出する（新しいシークレットを増やさない）。トークンを
 * 入れ替えると署名も変わるが、Pages のシークレットの変更は再デプロイで反映され、
 * デプロイは CDN を全パージするので、古い署名の本文は残らない。
 */
const encoder = new TextEncoder();

let cached: { secret: string; key: Promise<CryptoKey> } | null = null;

function signingKey(): Promise<CryptoKey> | null {
  const secret = process.env.NOTION_API_KEY;
  if (!secret) return null;
  if (cached?.secret !== secret) {
    cached = {
      secret,
      key: crypto.subtle.importKey(
        'raw',
        encoder.encode(`kt-tech.blog/notion-image:${secret}`),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      ),
    };
  }
  return cached.key;
}

const normalize = (id: string) => id.replace(/-/g, '').toLowerCase();

/** 署名の長さ（16進）。128bit あれば総当たりは現実的でない */
const SIGNATURE_HEX_LENGTH = 32;

export async function signImageBlockId(blockId: string): Promise<string> {
  const key = signingKey();
  if (!key) return '';
  const mac = await crypto.subtle.sign('HMAC', await key, encoder.encode(normalize(blockId)));
  return Array.from(new Uint8Array(mac), (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, SIGNATURE_HEX_LENGTH);
}

export async function verifyImageBlockId(blockId: string, signature: string | null): Promise<boolean> {
  if (!signature || signature.length !== SIGNATURE_HEX_LENGTH) return false;
  const expected = await signImageBlockId(blockId);
  if (expected.length !== SIGNATURE_HEX_LENGTH) return false;
  // 比較にかかる時間から署名を1文字ずつ当てられないよう、途中で抜けない
  let diff = 0;
  for (let i = 0; i < SIGNATURE_HEX_LENGTH; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
