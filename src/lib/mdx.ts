import fs from 'fs';
import path from 'path';
import { WritingFrontmatter } from '@/types/content';
import { writing } from '@/content/data/writing';

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
