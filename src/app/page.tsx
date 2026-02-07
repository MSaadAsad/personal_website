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
      <section className="flex items-center pt-6 pb-0">
        <Container>
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <div>
              <p className="font-mono text-[0.65rem] text-concrete-300 tracking-[0.25em] mb-1">
                CONCRETE IDEAS / SOFT LANDINGS
              </p>
              <h1 className="text-display font-mono font-bold text-concrete-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] scale-100 md:scale-[0.85] lg:scale-[0.7] origin-left">
                Concrete ideas.
                <br />
                Soft landings.
              </h1>
              <p className="mt-0 font-serif text-xl md:text-2xl text-concrete-400 leading-relaxed max-w-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)] scale-100 md:scale-[0.9] lg:scale-[0.8] origin-left">
                Designing sustainable solutions for a modern world. I build software,
                study history, and occasionally attempt fiction. This is where those
                things live.
              </p>
            </div>

          </div>

        </Container>
      </section>

      <section className="py-0 mt-12 md:mt-14">
        <Container>
          <div className="concrete-block concrete-edge border-b-2 border-concrete-900/70 shadow-[inset_0_-18px_0_rgba(46,46,44,0.45)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(46,46,44,0.18)_100%)]">
            <div className="flex justify-center">
              <Link
                href="/resume"
                className="w-full px-6 py-5 text-center font-mono text-[0.75rem] text-[#0000EE] tracking-[0.25em] uppercase bg-[var(--color-concrete-block)] hover:border-concrete-900/70 hover:shadow-[inset_0_-2px_0_rgba(46,46,44,0.25)] transition-colors duration-150"
              >
                See Resume
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
                    SELECTED WORK
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
                    LATEST WRITING
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
