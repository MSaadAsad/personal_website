import { cn } from '@/lib/utils';

export function Tag({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block font-mono text-[0.65rem] tracking-wide px-2.5 py-1 rounded-full',
        variant === 'default' && 'text-concrete-800 border border-concrete-700/70 bg-concrete-300/80',
        variant === 'accent' && 'text-steel-700 border border-steel-600/50 bg-concrete-300/80',
        className
      )}
    >
      {children}
    </span>
  );
}
