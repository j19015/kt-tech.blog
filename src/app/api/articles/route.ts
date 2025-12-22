import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOGS_DIR = path.join(CONTENT_DIR, 'blogs');

// 開発環境のみで動作
const isDev = process.env.NODE_ENV === 'development';

// ランダムIDを生成
function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// 記事一覧を取得
export async function GET() {
  if (!isDev) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const files = fs.readdirSync(BLOGS_DIR).filter(file => file.endsWith('.md'));
    const articles = files.map(file => {
      const id = file.replace('.md', '');
      return { id, filename: file };
    });
    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read articles' }, { status: 500 });
  }
}

// 新規記事を作成
export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, body: content, category, tags, eyecatch } = body;

    const id = generateId();
    const now = new Date().toISOString();

    // frontmatterを生成
    const frontmatter = [
      '---',
      `id: "${id}"`,
      `title: "${title.replace(/"/g, '\\"')}"`,
      category ? `category: "${category}"` : null,
      tags && tags.length > 0 ? `tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]` : null,
      eyecatch ? `eyecatch: "${eyecatch}"` : null,
      `createdAt: "${now}"`,
      `updatedAt: "${now}"`,
      `publishedAt: "${now}"`,
      '---',
      '',
    ].filter(Boolean).join('\n');

    const fileContent = frontmatter + content;
    const filePath = path.join(BLOGS_DIR, `${id}.md`);

    fs.writeFileSync(filePath, fileContent, 'utf-8');

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

// 記事を更新
export async function PUT(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, title, body: content, category, tags, eyecatch, createdAt, publishedAt } = body;

    const now = new Date().toISOString();

    // frontmatterを生成
    const frontmatter = [
      '---',
      `id: "${id}"`,
      `title: "${title.replace(/"/g, '\\"')}"`,
      category ? `category: "${category}"` : null,
      tags && tags.length > 0 ? `tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]` : null,
      eyecatch ? `eyecatch: "${eyecatch}"` : null,
      `createdAt: "${createdAt || now}"`,
      `updatedAt: "${now}"`,
      `publishedAt: "${publishedAt || now}"`,
      '---',
      '',
    ].filter(Boolean).join('\n');

    const fileContent = frontmatter + content;
    const filePath = path.join(BLOGS_DIR, `${id}.md`);

    fs.writeFileSync(filePath, fileContent, 'utf-8');

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// 記事を削除
export async function DELETE(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const filePath = path.join(BLOGS_DIR, `${id}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
