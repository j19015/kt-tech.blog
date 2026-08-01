import { cache } from 'react';
import { embedToHtml } from '../src/lib/embed';

// Notion REST API を直接fetch（Edge Runtime互換、@notionhq/client不使用）
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Notion API fetch（Edge Runtimeではリクエスト毎に新インスタンスのためグローバルレート制限不要）
async function notionFetch(path: string, options: { method?: string; body?: any; revalidate?: number } = {}) {
  const res = await fetch(`${NOTION_API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`Notion API error: ${res.status} ${await res.text()}`);
  return res.json();
}

// 既存のmicrocms.tsと同じ型インターフェースを維持
/** 連載。Notion の `Series`（Select）と `SeriesOrder`（Number）から作る */
export type Series = {
  name: string;
  /** 連載内の順序。未設定なら 0（公開日順にフォールバックする） */
  order: number;
};

export type Blog = {
  id: string; // Slug (microCMS IDまたはNotion page ID)
  title: string;
  body: string;
  ogpDescription?: string;
  eyecatch?: { url: string; height?: number; width?: number };
  category?: Category;
  tags?: Tag[];
  series?: Series;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type BlogProps = {
  contents: Blog[];
};

export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

// REST APIでは Database ID を使用（data_source_idではない）
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2eca0ffb73d181ffba0aecf7cad44701';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

// Notionのrich_textからプレーンテキストを取得
function richTextToPlain(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join('') || '';
}


// NotionのページプロパティからBlog型に変換
function nameToSlug(name: string): string {
  return name.toLowerCase().trim();
}

function pageToTag(name: string): Tag {
  const id = nameToSlug(name);
  const now = new Date().toISOString();
  return { id, name, createdAt: now, updatedAt: now, publishedAt: now, revisedAt: now };
}

function pageToCategory(name: string): Category {
  const id = nameToSlug(name);
  const now = new Date().toISOString();
  return { id, name, createdAt: now, updatedAt: now, publishedAt: now, revisedAt: now };
}

// 子ブロックを全件取得する（Notion APIは1回あたり最大100件しか返さない）
async function fetchAllChildren(blockId: string): Promise<any[]> {
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ page_size: '100' });
    if (cursor) params.set('start_cursor', cursor);
    const response: any = await notionFetch(`/blocks/${blockId}/children?${params}`);
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

// リスト系ブロックが連続する場合は空行を挟まない。
// 空行を挟むとmarkdown-itがloose list扱いにして各項目を<p>で包むため、行間が崩れる。
const LIST_BLOCK_TYPES = new Set(['bulleted_list_item', 'numbered_list_item', 'to_do']);

// Markdownのテーブルは | をセル区切りとして解釈するため、セル内の | はエスケープする。
// 改行もテーブルを壊すので <br> に置き換える。
function escapeTableCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

// リスト項目と、その子ブロックを字下げして返す。
// CommonMarkでは子リストを親マーカーの文字数ぶん字下げする必要がある（"- "なら2、"1. "なら3）。
async function listItemToMarkdown(
  block: any,
  indent: string,
  marker: string,
  body: string
): Promise<string> {
  const line = `${indent}${marker}${body}`;
  if (!block.has_children) return line;
  const children = await blocksToMarkdown(block.id, indent + ' '.repeat(marker.length));
  return children ? `${line}\n${children}` : line;
}

// 1ブロックをMarkdownに変換する。出力する必要のないブロックは null を返す。
async function blockToMarkdown(block: any, indent: string): Promise<string | null> {
  switch (block.type) {
    // 見出しの絵文字は残す。書き手が意図して付けた視覚的な手がかりなので、
    // 本文から消してしまう理由がない。目次が煩雑になるのを避けたいだけなら
    // 目次を作る側（extractHeadings）で落とせば足りる。
    //
    // レベルは1段下げる。ページの <h1> は記事タイトルなので、本文の
    // Notion heading_1 をそのまま # にすると h1 が複数になり、
    // 「どれが記事タイトルか」がスクリーンリーダーにも検索エンジンにも
    // 判別できなくなる。見た目は markdown.css 側を1段ずらして合わせてある。
    case 'heading_1':
      return `${indent}## ${richTextToPlain(block.heading_1.rich_text)}`;
    case 'heading_2': {
      const h2Text = richTextToPlain(block.heading_2.rich_text).trim();
      // 「目次」見出しはスキップ（ブログ側で自動生成するため）
      if (h2Text === '目次') return null;
      return `${indent}### ${h2Text}`;
    }
    case 'heading_3':
      return `${indent}#### ${richTextToPlain(block.heading_3.rich_text)}`;
    case 'paragraph': {
      // 目次はブログ側で自動生成するので、目印として書かれた `[toc]` の段落は落とす。
      // 以前はレンダリング後のHTMLに対して4本の正規表現を当てていたため、
      // コードブロック内に書いた `[toc]` まで消えて記法の解説記事が書けなかった。
      // 段落ブロック単位で判定すればコードには一切触れない。
      if (/^"?\[toc\]"?$/i.test(richTextToPlain(block.paragraph.rich_text).trim())) return null;
      return `${indent}${richTextToMarkdown(block.paragraph.rich_text)}`;
    }
    case 'bulleted_list_item':
      return listItemToMarkdown(block, indent, '- ', richTextToMarkdown(block.bulleted_list_item.rich_text));
    case 'numbered_list_item':
      return listItemToMarkdown(block, indent, '1. ', richTextToMarkdown(block.numbered_list_item.rich_text));
    case 'to_do': {
      // チェックボックスは表示専用。<li>のクラス付けはレンダリング側で行う。
      const checked = block.to_do.checked ? ' checked' : '';
      const body = `<input type="checkbox" disabled${checked}> ${richTextToMarkdown(block.to_do.rich_text)}`;
      return listItemToMarkdown(block, indent, '- ', body);
    }
    case 'code': {
      const code = richTextToPlain(block.code.rich_text)
        .split('\n')
        .map((line: string) => `${indent}${line}`)
        .join('\n');
      // Notion の言語名は "plain text" のように空白を含むことがある。
      // 情報文字列の区切りは空白なので、そのまま出すと言語が "plain" として扱われる。
      const raw = (block.code.language || '').trim().toLowerCase().replace(/\s+/g, '-');
      const lang = raw === 'plain-text' ? 'text' : raw;
      // コードブロックのキャプションはファイル名を書く用途で使われる。
      // Zenn と同じ `言語:ファイル名` 形式で情報文字列に載せる
      // （キャプション側に `{1,3-5}` と書けば行ハイライトの指定もそのまま通る）。
      // 情報文字列は1行で完結させる必要があるので、改行とバッククォートは潰す。
      // そのまま流すとフェンスが壊れて、コードが本文として描画されてしまう。
      const caption = block.code.caption
        ? richTextToPlain(block.code.caption).replace(/\s+/g, ' ').replace(/`/g, '').trim()
        : '';
      const info = caption ? `${lang || 'text'}:${caption}` : lang;
      return `${indent}\`\`\`${info}\n${code}\n${indent}\`\`\``;
    }
    case 'image': {
      // Notion がアップロード画像に返す URL は署名付きで、有効期限が1時間しかない。
      // 記事HTMLは CDN に最大24時間残るので、そのまま埋めると画像が404になる。
      // 失効しない自前のURLを挟み、実際の署名付きURLはリクエスト時に取り直す。
      const url = block.image.type === 'external'
        ? block.image.external.url
        : `/api/notion-image/${block.id}`;
      const caption = block.image.caption ? richTextToPlain(block.image.caption) : '';
      return `${indent}![${caption}](${url})`;
    }
    case 'bookmark':
      return block.bookmark.url ? `${indent}${block.bookmark.url}` : null;
    case 'divider':
      return `${indent}---`;
    case 'quote': {
      // 引用は blockquote として出力する。calloutに変換すると補足Tipsと見分けがつかなくなる。
      const text = richTextToMarkdown(block.quote.rich_text);
      const children = block.has_children ? await blocksToMarkdown(block.id) : '';
      let body = children ? `${text}\n\n${children}` : text;

      // 最終行が `— 出典` で始まっていれば <cite> として切り出す。
      // 技術記事の引用は公式ドキュメントや書籍からが大半で、出典が無いと
      // 引用としての価値が落ちる。これまでは書き手が本文に手で書くしかなく、
      // 表記もバラバラだった。`—`（em dash）/`―`/`--` を目印にする。
      const lines = body.split('\n');
      const cite = lines[lines.length - 1]?.match(/^\s*(?:—|―|--)\s*(.+?)\s*$/);
      if (cite && lines.length > 1) {
        lines.pop();
        // 空行を挟んで独立した段落にする。詰めると引用本文と地続きに見える
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
        body = `${lines.join('\n')}\n\n<cite>${cite[1]}</cite>`;
      }

      return body
        .split('\n')
        .map((line) => `${indent}>${line ? ` ${line}` : ''}`)
        .join('\n');
    }
    case 'callout': {
      const icon = block.callout.icon?.emoji || 'ℹ️';
      const color = block.callout.color || 'default';
      const text = richTextToMarkdown(block.callout.rich_text);
      const children = block.has_children ? await blocksToMarkdown(block.id) : '';
      const body = children ? `${text}\n\n${children}` : text;
      // ::: マーカーはレンダリング側が行頭のものだけを拾うため、字下げしない。
      // リスト内のcalloutはリストから抜けた見た目になるが、マーカーが壊れるよりは良い。
      return `:::callout{icon="${icon}" color="${color}"}\n${body}\n:::`;
    }
    case 'toggle': {
      // 折りたたみは <details> にする。子ブロックを取らないと中身が丸ごと消えてしまう。
      const summary = richTextToMarkdown(block.toggle.rich_text);
      const children = block.has_children ? await blocksToMarkdown(block.id, indent) : '';
      if (!children) return `${indent}${summary}`;
      // 前後に空行を挟むことで、<details>内のMarkdownがそのまま解釈される
      return `${indent}<details>\n${indent}<summary>${summary}</summary>\n\n${children}\n\n${indent}</details>`;
    }
    case 'table_of_contents':
      // 目次は自動生成するのでスキップ
      return null;
    case 'table': {
      const rows = (await fetchAllChildren(block.id)).filter((row: any) => row.type === 'table_row');
      if (rows.length === 0) return null;

      const width: number = block.table?.table_width ?? rows[0].table_row.cells.length;
      const hasHeader: boolean = block.table?.has_column_header ?? true;
      const toRow = (cells: any[]) =>
        `${indent}| ${Array.from({ length: width }, (_, i) =>
          escapeTableCell(richTextToMarkdown(cells[i] ?? []))
        ).join(' | ')} |`;
      const separator = `${indent}| ${Array.from({ length: width }, () => '---').join(' | ')} |`;

      const lines: string[] = [];
      if (hasHeader) {
        lines.push(toRow(rows[0].table_row.cells), separator);
        rows.slice(1).forEach((row: any) => lines.push(toRow(row.table_row.cells)));
      } else {
        // Markdownのテーブルはヘッダー行が必須なので、空のヘッダーを置いて全行をデータとして扱う
        lines.push(`${indent}|${' |'.repeat(width)}`, separator);
        rows.forEach((row: any) => lines.push(toRow(row.table_row.cells)));
      }
      return lines.join('\n');
    }
    case 'embed':
    case 'video':
    case 'link_preview': {
      // これまで default に落ちて丸ごと消えていた。YouTube の解説動画も
      // CodeSandbox の動くサンプルも、公開されたページには何も残らなかった。
      const url: string | undefined =
        block[block.type]?.url ?? block[block.type]?.external?.url ?? block[block.type]?.file?.url;
      if (!url) return null;
      const html = embedToHtml(url);
      // 埋め込みに対応していないURLは素のリンクとして出し、
      // レンダリング側のリンクカード化に任せる
      return `${indent}${html ?? url}`;
    }
    default:
      // 未対応ブロックは出力できないため、開発時に気づけるよう警告する
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[notion] 未対応のブロックをスキップしました: type=${block.type} id=${block.id}`);
      }
      return null;
  }
}

// Notionのブロックをマークダウンに変換
// indent はリストのネスト表現に使う
async function blocksToMarkdown(blockId: string, indent = ''): Promise<string> {
  const blocks = await fetchAllChildren(blockId);
  const parts: { type: string; text: string }[] = [];

  for (const block of blocks) {
    const text = await blockToMarkdown(block, indent);
    if (text === null) continue;
    parts.push({ type: block.type, text });
  }

  return parts
    .map((part, i) => {
      if (i === 0) return part.text;
      const tight = LIST_BLOCK_TYPES.has(part.type) && LIST_BLOCK_TYPES.has(parts[i - 1].type);
      return `${tight ? '\n' : '\n\n'}${part.text}`;
    })
    .join('');
}

// rich_textをマークダウン形式に変換 (インライン装飾対応)
// bold/italic/codeが混在する場合はHTMLタグで出力して確実に変換
function richTextToMarkdown(richText: any[]): string {
  if (!richText) return '';
  return richText.map((t: any) => {
    let text = t.plain_text;
    const annotations = t.annotations || {};
    if (annotations.code) text = `\`${text}\``;
    if (annotations.bold) text = `<strong>${text}</strong>`;
    if (annotations.italic) text = `<em>${text}</em>`;
    if (annotations.strikethrough) text = `<del>${text}</del>`;
    if (annotations.underline) text = `<u>${text}</u>`;
    // 背景色ハイライトのみ <mark> として残す。
    // 文字色はサイトの配色を壊すため反映しない。
    if (typeof annotations.color === 'string' && annotations.color.endsWith('_background')) {
      text = `<mark class="mark-${annotations.color.replace('_background', '')}">${text}</mark>`;
    }
    if (t.href) text = `[${text}](${t.href})`;
    return text;
  }).join('');
}

