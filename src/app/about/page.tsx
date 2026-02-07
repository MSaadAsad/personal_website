import { Container } from '@/components/layout/Container';

export const metadata = {
  title: 'About',
  description: 'Who I am and what I care about.',
};

export default function AboutPage() {
  return (
    <Container className="py-24">
      <div className="concrete-block concrete-edge concrete-header">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            ABOUT
          </h1>
          <div className="section-divider" />
        </div>
      </div>

      <div className="concrete-block concrete-edge p-8 md:p-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
          <div className="space-y-7">
            <p className="font-serif text-xl text-concrete-700 leading-relaxed">
              I&apos;m Saad — an engineer who builds software, studies how things work,
              and writes about both. I&apos;m drawn to systems: distributed ones, historical
              ones, human ones.
            </p>
            <p className="font-serif text-lg text-concrete-700 leading-relaxed">
              By day, I write code. By night, I read about the fall of empires
              and the rise of concrete. Sometimes I write fiction, which is just
              debugging reality with a different compiler.
            </p>
            <p className="font-serif text-lg text-concrete-700 leading-relaxed">
              I care about building things that last. Not in the Silicon Valley
              &ldquo;scale to a billion users&rdquo; sense, but in the structural engineering
              sense — things that bear weight, weather storms, and age honestly.
            </p>
            <p className="font-serif text-lg text-concrete-700 leading-relaxed">
              This website is my attempt at that. A place made of steel, glass,
              and concrete. Raw materials. Honest structure. And growing through
              the cracks, something green.
            </p>

            <div className="mt-14 pt-14 border-t border-concrete-400/60">
              <h2 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em] mb-8">
                CURRENTLY
              </h2>
              <ul className="space-y-4">
                {[
                  'Building distributed systems and thinking about consensus',
                  'Reading about Ottoman architectural history',
                  'Writing a short story collection about cities and distance',
                  'Learning Rust, slowly and deliberately',
                ].map((item) => (
                  <li key={item} className="font-mono text-[0.75rem] text-concrete-700 flex items-start gap-4">
                    <span className="text-[#0000EE] mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-10">
            <div className="aspect-[3/4] concrete-block concrete-edge overflow-hidden">
              <img
                src="/assets/about-photo.jpg"
                alt="Saad Asad portrait"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.2em] mb-4">
                INTERESTS
              </h3>
              <div className="space-y-2">
                {[
                  'Distributed Systems',
                  'Compilers & Languages',
                  'Architectural History',
                  'Brutalism',
                  'Film Photography',
                  'Long-form Writing',
                ].map((interest) => (
                  <div key={interest} className="font-mono text-[0.75rem] text-concrete-700">
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}
