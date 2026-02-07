import { TimelineMoment as TimelineMomentType } from '@/types/content';
import { cn } from '@/lib/utils';

export function TimelineMoment({
  moment,
  side,
}: {
  moment: TimelineMomentType;
  side: 'left' | 'right';
}) {
  const isMajor = moment.weight === 'major';

  return (
    <div
      className={cn(
        'relative grid grid-cols-[3rem_1fr] md:grid-cols-[1fr_3rem_1fr] gap-4 items-start'
      )}
    >
      <div
        className={cn(
          'hidden md:block',
          side === 'right' && 'text-right',
          side === 'left' && 'order-1'
        )}
      >
        {side === 'left' && (
          <MomentCard moment={moment} isMajor={isMajor} align="right" />
        )}
        {side === 'right' && (
          <div className="flex justify-end">
            <span className="font-mono text-[0.65rem] text-concrete-600 pt-5 tracking-wider">
              {moment.date}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-center md:order-2">
        <div
          className={cn(
            'relative z-10 rounded-full mt-5',
            isMajor
              ? 'w-3.5 h-3.5 bg-[#0000EE] border border-[#0000EE]'
              : 'w-2.5 h-2.5 bg-concrete-500 border border-concrete-400'
          )}
        />
      </div>

      <div className={cn('md:order-3', side === 'left' && 'hidden md:block')}>
        {side === 'right' && (
          <MomentCard moment={moment} isMajor={isMajor} align="left" />
        )}
        {side === 'left' && (
          <div className="pt-5">
            <span className="font-mono text-[0.65rem] text-concrete-600 tracking-wider">
              {moment.date}
            </span>
          </div>
        )}
      </div>

      <div className="md:hidden">
        <MomentCard moment={moment} isMajor={isMajor} align="left" />
      </div>
    </div>
  );
}

function MomentCard({
  moment,
  isMajor,
  align,
}: {
  moment: TimelineMomentType;
  isMajor: boolean;
  align: 'left' | 'right';
}) {
  return (
    <div
      className={cn(
        'glass-panel steel-edge',
        isMajor ? 'p-6' : 'p-5',
        align === 'right' && 'text-right'
      )}
    >
      <span className="font-mono text-[0.6rem] text-concrete-600 tracking-[0.2em] uppercase">
        {moment.date}
      </span>
      <h3
        className={cn(
          'font-mono font-semibold text-concrete-900 mt-2',
          isMajor ? 'text-base' : 'text-[0.75rem]'
        )}
      >
        {moment.title}
      </h3>
      <p
        className={cn(
          'font-serif text-concrete-700 mt-2 leading-relaxed',
          isMajor ? 'text-sm' : 'text-[0.75rem]'
        )}
      >
        {moment.description}
      </p>
    </div>
  );
}
