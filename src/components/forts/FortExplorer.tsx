"use client";
import { FortPhotos } from "./FortPhotos";
import { useId, useState } from "react";
import type { FortSite } from "./types";
import { FortMap } from "./FortMap";
export default function FortExplorer({ site, title = site.name }: { site: FortSite; title?: string }) {
  const { features } = site;
  const opacityId = useId();
  const [remains, setRemains] = useState(false);
  const [satelliteOpacity, setSatelliteOpacity] = useState(0);
  const [selected, setSelected] = useState(features[0].id);
  const base = features.find((f) => f.id === selected)!;
  const f = site.featureForView?.(base, remains) ?? base;
  return (
    <div className={`pf-page pf-embed ${site.id}`}>
      <section className="pf-workspace" aria-label={`${site.name} plan`}>
        <div className="pf-view-switch" aria-label="Fort view">
          <button aria-pressed={!remains} onClick={() => setRemains(false)}>
            Reconstruction
          </button>
          <button
            aria-pressed={remains}
            onClick={() => {
              setRemains(true);
              if (f.hiddenInRemains)
                setSelected(features.find((v) => !v.hiddenInRemains)!.id);
            }}
          >
            Partial remains
          </button>
          <h2 id={site.id} className="pf-site-name">
            {title}
          </h2>
        </div>

        <div className="pf-toolbar">
          <div className="pf-overlay-control">
            <label htmlFor={opacityId}>Satellite</label>
            <input
              id={opacityId}
              type="range"
              min="0"
              max="100"
              step="1"
              value={satelliteOpacity}
              onChange={(e) => setSatelliteOpacity(Number(e.target.value))}
            />
            <output htmlFor={opacityId}>{satelliteOpacity}%</output>
          </div>
        </div>
        <div className="pf-explorer-body">
          <div className="pf-map-wrap">
            <FortMap
              site={site}
              selected={selected}
              onSelect={setSelected}
              labels={false}
              zoom={1}
              focusGate={false}
              satelliteOpacity={satelliteOpacity}
              remains={remains}
            />

          </div>
        </div>
          <aside className="pf-detail">
            <nav className="pf-feature-nav" aria-label="Site features">
              {features.map((v, i) =>
                remains && v.hiddenInRemains ? null : (
                  <button
                    key={v.id}
                    aria-pressed={selected === v.id}
                    className={selected === v.id ? "active" : ""}
                    onClick={() => setSelected(v.id)}
                    title={v.title}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ),
              )}
            </nav>
            <div className="pf-detail-copy" aria-live="polite">
              <div className="pf-feature-summary"><h2>{f.title}</h2><p>{f.caption}</p></div>
              {f.photos && <FortPhotos images={f.photos} />}
            </div>
          </aside>
      </section>
    </div>
  );
}
