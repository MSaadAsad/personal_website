import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('mb-0', className)}>
      <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
        {title}
      </h1>
      <div className="section-divider" />
      {subtitle && (
        <p className="mt-5 text-base text-concrete-700 font-mono max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
