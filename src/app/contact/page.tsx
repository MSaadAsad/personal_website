import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch.',
};

export default function ContactPage() {
  return (
    <Container className="py-24">
      <PageHeader
        title="CONTACT"
        className="concrete-block concrete-edge concrete-header"
      />

      <div className="space-y-14">
        <div className="concrete-block concrete-edge p-8 md:p-10">
          <div className="space-y-5">
            {[
              { label: 'EMAIL', href: 'mailto:saadasad163@gmail.com', text: 'saadasad163@gmail.com' },
              { label: 'GITHUB', href: 'https://github.com/msaadasad', text: 'github.com/msaadasad' },
              { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/saad-asad-836b82216/', text: 'linkedin.com/in/saad-asad-836b82216' },
              { label: 'X', href: 'https://x.com/Saad_163_', text: 'x.com/Saad_163_' },
              { label: 'MEDIUM', href: 'https://medium.com/@msaadasad', text: 'medium.com/@msaadasad' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-baseline gap-5 group"
              >
                <span className="font-mono text-[0.6rem] text-concrete-600 tracking-[0.2em] w-20 shrink-0">
                  {link.label}
                </span>
                <span className="font-mono text-[0.75rem] text-[#0000EE] group-hover:underline underline-offset-4 transition-colors duration-150">
                  {link.text}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
