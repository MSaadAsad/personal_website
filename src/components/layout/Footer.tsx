import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-concrete-700/60 bg-[var(--color-concrete-block)] mt-32">
      <Container className="py-0 flex flex-col md:flex-row justify-between items-stretch">
        <div className="font-mono text-[0.78rem] text-concrete-600 tracking-wider px-6 py-4 border-b md:border-b-0 md:border-r border-concrete-700/60 flex items-center justify-center md:flex-1">
          &copy; {new Date().getFullYear()} SAAD
        </div>
        <div className="flex flex-1">
          <a
            href="https://github.com/msaadasad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.78rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 tracking-wider px-6 py-4 border-r border-concrete-700/60 flex items-center justify-center flex-1"
          >
            GITHUB
          </a>
          <a
            href="https://www.linkedin.com/in/saad-asad-836b82216/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.78rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 tracking-wider px-6 py-4 border-r border-concrete-700/60 flex items-center justify-center flex-1"
          >
            LINKEDIN
          </a>
          <a
            href="https://x.com/Saad_163_"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.78rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 tracking-wider px-6 py-4 border-r border-concrete-700/60 flex items-center justify-center flex-1"
          >
            TWITTER
          </a>
          <a
            href="https://medium.com/@msaadasad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.78rem] text-concrete-700 hover:text-[#0000EE] transition-colors duration-150 tracking-wider px-6 py-4 flex items-center justify-center flex-1"
          >
            MEDIUM
          </a>
        </div>
      </Container>
    </footer>
  );
}
