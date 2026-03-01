import type { MDXComponents } from 'mdx/types';
import React from 'react';
import { slugify } from '@/lib/utils';

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (React.isValidElement(children)) {
    return extractText((children.props as { children?: React.ReactNode }).children);
  }
  return '';
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-mono text-3xl font-bold tracking-tight text-concrete-900 mb-8 mt-14">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h2 id={id} className="scroll-mt-20 font-mono text-xl font-bold tracking-tight text-[#0000EE] mb-6 mt-12 border-l-[6px] border-[#0000EE] pl-5">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h3 id={id} className="scroll-mt-20 font-mono text-lg font-semibold text-concrete-800 mb-4 mt-10">
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="font-serif text-[20px] leading-[1.8] text-concrete-700 mb-6">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[#0000EE] underline underline-offset-4 decoration-[#0000EE]/60 hover:decoration-[#0000EE] transition-colors duration-150"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[6px] border-steel-500/50 pl-6 my-8 text-concrete-700 font-serif italic">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="font-mono text-sm bg-concrete-100/80 text-steel-600 px-1.5 py-0.5 border border-concrete-400/70">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="font-mono text-sm glass-panel p-6 my-10 overflow-x-auto !transform-none">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="font-serif text-[20px] text-concrete-700 mb-6 ml-6 list-disc list-outside space-y-2.5 leading-[1.7]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="font-serif text-[20px] text-concrete-700 mb-6 ml-6 list-decimal list-outside space-y-2.5 leading-[1.7]">
        {children}
      </ol>
    ),
    hr: () => (
      <hr className="border-concrete-400/70 my-14" />
    ),
    ...components,
  };
}
