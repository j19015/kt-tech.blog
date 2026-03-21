#!/usr/bin/env node
/**
 * Content linter - checks Notion articles for quality issues
 * Usage: node scripts/lint-content.mjs
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2eca0ffb73d181ffba0aecf7cad44701';

if (!NOTION_API_KEY) {
  console.error('NOTION_API_KEY is required');
  process.exit(1);
}

async function fetchArticles() {
  const allPages = [];
  let cursor;
  do {
    const body = {
      page_size: 100,
      filter: { property: 'Status', select: { equals: 'Published' } },
      sorts: [{ property: 'Created', direction: 'descending' }],
    };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    allPages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return allPages;
}

async function main() {
  console.log('Checking published articles...\n');
  const articles = await fetchArticles();
  const issues = [];

  for (const page of articles) {
    const props = page.properties;
    const title = props.Title?.title?.[0]?.plain_text || '(no title)';
    const id = page.id;
    const articleIssues = [];

    // Check eyecatch
    if (!props.Eyecatch?.url) {
      articleIssues.push('Eyecatch missing');
    }

    // Check OGP description
    const ogp = props['OGP Description']?.rich_text?.[0]?.plain_text;
    if (!ogp) {
      articleIssues.push('OGP Description missing');
    } else if (ogp.length > 160) {
      articleIssues.push(`OGP Description too long (${ogp.length} chars, max 160)`);
    }

    // Check tags
    const tags = props.Tags?.multi_select || [];
    if (tags.length === 0) {
      articleIssues.push('No tags');
    }

    // Check category
    if (!props.Category?.select?.name) {
      articleIssues.push('No category');
    }

    // Check slug
    const slug = props.Slug?.rich_text?.[0]?.plain_text;
    if (!slug) {
      articleIssues.push('No slug (using page ID as URL)');
    }

    if (articleIssues.length > 0) {
      issues.push({ title, id, issues: articleIssues });
    }
  }

  if (issues.length === 0) {
    console.log(`All ${articles.length} articles passed content checks.`);
  } else {
    console.log(`Found issues in ${issues.length}/${articles.length} articles:\n`);
    for (const { title, issues: articleIssues } of issues) {
      console.log(`  ${title}`);
      for (const issue of articleIssues) {
        console.log(`    - ${issue}`);
      }
      console.log('');
    }
    process.exit(1);
  }
}

main().catch(console.error);
