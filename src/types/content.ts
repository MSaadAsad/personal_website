export interface WritingFrontmatter {
  title: string;
  slug: string;
  date: string;
  category: 'technical' | 'historical' | 'creative';
  tags: string[];
  excerpt: string;
  coverImage?: string;
  featured?: boolean;
  published?: boolean;
  readingTime?: number;
}

export interface Project {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  techStack: string[];
  url?: string;
  repoUrl?: string;
  image?: string;
}

export interface TimelineMoment {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'career' | 'personal' | 'education' | 'creation';
  image?: string;
  link?: string;
  weight: 'major' | 'minor';
}

export interface ShelfItem {
  id: string;
  title: string;
  creator: string;
  type: 'book' | 'movie' | 'album';
  year: number;
  consumedOn?: string;
  coverImage?: string;
  url?: string;
  reviewSlug?: string;
  tags: string[];
}
