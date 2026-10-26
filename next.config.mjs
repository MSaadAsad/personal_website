import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkNumberHeadings from './src/lib/heading-numbering.mjs';
import rehypeKatex from 'rehype-katex';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath, remarkNumberHeadings],
    rehypePlugins: [rehypeKatex],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        source: '/projects/making-two-berts-smaller',
        destination: '/projects/two-berts-one-stone',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // The Jhelum Marches: a static game in public/marches, not linked from the site yet.
      { source: '/marches', destination: '/marches/index.html' },
    ];
  },
  async headers() {
    return [
      {
        source: '/projects/lahore-neighbourhoods/map/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
