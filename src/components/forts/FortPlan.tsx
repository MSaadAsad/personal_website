"use client";

import FortExplorer from './FortExplorer';
import { padarSite } from './padar';
import { devaSite } from './deva-vatala';
import './forts.css';

export default function FortPlan({ fort, title }: { fort: 'padar' | 'deva-vatala'; title?: string }) {
  const site = fort === 'padar' ? padarSite : devaSite;
  return <FortExplorer site={site} title={title} />;
}

export function FortPlans() {
  return (
    <div className="pf-comparison">
      <section aria-labelledby="padar">
        <FortPlan fort="padar" title="Padhar" />
      </section>
      <section aria-labelledby="deva-vatala">
        <FortPlan fort="deva-vatala" title="Deva Vatala" />
      </section>
    </div>
  );
}

/** One fort's map, for placing inside that fort's section of a post. */
export function FortSection({ fort, title }: { fort: 'padar' | 'deva-vatala'; title: string }) {
  return (
    <div className="pf-comparison">
      <section aria-labelledby={fort}>
        <FortPlan fort={fort} title={title} />
      </section>
    </div>
  );
}