// NotionのページからBlog型に変換
async function pageToBlog(page: any, fetchBody: boolean = false): Promise<Blog> {
  const props = page.properties;

  const title = richTextToPlain(props.Title?.title || []);
  const slug = richTextToPlain(props.Slug?.rich_text || []);
  const categoryName = props.Category?.select?.name || '';
  const tags = (props.Tags?.multi_select || []).map((t: any) => pageToTag(t.name));
  const eyecatchUrl = props.Eyecatch?.url || page.cover?.external?.url || page.cover?.file?.url || '';
  const ogpDescription = richTextToPlain(props['OGP Description']?.rich_text || []) || '';
  const createdDate = props.Created?.date?.start || page.created_time;
  const id = slug || page.id.replace(/-/g, '');

  // 連載。プロパティが未作成のデータベースでも落ちないよう、全て省略可能に扱う。
  const seriesName = (props.Series?.select?.name || '').trim();
  const seriesOrder = typeof props.SeriesOrder?.number === 'number' ? props.SeriesOrder.number : 0;

  let body = '';
  if (fetchBody) {
    body = await blocksToMarkdown(page.id);
  }

  const createdAt = new Date(createdDate).toISOString();

  return {
    id,
    title,
    body,
    ogpDescription: ogpDescription || undefined,
    eyecatch: eyecatchUrl ? { url: eyecatchUrl, width: 1200, height: 630 } : undefined,
    category: categoryName ? pageToCategory(categoryName) : undefined,
    tags,
    series: seriesName ? { name: seriesName, order: seriesOrder } : undefined,
    createdAt,
    updatedAt: page.last_edited_time,
    publishedAt: createdAt,
    revisedAt: page.last_edited_time,
  };
}

