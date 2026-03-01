import { Heading } from '@/lib/mdx';

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="mb-10 border-l-2 border-concrete-700/60 pl-5">
      <p className="font-mono text-[0.6rem] text-concrete-600 tracking-[0.25em] mb-3">
        CONTENTS
      </p>
      <ol className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${h.id}`}
              className="font-mono text-[0.7rem] text-[#0000EE] hover:underline underline-offset-4 transition-colors duration-150 tracking-wide"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
