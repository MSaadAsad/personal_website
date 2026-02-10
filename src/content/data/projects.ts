import { Project } from '@/types/content';

export const projects: Project[] = [
  {
    slug: 'efficient-transformers-gqa-mod',
    title: 'Efficient Transformers',
    date: '2024-04-26',
    description:
      'Combining Grouped-Query Attention with Mixture of Depths',
    image: '/assets/projects/efficient-transformers-gqa-mod/cover.png',
    tags: ['machine-learning', 'transformers', 'attention', 'research'],
    techStack: ['Python', 'PyTorch'],
    repoUrl: 'https://github.com/MSaadAsad/transformers',
  },
  {
    slug: 'x-raying-multi-head-attention',
    title: 'X-Raying Multi-head Attention',
    date: '2024-05-05',
    description: 'Understanding the Need for Diversity in Heads.',
    image: '/assets/projects/x-raying-multi-head-attention/cover.gif',
    tags: ['machine-learning', 'transformers', 'attention', 'research'],
    techStack: ['Python', 'PyTorch'],
    repoUrl: 'https://github.com/MSaadAsad/transformers',
  },
  {
    slug: 'geometric-median-annealing',
    title: "The Geometric Median on Earth's Surface",
    date: '2023-07-18',
    description: 'Efficient hill descent with annealing for global medians.',
    image: '/assets/projects/geometric-median-annealing/fig-9.gif',
    tags: ['optimization', 'geospatial', 'algorithms'],
    techStack: ['Python'],
    repoUrl: 'https://github.com/MSaadAsad/Annealing-Geom-Median',
  },
  {
    slug: 'readmeplease-ai',
    title: 'READMEplease.ai',
    date: '2024-08-20',
    description:
      'A Flask app that generates Markdown docs from videos or GitHub repos.',
    image: '/assets/projects/readmeplease-ai/cover.png',
    tags: ['web-app', 'documentation', 'ai', 'markdown'],
    techStack: ['Python', 'Flask', 'OpenAI API'],
    repoUrl: 'https://github.com/shivamrawat1/READMEplease.ai',
  },
  {
    slug: 'washbot',
    title: 'Washbot',
    date: '2025-01-15',
    description:
      'A Telegram bot for Minerva students that tracks laundry availability.',
    image: '/assets/projects/washbot/cover.png',
    tags: ['automation', 'telegram', 'community', 'ops'],
    techStack: ['Telegram Bot API', 'Airtable', 'Python'],
    repoUrl: 'https://github.com/MSaadAsad/WashBot',
  },
  {
    slug: 'peano-axioms-calculator',
    title: 'Peano’s Axioms',
    date: '2025-09-01',
    description:
      'and My Most Overengineered Calculator App',
    image: '/assets/projects/peano-axioms-calculator/trace.webp',
    tags: ['math', 'logic', 'programming-languages', 'education'],
    techStack: ['Prolog'],
    repoUrl: 'https://github.com/MSaadAsad/peano-axiom',
  },
] satisfies Project[];