// ブログ一覧を取得
// cache() で同一リクエスト内のみメモ化する。
// 以前はモジュールスコープの変数に貯めていたが、Cloudflare Workers の isolate は
// 複数リクエストで再利用されるため、生きている isolate では古い一覧が返り続けていた。
export const getList = cache(async () => {
  const allPages: any[] = [];
  let cursor: string | undefined;

  do {
    const body: any = {
      page_size: 100,
      filter: { property: 'Status', select: { equals: 'Published' } },
      sorts: [{ property: 'Created', direction: 'descending' }],
    };
    if (cursor) body.start_cursor = cursor;
    const response: any = await notionFetch(`/databases/${DATABASE_ID}/query`, { method: 'POST', body });
    allPages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  const contents = await Promise.all(allPages.map((page) => pageToBlog(page, false)));

  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
});

// ブログの詳細を取得 (slugで検索)
// generateMetadata と本体の両方から呼ばれるため、メモ化しないとNotion APIを2往復する
export const getDetail = cache(async (slug: string) => {
  // まずSlugプロパティで検索
  const response = await notionFetch(`/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    body: { filter: { property: 'Slug', rich_text: { equals: slug } } },
  });

  if (response.results.length === 0) {
    // Slugが見つからない場合はNotionのpage IDで検索
    try {
      const page = await notionFetch(`/pages/${slug}`);
      return pageToBlog(page, true);
    } catch {
      throw new Error(`Blog not found: ${slug}`);
    }
  }

  return pageToBlog(response.results[0], true);
});

// データベースのスキーマ（タグ・カテゴリの選択肢）を取得
// getTagList / getCategoryList / それぞれのDetail から呼ばれるので、
// メモ化しないと1ページの描画で同じスキーマを4回取りに行くことになる
const getDatabaseSchema = cache(async () => notionFetch(`/databases/${DATABASE_ID}`));

// タグ一覧を取得
export const getTagList = cache(async () => {
  const db = await getDatabaseSchema();
  const options = (db.properties as any).Tags?.multi_select?.options || [];

  const contents: Tag[] = options.map((opt: any) => pageToTag(opt.name));
  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
});

// タグの詳細を取得
export const getTagDetail = async (tagId: string) => {
  const { contents } = await getTagList();
  const decoded = decodeURIComponent(tagId);
  const tag = contents.find((t) => t.id === decoded || t.id === tagId);
  if (!tag) throw new Error(`Tag not found: ${tagId}`);
  return tag;
};

// カテゴリ一覧を取得
export const getCategoryList = cache(async () => {
  const db = await getDatabaseSchema();
  const options = (db.properties as any).Category?.select?.options || [];

  const contents: Category[] = options.map((opt: any) => pageToCategory(opt.name));
  return { contents, totalCount: contents.length, offset: 0, limit: contents.length };
});

// カテゴリの詳細を取得
export const getCategoryDetail = async (categoryId: string) => {
  const { contents } = await getCategoryList();
  const decoded = decodeURIComponent(categoryId);
  const category = contents.find((c) => c.id === decoded || c.id === categoryId);
  if (!category) throw new Error(`Category not found: ${categoryId}`);
  return category;
};
