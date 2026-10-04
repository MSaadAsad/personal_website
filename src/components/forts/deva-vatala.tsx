import React from "react";
import { octagon } from "./geometry";
import type { SceneProps, FortSite } from "./types";

const ROOT = "/assets/deva-vatala";
// Source 2 is the marked image. A colour-sample registration of source 2 ->
// source 1 gives x1=.983*x2-63, y1=.983*y2+7. Preserve a uniform image scale.
const IMAGE_TRANSFORM = `matrix(${1 / 0.983} 0 0 ${1 / 0.983} ${63 / 0.983} ${-7 / 0.983})`;
// Least-square square approximation to the four marked corners, calibrated
// to the user's 40 m side length. One metre is 6.26947 image-coordinate units.
const PLAN = {
  a: 6.25,
  b: 0.49375,
  c: -0.49375,
  d: 6.25,
  x: 1092.125,
  y: 641.125,
};
const PLAN_TRANSFORM = `matrix(${PLAN.a} ${PLAN.b} ${PLAN.c} ${PLAN.d} ${PLAN.x} ${PLAN.y})`;
const PIXELS_PER_METRE = Math.hypot(PLAN.a, PLAN.b);
// Cliffs in plan metres: an irregular crest at x, falling toward `dir` (±1).
// Drawn as a fading shadow band plus tapering rock teeth, the usual map cliff symbol.
function cliff(x: number, y0: number, y1: number, dir: number) {
  const crestAt = (y: number) => x + dir * (0.5 * Math.sin(y * 0.9) + 0.35 * Math.sin(y * 2.3));
  const ys: number[] = [];
  for (let y = y0; y <= y1; y += 0.75) ys.push(y);
  const crest = ys.map((y) => `${crestAt(y).toFixed(2)} ${y}`);
  const foot = ys
    .map((y) => `${(crestAt(y) + dir * (5 + 1.2 * Math.sin(y * 0.6) + 0.6 * Math.sin(y * 1.7))).toFixed(2)} ${y}`)
    .reverse();
  const teeth: string[] = [];
  ys.forEach((y, i) => {
    if (i % 2) return;
    const c = crestAt(y),
      len = 1.8 + 1.4 * Math.abs(Math.sin(y * 1.3));
    teeth.push(`M${(c).toFixed(2)} ${y - 0.45}L${(c + dir * len).toFixed(2)} ${y}L${c.toFixed(2)} ${y + 0.45}Z`);
  });
  return {
    shade: `M${crest.join("L")}L${foot.join("L")}Z`,
    crest: `M${crest.join("L")}`,
    teeth: teeth.join(""),
    dir,
  };
}
// A drop right beside the east wall, and a second one about 24 m west of the fort.
const CLIFFS = [cliff(42.6, -12, 52, 1), cliff(-24, -18, 58, -1)];
const MARKED_FOOTPRINT = "M1097 655L1360 664L1337 900L1067 884Z";
const CLEARING =
  "M1102 644Q1181 626 1270 646L1355 666Q1364 721 1341 781L1330 888Q1283 923 1211 927L1071 885Q1063 825 1083 743Z";
const sources = [
  "Unmarked satellite view",
  "Your marked fort footprint",
  "Historical map: Batāla",
  "Stone fragments at ground level",
];
const featureCaptions: Record<string,string> = {"enclosure": "A proposed 40 × 40 m enclosure. The octagonal bastions (5 m across) and central gate (3 m wide) are illustrative assumptions.", "interior": "Vegetation obscures the interior; no rooms are reconstructed."};
const features: FortSite["features"] = [
  {
    id: "enclosure",
    photos: ["batalaWall", "foundation"],
    title: "Enclosure",
    kind: "User-supplied dimension",
    image: 2,
    x: 1096,
    y: 655,
    text: "A 40 × 40 m enclosure gives a nominal footprint of 1,600 m². The square follows the position and slight rotation of your marked aerial outline. Four octagonal corner bastions are 5 m across, matching the Padhar reconstruction as you specified.",
    note: "The marked outline is slightly irregular. The exact square is an approximation; wall thickness is illustratively 0.8 m. The 5 m bastions follow your instruction; their diameter is measured between opposite vertices. A 3 m entrance is assumed at the centre of the lower wall, without a projecting gatehouse.",
  },
  {
    id: "interior",
    photos: ["stonework"],
    title: "Interior",
    kind: "Visible in aerial reference",
    image: 1,
    x: 1216,
    y: 777,
    text: "Vegetation covers much of the marked site. Lighter patches and changes in ground cover are visible inside the proposed footprint.",
    note: "These tonal changes are not enough to identify rooms, a courtyard, a well or particular foundations. No internal buildings are reconstructed.",
  },
];

