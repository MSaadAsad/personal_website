import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { projects } from '@/content/data/projects';
import { getAllWriting } from '@/lib/mdx';

export default function Home() {
  const featuredProjects = [...projects]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 3);
  const recentWriting = getAllWriting().slice(0, 3);

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage: "url('/assets/homepage-background.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundColor: 'rgba(226, 225, 221, 0.9)',
          backgroundBlendMode: 'multiply',
        }}
      />
      <div>
      {/* Hero */}
      <section className="flex items-center pt-16 pb-0">
        <Container>
          <div className="flex flex-col items-center text-center">
            <img
              src="/assets/c.png"
              alt="Pixel hero artwork"
              className="w-full max-w-sm drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
            />
            <p className="mt-7 mb-2 font-mono text-[0.9rem] text-concrete-200 tracking-[0.3em]">
              M. SAAD ASAD
            </p>
          </div>
        </Container>
      </section>

      <section className="py-0 mt-10 md:mt-12">
        <Container>
          <div className="concrete-block concrete-edge border-b-2 border-concrete-900/70 shadow-[inset_0_-18px_0_rgba(46,46,44,0.45)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(46,46,44,0.18)_100%)]">
            <div className="flex flex-col md:flex-row">
              <Link
                href="/about"
                className="w-full px-6 py-5 text-center font-mono text-[0.75rem] text-[#0000EE] tracking-[0.25em] uppercase bg-[var(--color-concrete-block)] hover:border-concrete-900/70 hover:shadow-[inset_0_-2px_0_rgba(46,46,44,0.25)] transition-colors duration-150 md:border-r md:border-concrete-700/60"
              >
                About
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-0">
          <Container>
            <div className="concrete-block concrete-edge">
              <div className="px-6 py-5 border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-mono text-[0.6rem] text-concrete-700 tracking-[0.3em] uppercase">
                    SELECTED PROJECTS
                  </h2>
                  <Link
                    href="/projects"
                    className="font-mono text-[0.6rem] text-[#0000EE] tracking-[0.25em] uppercase"
                  >
                    VIEW ALL &rarr;
                  </Link>
                </div>
              </div>
              <div className="grid gap-0 grid-cols-1">
                {featuredProjects.map((project) => (
                  <BrutalistCard
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <h3 className="font-mono text-base font-semibold text-[#0000EE]">
                            {project.title}
                          </h3>
                          <span className="font-mono text-[0.65rem] text-concrete-600 tracking-wider shrink-0">
                            {project.date}
                          </span>
                        </div>
                        <p className="font-serif text-sm text-concrete-700 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </BrutalistCard>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Recent Writing */}
      {recentWriting.length > 0 && (
        <section className="py-0">
          <Container>
            <div className="concrete-block concrete-edge">
              <div className="px-6 py-5 border-b border-concrete-700/60 concrete-edge bg-[var(--color-concrete-block)]">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-mono text-[0.6rem] text-concrete-700 tracking-[0.3em] uppercase">
                    LATEST BLOG
                  </h2>
                  <Link
                    href="/writing"
                    className="font-mono text-[0.6rem] text-[#0000EE] tracking-[0.25em] uppercase"
                  >
                    VIEW ALL &rarr;
                  </Link>
                </div>
              </div>
              <div className="space-y-0">
                {recentWriting.map((post) => (
                  <BrutalistCard
                    key={post.slug}
                    href={`/writing/${post.slug}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono text-base font-semibold text-[#0000EE]">
                          {post.title}
                        </h3>
                        <p className="font-serif text-sm text-concrete-700 mt-1.5 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <span className="font-mono text-[0.65rem] text-concrete-600 tracking-wider shrink-0">
                        {post.date}
                      </span>
                    </div>
                  </BrutalistCard>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      </div>
    </div>
  );
}
