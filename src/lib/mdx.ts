import fs from 'fs';
import path from 'path';
import { WritingFrontmatter } from '@/types/content';
import { writing } from '@/content/data/writing';
import { slugify, stripMarkdown } from '@/lib/utils';

const WRITING_DIR = path.join(process.cwd(), 'src/content/writing');
const writingIndex = new Map(writing.map((post) => [post.slug, post]));

export function getWritingSlugs(): string[] {
  return writing.map((post) => post.slug);
}

export function getAllWriting(): WritingFrontmatter[] {
  return writing
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getWritingFrontmatter(slug: string): WritingFrontmatter | null {
  return writingIndex.get(slug) ?? null;
}

export function getWritingBySlug(slug: string): {
  frontmatter: WritingFrontmatter;
  content: string;
} | null {
  const frontmatter = getWritingFrontmatter(slug);
  if (!frontmatter) return null;

  const filePath = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');

  return { frontmatter, content };
}

export function getWritingByCategory(category: string): WritingFrontmatter[] {
  return getAllWriting().filter((post) => post.category === category);
}

export type Heading = { level: 2 | 3; text: string; id: string };

export function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n');
  const headings: Heading[] = [];
  for (const line of lines) {
    const m2 = line.match(/^## (.+)/);
    const m3 = line.match(/^### (.+)/);
    const match = m2 ?? m3;
    if (!match) continue;
    const level = m2 ? 2 : 3;
    const raw = match[1].trim();
    const text = stripMarkdown(raw);
    const id = slugify(raw);
    headings.push({ level: level as 2 | 3, text, id });
  }
  return headings;
}
