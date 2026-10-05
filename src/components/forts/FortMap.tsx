import React from "react";
import type { FortSite } from "./types";
import { camera, crossfade } from "./map-state";
interface Props {
  site: FortSite;
  remains: boolean;
  labels: boolean;
  zoom: number;
  focusGate: boolean;
  satelliteOpacity: number;
  selected: string;
  onSelect: (id: string) => void;
}
export function FortMap({
  site,
  remains,
  labels,
  zoom,
  focusGate,
  satelliteOpacity,
  selected,
  onSelect,
}: Props) {
  const view = camera(site.viewport, zoom, focusGate ? site.focus : undefined);
  const blend = crossfade(satelliteOpacity);
  const unit = view.width / 800;
  const metres = zoom > 2 ? 5 : 10;
  const length = metres * site.ppm;
  return (
    <svg
      className="pf-drawing"
      style={{ aspectRatio: `${site.viewport.width}/${site.viewport.height}` }}
      viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
      role="group"
      aria-label={`${site.name} ${remains ? "partial remains" : "reconstruction"} map`}
    >
      {/* Additive blending gives an exact linear mix, including opaque paper/terrain. */}
      <g style={{ isolation: "isolate" }}>
        <g
          data-map-layer="drawing"
          opacity={blend.drawing}
          style={{ pointerEvents: blend.drawing === 0 ? "none" : undefined }}
        >
          <site.Scene remains={remains} labels={labels} />
        </g>
        <image
          data-map-layer="satellite"
          {...site.satellite}
          opacity={blend.satellite}
          style={{ mixBlendMode: "plus-lighter" }}
          pointerEvents="none"
        />
      </g>
      <g
        data-map-layer="markers"
        opacity={blend.drawing}
        visibility={blend.drawing === 0 ? "hidden" : "visible"}
      >
        {site.features.map((f, i) =>
          f.x === undefined ||
          f.y === undefined ||
          (remains && f.hiddenInRemains) ? null : (
            <g
              key={f.id}
              className={`pf-pin ${selected === f.id ? "is-selected" : ""}`}
              role="button"
              tabIndex={blend.drawing === 0 ? -1 : 0}
              aria-label={`Inspect ${f.title}`}
              aria-pressed={selected === f.id}
              onClick={() => onSelect(f.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(f.id);
                }
              }}
              transform={`translate(${f.x} ${f.y + site.pinOffset}) scale(${site.pinScale})`}
            >
              <circle r="21" className="pf-pin-halo" />
              <circle r="15" />
              <text textAnchor="middle" y="5">
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          ),
        )}
      </g>
      {/* Nearby places sit on the map edge along their true bearing; the image is north-up. */}
      {site.centre &&
        site.nearby?.filter((p) => !remains || !p.hiddenInRemains).map((p) => {
          const c = site.centre!;
          const rad = (p.bearing * Math.PI) / 180;
          const dx = Math.sin(rad),
            dy = -Math.cos(rad);
          const distance =
            p.metres >= 1000 ? `${p.metres / 1000} km` : `${p.metres} m`;
          // Stack name, distance and a wrapped note so side labels stay narrow.
          const lines = [distance];
          for (const word of p.note?.split(" ") ?? []) {
            const last = lines.length - 1;
            if (last > 0 && `${lines[last]} ${word}`.length <= 14) lines[last] += ` ${word}`;
            else lines.push(word);
          }
          const font = 12 * unit,
            lead = 15 * unit;
          const w =
            Math.max(p.name.length + 2, ...lines.map((l) => l.length)) * 0.62 * font + 16 * unit;
          const h = (lines.length + 1) * lead + 8 * unit;
          const m = 10 * unit;
          // Slide the label out along the bearing until it meets the map edge.
          const exit = (d: number, pos: number, lo: number, hi: number, half: number) =>
            d > 1e-9 ? (hi - m - half - pos) / d : d < -1e-9 ? (lo + m + half - pos) / d : Infinity;
          const t = Math.min(
            exit(dx, c.x, view.x, view.x + view.width, w / 2),
            exit(dy, c.y, view.y, view.y + view.height, h / 2),
          );
          const x = c.x + dx * t,
            y = c.y + dy * t;
          return (
            <g
              key={p.name}
              data-map-layer="place"
              className="pf-place"
              transform={`translate(${x} ${y})`}
              style={{ fontSize: font }}
              aria-label={`${p.name}, ${distance} at ${p.bearing} degrees`}
            >
              <rect
                x={-w / 2}
                y={-h / 2}
                width={w}
                height={h}
                rx={3 * unit}
                fill="#f2f2efee"
                stroke="#7e7d7a"
                strokeWidth={unit}
              />
              <path
                d={`M0 ${5 * unit}V${-5 * unit}M${-3 * unit} ${-2 * unit}L0 ${-5 * unit}L${3 * unit} ${-2 * unit}`}
                transform={`translate(${-w / 2 + 12 * unit} ${-h / 2 + 12 * unit}) rotate(${p.bearing})`}
                stroke="#111111"
                strokeWidth={1.4 * unit}
                fill="none"
              />
              <text x={-w / 2 + 22 * unit} y={-h / 2 + 16 * unit} fontWeight={600}>
                {p.name}
              </text>
              {lines.map((l, i) => (
                <text
                  key={i}
                  x={-w / 2 + 8 * unit}
                  y={-h / 2 + 16 * unit + (i + 1) * lead}
                  className={i ? "pf-place-sub" : undefined}
                >
                  {l}
                </text>
              ))}
            </g>
          );
        })}
      <g
        data-map-layer="north"
        className="pf-scale"
        transform={`translate(${view.x + view.width - 30 * unit} ${view.y + 30 * unit})`}
        style={{ fontSize: 13 * unit, fontWeight: 600 }}
        aria-label="North"
      >
        <circle r={16 * unit} fill="#f2f2efee" stroke="#7e7d7a" strokeWidth={unit} />
        <path
          d={`M0 ${-11 * unit}L${5 * unit} ${4 * unit}L0 ${1 * unit}L${-5 * unit} ${4 * unit}Z`}
          fill="#111111"
        />
        <text y={34 * unit} textAnchor="middle" fill="#111111">
          N
        </text>
      </g>
      <g
        transform={`translate(${view.x + view.width - length - 25 * unit} ${view.y + view.height - 35 * unit})`}
        className="pf-scale"
        style={{ fontSize: 11 * unit }}
      >
        <rect
          x={-10 * unit}
          y={-15 * unit}
          width={length + 20 * unit}
          height={37 * unit}
          rx={3 * unit}
          fill="#f2f2efee"
        />
        <path
          d={`M0 ${-6 * unit}V0H${length}V${-6 * unit}M${length / 2} ${-5 * unit}V0`}
          fill="none"
          stroke="#111111"
          strokeWidth={unit}
        />
        <text y={15 * unit}>0</text>
        <text x={length} y={15 * unit} textAnchor="end">
          {metres} m
        </text>
      </g>
    </svg>
  );
}
