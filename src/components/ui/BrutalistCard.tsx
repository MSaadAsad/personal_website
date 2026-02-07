import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  accent?: 'left' | 'top' | 'none';
}

export function BrutalistCard({
  children,
  className,
  href,
  accent = 'none',
}: BrutalistCardProps) {
  const classes = cn(
    'concrete-card concrete-edge w-full p-6 md:p-7',
    accent === 'left' && 'border-l-[6px] border-l-[#0000EE]',
    accent === 'top' && 'border-t-2 border-t-[#0000EE]/40',
    href && 'cursor-pointer group',
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, 'block')}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
