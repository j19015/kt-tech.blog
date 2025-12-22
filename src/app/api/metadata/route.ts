import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function GET() {
  try {
    const tagsPath = path.join(CONTENT_DIR, 'tags.json');
    const categoriesPath = path.join(CONTENT_DIR, 'categories.json');

    const tags = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

    return NextResponse.json({ tags, categories });
  } catch (error) {
    console.error('Error reading metadata:', error);
    return NextResponse.json({ tags: [], categories: [] });
  }
}
