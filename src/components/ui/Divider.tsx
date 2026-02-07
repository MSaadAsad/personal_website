import { cn } from '@/lib/utils';

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-concrete-400/70 w-full', className)} />;
}
