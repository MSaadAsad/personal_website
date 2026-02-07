import { TimelineMoment as TimelineMomentType } from '@/types/content';
import { TimelineMoment } from './TimelineMoment';

export function TimelineTrack({ moments }: { moments: TimelineMomentType[] }) {
  return (
    <div className="relative">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#0000EE]/70 via-[#0000EE]/40 to-concrete-500" />

      <div className="space-y-12">
        {moments.map((moment, index) => (
          <TimelineMoment
            key={moment.id}
            moment={moment}
            side={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </div>
  );
}