export function DevaScene({ remains, labels }: SceneProps) {
  return (
    <>
      <defs>
        <pattern
          id="dv-ground"
          width="15"
          height="15"
          patternUnits="userSpaceOnUse"
        >
          <rect width="15" height="15" fill="#f2f2ef" />
          <circle cx="3" cy="9" r=".6" fill="#a9b397" opacity=".5" />
        </pattern>
        <pattern
          id="dv-stone"
          width="2"
          height="1.5"
          patternUnits="userSpaceOnUse"
        >
          <rect width="2" height="1.5" fill="#111111" />
          <path
            d="M0 0H2M.8 0L1 1.5M0 1.5H2"
            stroke="#111111"
            strokeWidth=".08"
          />
        </pattern>
      </defs>{" "}
      <rect x="0" y="0" width="2200" height="1600" fill="#f2f2ef" />
      <path d={CLEARING} fill="#f2f2ef" fillOpacity=".6" />
      <defs>
        {[1, -1].map((dir) => (
          <linearGradient key={dir} id={`dv-cliff-shade-${dir}`} x1={dir > 0 ? 0 : 1} x2={dir > 0 ? 1 : 0} y1="0" y2="0">
            <stop offset="0" stopColor="#6f6e69" stopOpacity=".45" />
            <stop offset="1" stopColor="#6f6e69" stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <g transform={PLAN_TRANSFORM} data-cliffs="true" aria-label="Cliff edges east and west of the fort">
        {CLIFFS.map((c) => (
          <g key={c.crest}>
            <path d={c.shade} fill={`url(#dv-cliff-shade-${c.dir})`} />
            <path d={c.teeth} fill="#4b4a46" />
            <path d={c.crest} fill="none" stroke="#3f3e3b" strokeWidth=".35" strokeLinejoin="round" />
          </g>
        ))}
      </g>
      {remains ? (
        <g data-layer="partial-remains">
          <path
            d={MARKED_FOOTPRINT}
            fill="#d4c69c"
            fillOpacity=".09"
            stroke="#e3d6ad"
            strokeWidth="1.6"
            strokeDasharray="6 6"
          />
          {labels && (
            <g className="dv-map-type">
              <text x="1217" y="753" textAnchor="middle">
                OVERGROWN SITE
              </text>
              <text
                x="1217"
                y="778"
                className="dv-map-small"
                textAnchor="middle"
              >
                Marked extent · not a standing wall
              </text>
            </g>
          )}
        </g>
      ) : (
        <g data-layer="reconstruction">
          <g transform={PLAN_TRANSFORM}>
            <path
              d="M18.5 40H0V0H40V40H21.5"
              fill="none"
              stroke="#111111"
              strokeWidth=".9"
            />
            <path
              d="M18.5 40H0V0H40V40H21.5"
              fill="none"
              stroke="#111111"
              strokeWidth=".8"
            />
            <g data-gate="true" aria-label="Central entrance within the wall, 3 metres wide">
              <path d="M18.5 39.55V40.45M21.5 39.55V40.45" stroke="#111111" strokeWidth=".35" fill="none" />
              <path d="M18.5 40V38.5M21.5 40V38.5" stroke="#111111" strokeWidth=".18" fill="none" />
            </g>
            <g
              data-bastions="true"
              aria-label="Four assumed octagonal corner bastions, modelled at 5 metres across"
            >
              {[
                [0, 0],
                [40, 0],
                [40, 40],
                [0, 40],
              ].map(([x, y], i) => (
                <g key={i}>
                  <polygon
                    points={octagon(x, y, 2.5)}
                    fill="#111111"
                    stroke="#111111"
                    strokeWidth=".1"
                  />
                  <polygon
                    points={octagon(x, y, 2)}
                    fill="#f2f2ef"
                    stroke="#111111"
                    strokeWidth=".1"
                  />
                </g>
              ))}
            </g>
            {labels && (
              <g fill="#4b513f" fontFamily="Arial,sans-serif" fontSize="1.4">
                <path
                  d="M0 -3V-5H40V-3M-3 0H-5V40H-3"
                  stroke="#5f6a4f"
                  strokeWidth=".1"
                  fill="none"
                />
                <text x="20" y="-6" textAnchor="middle">
                  40 m
                </text>
                <text
                  transform="translate(-6.5 20) rotate(-90)"
                  textAnchor="middle"
                >
                  40 m
                </text>
              </g>
            )}
          </g>
          {labels && (
            <g className="dv-map-type">
              <text x="1217" y="753" textAnchor="middle">
                DEVA VATALA
              </text>
              <text
                x="1217"
                y="778"
                className="dv-map-small"
                textAnchor="middle"
              >
                PROPOSED 1,600 m² ENCLOSURE
              </text>
            </g>
          )}
        </g>
      )}
    </>
  );
}
export const devaSite: FortSite = {
  id: "deva-vatala",
  name: "Deva Vatala",
  number: "02",
  eyebrow: "A FOOTPRINT IN THE LANDSCAPE",
  heading: (
    <>
      Tracing
      <br />
      <em>Deva Vatala.</em>
    </>
  ),
  intro:
    "A forty-metre enclosure beneath the vegetation. Read the proposed plan alongside the aerial footprint and stone fragments on the ground.",
  other: { href: "/padar", name: "Padhar Fort" },
  sources,
  features: features.map(f=>({...f,caption:featureCaptions[f.id]})),
  side: 40,
  ppm: PIXELS_PER_METRE,
  viewport: { x: 830, y: 405, width: 634, height: 786 },
  satellite: {
    href: `${ROOT}/reference-1.png`,
    width: 2114,
    height: 1476,
    transform: IMAGE_TRANSFORM,
  },
  pinScale: 0.7,
  centre: {
    x: PLAN.x + 20 * (PLAN.a + PLAN.c),
    y: PLAN.y + 20 * (PLAN.b + PLAN.d),
  },
  nearby: [
    { name: "Maukriala", metres: 3500, bearing: 250 },
    { name: "Batala village", metres: 500, bearing: 180 },
    { name: "LoC", metres: 2500, bearing: 0, note: "Present-day · approximate" },
  ],
  pinOffset: 30,
  Scene: DevaScene,
  dimensions: "Central gate · 3 m opening assumed",
  archiveTitle: "From footprint to fragments.",
  about:
    "The square approximates your marked footprint. The clean satellite image is registered to the marked screenshot by uniform scale and translation. The yellow outline is approximate; the historical map provides context rather than an exact site location. In partial remains, the dashed extent is a guide, not an assertion of surviving walls. The stone photograph is unlocated. Directions to Maukriala (3.5 km at 250°), Batala village (500 m south) and the LoC (2.5 km north) are approximate, measured from the enclosure.",
  footnote:
    "A visual hypothesis using your supplied references. “Batāla” appears on the historical map. The fort’s date, wall heights, gate position and present-day condition are not established here.",
  featureForView: (base, remains) =>
    remains && base.id === "enclosure"
      ? {
          ...base,
          title: "Remains",
          kind: "Marked extent · preservation uncertain",
          text: "The dashed line follows your marked extent. It identifies the site to examine without depicting an intact fort. The stone photograph documents material on the ground, but does not locate surviving masonry along each side.",
          note: "The supplied images cannot resolve the height, continuity or precise survival of individual walls. No gate, corner towers or completed wall circuit are drawn in this view.",
        }
      : base,
};
