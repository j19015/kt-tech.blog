#!/usr/bin/env node
/**
 * 記事の本文から計算できる値を、Notion のプロパティに書き戻す（#498 / #458）。
 *
 *   ReadingTime    (Number) 読了の目安（分）。一覧のカードは本文を取らないので、ここから読む
 *   BodyHash       (Text)   本文のハッシュ。前回と違えば「本文が変わった」とみなす
 *   ContentUpdated (Date)   本文が最後に変わった日時。サイトの「最終更新」はこれを優先する
 *   ContentChecked (Date)   このスクリプトが最後に確認した日時
 *
 * なぜ Notion に書くのか: 正のデータは Notion にあり、一覧はすでに Notion のプロパティを
 * 読んでいる。別のデータストアを足さずに、一覧で本文を取りに行く往復だけを無くせる。
 *
 * なぜ ContentUpdated が要るのか: サイトの更新日は Notion の last_edited_time だったので、
 * タグを足しただけでも「更新」になっていた。しかもこのスクリプトがプロパティを書くと
 * last_edited_time 自体が動く。本文が変わったときだけ ContentUpdated を進める。
 *
 * 本文を読むのは last_edited_time が ContentChecked より新しい記事だけ。自分の書き込みで
 * 動いた last_edited_time（分単位に丸められる）は ContentChecked 以下になるので読み直さない。
 * 同じ分のうちに人が編集した分は取りこぼすが、次に編集したときに拾われる。
 *
 * 使い方:
 *   op run --env-file=.env.op -- node scripts/sync-article-meta.mjs --dry-run
 *   CI では deploy.yml がデプロイの前に実行する（失敗してもデプロイは止めない）
 */
import { createHash } from 'node:crypto';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2eca0ffb73d181ffba0aecf7cad44701';
const NOTION_VERSION = '2022-06-28';
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--all');

/** 記事詳細（src/app/blogs/[blogId]/page.tsx）と同じ基準。600字で1分 */
const CHARS_PER_MINUTE = 600;

if (!NOTION_API_KEY) {
  console.error('NOTION_API_KEY is required');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Notion は平均3リクエスト/秒。直列で 350ms 空ければ超えない
let lastCall = 0;
async function notion(path, { method = 'GET', body } = {}) {
  for (let attempt = 0; ; attempt++) {
    const wait = lastCall + 350 - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    const res = await fetch(`https://api.notion.com/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      const retryAfter = Number(res.headers.get('Retry-After')) || 0;
      await sleep(retryAfter ? retryAfter * 1000 : 500 * 2 ** attempt);
      continue;
    }
    throw new Error(`Notion API ${method} ${path}: ${res.status} ${await res.text()}`);
  }
}

async function publishedPages() {
  const pages = [];
  let cursor;
  do {
    const body = { page_size: 100, filter: { property: 'Status', select: { equals: 'Published' } } };
    if (cursor) body.start_cursor = cursor;
    const res = await notion(`/databases/${DATABASE_ID}/query`, { method: 'POST', body });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function children(blockId) {
  const blocks = [];
  let cursor;
  do {
    const q = cursor ? `?page_size=100&start_cursor=${cursor}` : '?page_size=100';
    const res = await notion(`/blocks/${blockId}/children${q}`);
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

const plain = (rich = []) => rich.map((t) => t.plain_text ?? '').join('');

/**
 * 本文を「読む文字」と「ハッシュ用の指紋」に分けて集める。
 * 画像などのファイルURLは取得のたびに署名が変わるので指紋に入れない（ブロックIDで代用する）
 */
async function collect(blockId, out) {
  for (const block of await children(blockId)) {
    const { type } = block;
    if (type === 'child_page' || type === 'child_database') continue;
    const data = block[type] ?? {};
    let text = '';
    if (type === 'table_row') text = (data.cells ?? []).map(plain).join(' ');
    else if (type === 'equation') text = data.expression ?? '';
    else if (data.rich_text) text = plain(data.rich_text);
    const caption = data.caption ? plain(data.caption) : '';

    out.text.push(text, caption);
    let mark = '';
    if (['image', 'video', 'file', 'pdf', 'audio'].includes(type)) {
      mark = data.type === 'external' ? data.external?.url ?? '' : block.id;
    } else if (['bookmark', 'embed', 'link_preview'].includes(type)) {
      mark = data.url ?? '';
    } else if (type === 'code') {
      mark = data.language ?? '';
    }
    out.fingerprint.push(`${type}|${mark}|${text}|${caption}`);

    if (block.has_children) {
      out.fingerprint.push('{');
      await collect(block.id, out);
      out.fingerprint.push('}');
    }
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  const pages = await publishedPages();
  let checked = 0;
  let changed = 0;
  let initialized = 0;

  for (const page of pages) {
    const props = page.properties;
    const title = plain(props.Title?.title);
    const lastChecked = props.ContentChecked?.date?.start;
    if (!FORCE && lastChecked && new Date(page.last_edited_time) <= new Date(lastChecked)) continue;

    checked++;
    const out = { text: [], fingerprint: [] };
    await collect(page.id, out);
    const length = out.text.join('').replace(/\s+/g, '').length;
    const minutes = Math.max(1, Math.ceil(length / CHARS_PER_MINUTE));
    const hash = createHash('sha256').update(out.fingerprint.join('\n')).digest('hex').slice(0, 32);

    const prevHash = plain(props.BodyHash?.rich_text);
    const bodyChanged = prevHash !== hash;
    // 初回（ハッシュ未記録）は今の更新日を引き継ぐ。書いた瞬間を「更新」にしない
    const contentUpdated = !prevHash
      ? props.ContentUpdated?.date?.start ?? page.last_edited_time
      : bodyChanged
        ? startedAt
        : props.ContentUpdated?.date?.start ?? page.last_edited_time;

    const update = {
      ReadingTime: { number: minutes },
      BodyHash: { rich_text: [{ type: 'text', text: { content: hash } }] },
      ContentUpdated: { date: { start: contentUpdated } },
      // 書き込む直前の時刻にする。開始時刻だと、1分以上たってから書いた記事は書き込みで動いた
      // last_edited_time のほうが新しくなり、次の回に「編集された」と読み直してしまう
      ContentChecked: { date: { start: new Date().toISOString() } },
    };
    const label = !prevHash ? 'init' : bodyChanged ? 'BODY CHANGED' : 'same';
    if (!prevHash) initialized++;
    else if (bodyChanged) changed++;
    console.log(`${label.padEnd(12)} ${String(minutes).padStart(3)}分 ${title}`);

    if (!DRY_RUN) await notion(`/pages/${page.id}`, { method: 'PATCH', body: { properties: update } });
  }

  console.log(`\n${pages.length}本中 ${checked}本を確認、初回の記録 ${initialized}本、本文の変更 ${changed}本${DRY_RUN ? '（dry-run: 書き込みなし）' : ''}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
