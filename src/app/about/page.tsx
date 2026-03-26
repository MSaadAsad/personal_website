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
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              I&apos;m Saad. I&apos;m from a small city in Pakistani Kashmir called{' '}
              <a
                href="https://en.wikipedia.org/wiki/Mirpur,_Azad_Kashmir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                Mirpur
              </a>
              , located next to a large dam called {' '}
              <a
                href="https://en.wikipedia.org/wiki/Mangla_Dam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                Mangla
              </a>
              . I suspect this is somehow relevant to everything.
            </p>
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              My origin story is that I used to play too much of my uncle&apos;s
              bootlegged{' '}
              <a
                href="https://en.wikipedia.org/wiki/Civilization_III"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                Civ III
              </a>{' '}
              on his computer as a 6-year-old.
            </p>
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              I grew up loving history and spent the COVID pandemic
              collecting the largest dataset of{' '}
              <a
                href="https://x.com/Saad_163_/status/1285436990394191872"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                fortresses in Pakistan
              </a>{' '}
              with over 170 sites recorded. Pakistani embassies and members of
              parliament shared it on Twitter.
              I&apos;m building a dedicated site for it next.
            </p>
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              I achieved Enlightenment when I read{' '}
              <a
                href="https://en.wikipedia.org/wiki/The_Selfish_Gene"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                The Selfish Gene
              </a>{' '}
              in high school. It introduced me to the simplest evolutionary
              simulation, the{' '}
              <a
                href="https://en.wikipedia.org/wiki/Evolutionary_game_theory#Hawk_dove"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                hawk-dove game
              </a>{' '}
              , which I recreated while first teaching myself coding.{' '}
              <em>
                Wait, so it&apos;s that simple? You can just make
                things out of thin air? This coding stuff is neat.
              </em>
            </p>
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              <strong>
                <a
                  href="https://x.com/GrantSlatton/status/1830302697125478630?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
                >
                  I guess I can just do things.
                </a>
              </strong>
            </p>
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              I came to SF at 16 to study Computer Science at{' '}
              <a
                href="https://www.minerva.edu/announcements/minerva-university-named-worlds-most-innovative-university-for-fourth-consecutive-year/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
              >
                Minerva University
              </a>{' '}
              graduating in 2025 after having lived across 6 countries in 4 years.
              Along the way, I worked on ML research and spent my senior year at
              a YC-backed startup as a founding AI engineer.
            </p>
            <p className="font-serif text-base text-concrete-700 leading-relaxed">
              Recently I have been asking myself:{' '}
              <strong>do I want to be on the receiving end of culture, or create it?</strong>{' '}
              I built this site to think out loud and to push myself to write more
              in a structured way.
            </p>

            <div className="mt-14 pt-14 border-t border-concrete-400/60">
              <h2 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em] mb-8">
                I AM CURRENTLY
              </h2>
              <ul className="space-y-4">
                <li className="font-mono text-[0.75rem] text-concrete-700 flex items-baseline gap-4">
                  <span className="text-[#0000EE]">→</span>
                  <span>
                    Reading{' '}
                    <a
                      href="https://www.amazon.com/Silk-Roads-New-History-World/dp/1101946326"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
                    >
                      The Silk Roads
                    </a>
                    , a history of trade in the Old World.
                  </span>
                </li>
                <li className="font-mono text-[0.75rem] text-concrete-700 flex items-baseline gap-4">
                  <span className="text-[#0000EE]">→</span>
                  <span>
                    Staring at this highly detailed{' '}
                    <a
                      href="https://upload.wikimedia.org/wikipedia/commons/8/8f/Map_of_the_districts_of_Jhelum_and_Rawalpindi%2C_surveyed_by_D._G._Robinson%2C_1851%E2%80%9354%2C_copied_by_Sunawullah_in_1857_%28F07-37%29.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0000EE] underline underline-offset-4 transition-colors duration-150"
                    >
                      1857 map of the Rawalpindi district
                    </a>
                    .
                  </span>
                </li>
                <li className="font-mono text-[0.75rem] text-concrete-700 flex items-baseline gap-4">
                  <span className="text-[#0000EE]">→</span>
                  <span>
                    Patiently waiting for 1980s nostalgia media to be replaced by 2000s nostalgia media.
                  </span>
                </li>
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
                  'AI & NLP',
                  'Semiotics & Semantics',
                  'Languages & Etymology',
                  'Castles & Fortresses',
                  'Hills, Creeks and such',
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
