import { MetadataRoute } from 'next';
import { getWritingSlugs } from '@/lib/mdx';
import { projects } from '@/content/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://saad.dev';

  const staticPages = [
    '',
    '/projects',
    '/writing',
    '/shelf',
    '/about',
    '/contact',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const writingPages = getWritingSlugs().map((slug) => ({
    url: `${baseUrl}/writing/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...projectPages, ...writingPages];
}
