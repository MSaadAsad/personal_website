import { Gatehouse, GateButtresses } from "./Gatehouse";
import React from "react";
import { octagon } from "./geometry";
import type { SceneProps, FortSite } from "./types";

// Enlarge the satellite registration by 8% about the enclosure centre.
// Keep source landmarks in image pixels so they follow the same registration.
const SATELLITE = {
  a: 1.0668402,
  b: -0.07138368,
  c: 0.07138368,
  d: 1.0668402,
  e: -380.52184,
  f: -166.64776,
};
const SATELLITE_TRANSFORM = `matrix(${SATELLITE.a} ${SATELLITE.b} ${SATELLITE.c} ${SATELLITE.d} ${SATELLITE.e} ${SATELLITE.f})`;
function sourceToMap(x: number, y: number) {
  return {
    x: Number((SATELLITE.a * x + SATELLITE.c * y + SATELLITE.e).toFixed(3)),
    y: Number((SATELLITE.b * x + SATELLITE.d * y + SATELLITE.f).toFixed(3)),
  };
}
// Keep the trace-derived scale and orientation, but translate the entire square
// along its side axis so the straight north wall meets the image-anchored gate.
export const GATE_SOURCE = { x: 960, y: 426 };
const TRACE_ORIGIN = { x: 645, y: 468 };
// Slightly enlarge the image registration toward the east and south.
const ENCLOSURE_SCALE = 1.05;
const TRACE_EAST = { x: 417 * ENCLOSURE_SCALE, y: 109 * ENCLOSURE_SCALE };
const NORTH_SHIFT =
  (70 *
    (-(GATE_SOURCE.x - TRACE_ORIGIN.x) * TRACE_EAST.y +
      (GATE_SOURCE.y - TRACE_ORIGIN.y) * TRACE_EAST.x)) /
    (TRACE_EAST.x ** 2 + TRACE_EAST.y ** 2) +
  3;
export const PADAR_SOURCE_PLAN = {
  origin: {
    x: TRACE_ORIGIN.x - (TRACE_EAST.y * NORTH_SHIFT) / 70,
    y: TRACE_ORIGIN.y + (TRACE_EAST.x * NORTH_SHIFT) / 70,
  },
  east: TRACE_EAST,
  side: 70,
};
function planToMap(x: number, y: number) {
  const { origin, east, side } = PADAR_SOURCE_PLAN;
  return sourceToMap(
    origin.x + (east.x * x - east.y * y) / side,
    origin.y + (east.y * x + east.x * y) / side,
  );
}
const PLAN_ORIGIN = planToMap(0, 0);
const PLAN_EAST = planToMap(70, 0);
const METRES_TO_MAP =
  Math.hypot(PLAN_EAST.x - PLAN_ORIGIN.x, PLAN_EAST.y - PLAN_ORIGIN.y) / 70;
const WALL_ROTATION =
  (Math.atan2(PLAN_EAST.y - PLAN_ORIGIN.y, PLAN_EAST.x - PLAN_ORIGIN.x) * 180) /
  Math.PI;
const PLAN_TRANSFORM = `translate(${PLAN_ORIGIN.x} ${PLAN_ORIGIN.y}) rotate(${WALL_ROTATION}) scale(${METRES_TO_MAP})`;
const CORNERS = [
  [0, 0],
  [70, 0],
  [70, 70],
  [0, 70],
].map(([x, y]) => planToMap(x, y));
// User's gate crop matches source rectangle (868,356,124,118).
// Anchor the eastern opening on the visible gate at approximately (960,426).
const gateVector = {
  x: GATE_SOURCE.x - PADAR_SOURCE_PLAN.origin.x,
  y: GATE_SOURCE.y - PADAR_SOURCE_PLAN.origin.y,
};
const gateDenominator = TRACE_EAST.x ** 2 + TRACE_EAST.y ** 2;
const GATE_SHIFT = {
  x:
    (70 * (gateVector.x * TRACE_EAST.x + gateVector.y * TRACE_EAST.y)) /
      gateDenominator -
    39.35,
  y: 0,
};
const GATE_TRANSFORM = `translate(${GATE_SHIFT.x} ${GATE_SHIFT.y})`;
const GATE_POSITION = sourceToMap(GATE_SOURCE.x, GATE_SOURCE.y);
const GATE_WEST_JOIN = { x: 30.65 + GATE_SHIFT.x, y: GATE_SHIFT.y };
const GATE_EAST_JOIN = { x: 39.35 + GATE_SHIFT.x, y: GATE_SHIFT.y };
// One continuous wall run terminates at the two gatehouse returns.
const ENCLOSURE_WALLS = `M${GATE_WEST_JOIN.x} ${GATE_WEST_JOIN.y}L0 0V70H70V0L${GATE_EAST_JOIN.x} ${GATE_EAST_JOIN.y}`;
const outline = ENCLOSURE_WALLS + "Z";
const PLAN_CENTER = planToMap(35, 35);
// Old Doara channel below the west wall, in plan metres; the course is approximate.
const OLD_RIVER =
  "M-23 -95C-17 -50 -25 -10 -19 25S-10 85 -12 120S-6 175 -3 215";
// Traced from reference-2.png; all landscape geometry shares its pixel coordinates.
const WELL_SOURCE = { x: 1058, y: 593 };
const WELL_POSITION = sourceToMap(WELL_SOURCE.x, WELL_SOURCE.y);
const POND_POSITION = sourceToMap(1060, 1260);
const GRAVES_POSITION = sourceToMap(690, 1040);
const POND_OUTLINE =
  "M953 1138Q974 1119 1003 1124Q1032 1133 1050 1148Q1083 1171 1135 1195Q1170 1221 1180 1251Q1183 1293 1160 1333L1164 1402Q1140 1426 1095 1422L1057 1405Q1033 1370 1017 1343Q971 1315 960 1275L943 1229Q936 1182 953 1138Z";
function TracedLandscape({ labels }: { labels: boolean }) {
  return (
    <g transform={SATELLITE_TRANSFORM} data-source-traces="true">
      <path
        d={POND_OUTLINE}
        fill="#c7c7c4"
        fillOpacity=".65"
        stroke="#737370"
        strokeWidth="3"
        aria-label="Pond shoreline traced from satellite"
      />
      <g transform="rotate(-12 690 1040)">
        {Array.from({ length: 35 }, (_, i) => (
          <g
            key={i}
            transform={`translate(${535 + (i % 7) * 43} ${978 + Math.floor(i / 7) * 26})`}
          >
            <rect
              width="12"
              height="19"
              rx="2"
              fill="#f2f2ef"
              stroke="#777774"
              strokeWidth="1"
            />
            <path d="M0 5H12" stroke="#777774" />
          </g>
        ))}
      </g>
      <circle
        cx={WELL_SOURCE.x}
        cy={WELL_SOURCE.y}
        r="9"
        fill="#111111"
        stroke="#111111"
        strokeWidth="1.5"
      />
      <circle cx={WELL_SOURCE.x} cy={WELL_SOURCE.y} r="5.5" fill="#e2e1dd" />
      {labels && (
        <g
          fontSize="10"
          fontFamily="Arial,sans-serif"
          fill="#555555"
          letterSpacing="1"
        >
          <text x="1007" y="1291">
            POND
          </text>
          <text x="588" y="1149">
            BURIAL GROUND
          </text>
        </g>
      )}
    </g>
  );
}

const featureCaptions: Record<string,string> = {"gate": "A projection from the north wall, reconstructed with a turning entrance. The inner opening is inferred; parts of the outer face are now built into houses.", "bastions": "Villagers remember four corner bastions. None survives, so the octagonal shape is a guess based on nearby forts.", "walls": "Lower sections of one wall survive, in thin Nanakshahi-sized brick with triple-slit loopholes. The western wall stood until about 2013, when it was cleared for an Eidgah.", "graves": "A burial ground just outside the southern wall.", "well": "Still in use when I visited. Remembered as the water source that made Padhar a stop on the old Jammu–Bhimber road.", "pond": "A chappar: a pond that catches seasonal rainwater for animals. It lies beyond the fort and the burial ground.", "river": "An old channel of the Doara ran below the west wall, with the fort on slightly raised ground above it. The river has since moved.", "small-bastion": "One of three small octagonal buttresses on the gatehouse's outer face, each about 3 ft across."};
const features: FortSite["features"] = [
  {
    id: "gate",
    photos: ["gate"],
    title: "Gatehouse",
    kind: "Photographed · plan inferred",
    ...GATE_POSITION,
    image: 8,
    text: "A surviving brick arch is visible in the field photographs. The 2020 account describes a gate perpendicular to the approach. This model proposes a projecting, box-shaped gatehouse with two openings at right angles. The chamber projects outside the enclosure; a side entrance turns 90° toward a second opening into the fort.",
    note: "The 10 m width and estimated 6 m projection (within a 5–7 m range), 2.5 m openings and second gate are illustrative assumptions. Three buttresses occupy the outer gatehouse face: one at each corner and one between them. Each is approximately 1.25 m wide, with 4.35 m centre-to-centre spacing; their total outside width is 9.95 m. None are placed along the enclosure walls. The photographed brick arch informs the gateway; no barbican is established.",
  },
  {
    id: "bastions",
    title: "Bastions",
    kind: "Conjectural reconstruction",
    ...PLAN_EAST,
    image: 7,
    text: "Four octagonal bastions anchor the proposed enclosure. Their assumed diameter is 5 m, following your comparison with Galit and Achrud forts. The smaller buttresses are confined to the gatehouse: three approximately 1.25 m wide, spaced 4.35 m centre-to-centre. Both are drawn to the same scale as the 70 × 70 m enclosure.",
    note: "The 2020 post reports two surviving small burj-like structures. It does not establish four octagonal towers or their positions.",
  },
  {
    id: "walls",
    photos: ["wall"],
    title: "Walls",
    kind: "Photographed · extent uncertain",
    ...planToMap((GATE_EAST_JOIN.x + 70) / 2, GATE_EAST_JOIN.y / 2),
    image: 5,
    text: "The field account reports approximately 50 metres of original wall on one side, and another wall overlooking a nala. The complete enclosure follows your rough quadrilateral sketch. Following your latest interpretation, no smaller buttresses are drawn along the enclosure walls; the three buttresses are confined to the gatehouse.",
    note: "The main enclosure is assumed to measure 70 × 70 m wall-to-wall (4,900 m²), excluding the projecting gatehouse. The reported 50 m of surviving wall does not fix its location. Wall thickness is illustratively 1 m. The gatehouse buttress sizes and spacing follow your latest estimates.",
  },
  {
    id: "graves",
    title: "Graves",
    kind: "Photographed · position approximate",
    ...GRAVES_POSITION,
    image: 4,
    text: "The burial ground lies outside the southern wall in this reconstruction, following your updated interpretation. The graves are shown between the enclosure and the southern approach.",
    note: "These are present-use features, not a claim about the fort’s original layout. Individual grave positions are schematic.",
  },
  {
    id: "well",
    photos: ["well"],
    title: "Well",
    kind: "User-reported · aligned to aerial feature",
    ...WELL_POSITION,
    image: 2,
    text: "The well is aligned with the small circular pit southeast of the larger green patch near the upper-right side of the enclosure in the satellite reference. Its marker and drawn rim follow the same image registration as the overlay; the large green patch above it is not used as the well.",
    note: "This identification follows your interpretation of the site. The low-resolution aerial feature is not independently verified as a well; its masonry rim and dimensions remain illustrative.",
  },
  {
    id: "pond",
    photos: ["pond"],
    title: "Chappar",
    kind: "Photographed · approximate context",
    ...POND_POSITION,
    image: 6,
    text: "The field photographs show a broad, shallow pond near the fort. The aerial reference places a pond beyond the burial ground; it is kept outside the proposed enclosure.",
    note: "The shoreline is traced directly in the supplied aerial image’s coordinates, using the same transform as the satellite overlay. Water level and vegetation may have changed since the photographs.",
  },
  {
    id: "river",
    photos: ["historicalMap"],
    title: "Old river course",
    ...planToMap(-18, 5),
    kind: "Historical map · approximate",
    image: 3,
    text: "Old maps place Padhar beside a channel of the Doara River, on slightly raised ground above it.",
    note: "The river no longer follows this course. The channel is drawn approximately along the west wall.",
  },
  {
    id: "small-bastion",
    photos: ["buttress"],
    title: "Buttress",
    ...planToMap(30.65 + GATE_SHIFT.x, -6),
    kind: "Approximate dimension",
    image: 7,
    text: "A small supporting bastion, approximately 3 ft / 1 m across.",
    note: "The marker identifies the western outer gatehouse buttress in the proposed plan.",
  },
];
const sources = [
  "Marked aerial boundary",
  "Unmarked aerial view",
  "Historical map: Padhar",
  "Graves and ruined arch",
  "Surviving walls",
  "Pond near the fort",
  "Small surviving bastion",
  "Gate photographs",
  "Your proposed fort plan",
];
function GateDetail() {
  return (
    <section className="pf-gate-detail" aria-label="Magnified gatehouse detail">
      <div>
        <strong>THE GATE, UP CLOSE</strong>
        <span>Plan detail</span>
      </div>
      <svg
        viewBox="25 -12 23 19"
        role="img"
        aria-label="Projecting 10 by 6 metre gatehouse with two perpendicular openings and three outer-face buttresses"
      >
        <path
          d="M25 0H30.65M39.35 0H48"
          fill="none"
          stroke="#111111"
          strokeWidth="1"
        />
        <Gatehouse detail />
      </svg>
      <p>
        Approximately 10 m overall including the two corner buttresses (8.7 m
        between corner centres); 6 m projection shown, with 5–7 m plausible.
        Three outer-face buttresses: approximately 1.25 m wide, with centres
        4.35 m apart. No smaller pillars along the enclosure walls.
      </p>
    </section>
  );
}
// Only the outer gatehouse faces are represented in the remains view.
function RemainingGate({ labels = false }: { labels?: boolean }) {
  return (
    <g aria-label="Surviving gate, outer gatehouse line and western face">
      <path
        d="M30.65 0V-6H39.35V-4.25M39.35 -1.75V0"
        fill="none"
        stroke="#111111"
        strokeWidth=".6"
      />
      <path d="M30.65 0V-6" fill="none" stroke="#111111" strokeWidth="1" />
      <path
        d="M39.35 -5V-4.25M39.35 -1.75V-.8"
        fill="none"
        stroke="#111111"
        strokeWidth="1"
      />
      <path
        d="M39.35 -4.25V-1.75"
        fill="none"
        stroke="#111111"
        strokeWidth=".16"
        strokeDasharray=".2 .12"
      />
      <GateButtresses />
      {labels && (
        <g fontSize=".68" fill="#626c5b" fontFamily="Arial, sans-serif">
          <text transform="translate(28.7 -3) rotate(-90)" textAnchor="middle">
            WESTERN FACE
          </text>
          <text x="41.5" y="-3">
            GATE
          </text>
          <text x="35" y="-8" textAnchor="middle">
            OUTER FACE · 3 BUTTRESSES
          </text>
        </g>
      )}
    </g>
  );
}
function RemainsGateDetail() {
  return (
    <section className="pf-gate-detail" aria-label="Surviving gatehouse detail">
      <div>
        <strong>SURVIVING GATEHOUSE</strong>
        <span>Partial remains</span>
      </div>
      <svg
        viewBox="26 -9 22 20"
        role="img"
        aria-label="Outer gatehouse line, western face and surviving gate"
      >
        <path d="M39.35 0H48" stroke="#111111" strokeWidth=".8" />
        <RemainingGate labels />
      </svg>
      <p>
        Three buttresses are shown on the outer gatehouse face, using your
        latest dimensions. The interior continuation is uncertain; no inner gate
        is drawn in the partial-remains view.
      </p>
    </section>
  );
}
// Remains share the enclosure's metre coordinates and registration. The bands
// depict interpreted earthworks, not separately georeferenced survey traces.
function SideEarthworks({ labels }: { labels: boolean }) {
  return (
    <g aria-label="Aligned western and eastern earthwork bands">
      {[0, 70].map((x) => (
        <g key={x} transform={`translate(${x} 0)`} data-earthwork="true">
          <path
            d="M-.5 0L.5 0L.7 9L.4 18L.8 26L.5 35L.7 44L.4 54L.6 63L.3 70L-.5 70L-.7 61L-.4 52L-.8 43L-.5 33L-.7 24L-.4 15Z"
            fill="url(#earthwork-soil)"
            opacity=".55"
            stroke="#aaaaa7"
            strokeWidth=".35"
            strokeLinejoin="round"
            filter="url(#earthwork-soften)"
          />
        </g>
      ))}
      {labels && (
        <g fontFamily="Arial,sans-serif" fontSize="1.05" fill="#555555">
          <text transform="translate(-2.5 35) rotate(-90)" textAnchor="middle">
            WESTERN EARTHWORK
          </text>
          <text transform="translate(72.5 35) rotate(90)" textAnchor="middle">
            EASTERN EARTHWORK
          </text>
        </g>
      )}
    </g>
  );
}
function PartialRemains({ labels }: { labels: boolean }) {
  return (
    <g data-layer="partial-remains">
      <SideEarthworks labels={labels} />
      <g
        aria-label="Surviving wall east of the gatehouse"
        strokeLinecap="square"
      >
        <path
          d={`M${GATE_EAST_JOIN.x} ${GATE_EAST_JOIN.y}L70 0`}
          stroke="#111111"
          strokeWidth="1"
        />
        <path
          d={`M${GATE_EAST_JOIN.x} ${GATE_EAST_JOIN.y}L70 0`}
          stroke="#111111"
          strokeWidth=".66"
        />
      </g>
      <g transform={GATE_TRANSFORM}>
        <RemainingGate labels={labels} />
      </g>
      {labels && (
        <g
          fill="#555555"
          fontFamily="Arial, sans-serif"
          fontSize="1.05"
          letterSpacing=".1"
        >
          <text x="55" y="-2" textAnchor="middle">
            SURVIVING WALL
          </text>
          <text x="35" y="68" textAnchor="middle">
            NO SOUTHERN WALL REMAINS SHOWN
          </text>
        </g>
      )}
    </g>
  );
}

export function PadarScene({ remains, labels }: SceneProps) {
  const ppm = METRES_TO_MAP;
  const bastionRadius = (5 * ppm) / 2;
  const uid = "plan";
  return (
    <>
      <defs>
        <filter id="earthwork-soften">
          <feGaussianBlur stdDeviation=".12" />
        </filter>
        <pattern
          id="earthwork-soil"
          patternTransform="scale(.1)"
          width="13"
          height="17"
          patternUnits="userSpaceOnUse"
        >
          <rect width="13" height="17" fill="#aaaaa7" />
          <path
            d="M2 3l2 1m5 6l-2 2M3 14l1-2"
            stroke="#777774"
            strokeWidth=".7"
            opacity=".5"
          />
        </pattern>
        <pattern
          id={`${uid}-ground`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="9" r=".8" fill="#a99f86" opacity=".3" />
        </pattern>
        <pattern
          id={`${uid}-field`}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <path d="M 0 0 V 12" stroke="#a0a585" strokeWidth="2" opacity=".3" />
        </pattern>
        <pattern
          id={`${uid}-brick`}
          width="18"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect width="18" height="12" fill="#111111" />
          <path
            d="M0 0H18M0 6H18M9 0V6M3 6V12"
            stroke="#f2e4cb"
            strokeWidth="1"
          />
        </pattern>
        <filter
          id={`${uid}-shadow`}
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
        >
          <feDropShadow
            dx="5"
            dy="9"
            stdDeviation="5"
            floodColor="#554b38"
            floodOpacity=".18"
          />
        </filter>
      </defs>{" "}
      <rect x="-1000" y="-1000" width="3500" height="3500" fill="#f2f2ef" />
      
      {!remains && (
        <path
          d={outline}
          transform={PLAN_TRANSFORM}
          fill="#f2f2ef"
          fillOpacity=".3"
        />
      )}
      {!remains && <g transform={PLAN_TRANSFORM} data-old-river="true" aria-label="Approximate former course of the Doara">
        <path
          d={OLD_RIVER}
          fill="none"
          stroke="#b9c8d3"
          strokeOpacity=".7"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={OLD_RIVER}
          fill="none"
          stroke="#7f95a6"
          strokeWidth=".35"
          strokeDasharray="2 1.5"
        />
      </g>}
      {remains ? (
        <g transform={PLAN_TRANSFORM}>
          <PartialRemains labels={labels} />
        </g>
      ) : (
        <g data-layer="reconstruction" >
          <g transform={PLAN_TRANSFORM}>
            <path
              d={ENCLOSURE_WALLS}
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              stroke="#111111"
              strokeWidth="1"
            />
            <path
              d={ENCLOSURE_WALLS}
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              stroke="#111111"
              strokeWidth=".75"
            />
            <g transform={GATE_TRANSFORM}>
              <Gatehouse />
            </g>
          </g>
          {CORNERS.map(({ x, y }, i) => (
            <g key={i}>
              <polygon
                points={octagon(x, y, bastionRadius)}
                fill="#111111"
                stroke="#111111"
                strokeWidth="1"
              />
              <polygon
                points={octagon(x, y, bastionRadius - ppm * 0.5)}
                fill="#f2f2ef"
                stroke="#111111"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>
      )}
      <TracedLandscape labels={labels} />
      {labels && (
        <g className="pf-map-labels">
          <text x={PLAN_CENTER.x} y={PLAN_CENTER.y - 10} textAnchor="middle">
            PADAR FORT
          </text>
          <text
            x={PLAN_CENTER.x}
            y={PLAN_CENTER.y + 13}
            className="pf-map-small"
            textAnchor="middle"
          >
            {remains ? "PARTIAL REMAINS" : "PROPOSED ENCLOSURE"}
          </text>
          <text x="716" y="115" className="pf-map-small">
            VILLAGE SETTLEMENT
          </text>
        </g>
      )}
      {labels && !remains && (
        <g
          transform={PLAN_TRANSFORM}
          fill="#555555"
          fontFamily="Arial,sans-serif"
          fontSize="1.2"
        >
          <path
            d="M0 -10V-12H70V-10M-3 0H-5V70H-3"
            fill="none"
            stroke="#555555"
            strokeWidth=".12"
          />
          <text x="35" y="-13" textAnchor="middle">
            70 m · gatehouse excluded
          </text>
          <text transform="translate(-7 35) rotate(-90)" textAnchor="middle">
            70 m · wall-to-wall
          </text>
        </g>
      )}
    </>
  );
}
export const padarSite: FortSite = {
  id: "padar",
  name: "Padhar Fort",
  number: "01",
  eyebrow: "A FORT, REASSEMBLED",
  heading: (
    <>
      Reading the remains
      <br />
      of <em>Padhar.</em>
    </>
  ),
  intro:
    "A small fort, absorbed into a village. Explore a possible plan through its surviving fragments, field photographs, and the landscape around it.",
  other: { href: "/deva-vatala", name: "Deva Vatala" },
  sources,
  features: features.map((f) => ({
    ...f,
    caption: featureCaptions[f.id],
    hiddenInRemains: f.id === "bastions" || f.id === "river",
  })),
  side: 70,
  ppm: METRES_TO_MAP,
  viewport: { x: 130, y: 40, width: 920, height: 1340 },
  satellite: {
    href: "/assets/padar/reference-2.png",
    width: 1420,
    height: 1442,
    transform: SATELLITE_TRANSFORM,
  },
  pinScale: 1,
  centre: PLAN_CENTER,
  // Padar lies 2 km NW of Hir, 2 km E of the Doara and 2.5 km SE of Barnala.
  nearby: [
    { name: "Hir", metres: 2000, bearing: 135 },
    {
      name: "Doara River",
      hiddenInRemains: true,
      metres: 2000,
      bearing: 270,
      note: "Old course ran adjacent to Padhar and Hir",
    },
    { name: "Barnala", metres: 2500, bearing: 315 },
  ],
  pinOffset: -40,
  focus: { ...GATE_POSITION, zoom: 3, feature: "gate", label: "Inspect gate" },
  Scene: PadarScene,
  Detail: ({ id, remains }) =>
    id === "gate" ? remains ? <RemainsGateDetail /> : <GateDetail /> : null,
  dimensions:
    "Gatehouse excluded · 3 gatehouse buttresses: 1.25 m / 4.35 m c/c",
  archiveTitle: "Nine pieces of the picture.",
  about:
    "The 70 × 70 m enclosure is a square with four right-angle corners. Its scale and orientation follow the parallel traces; the whole square is translated to meet the gate identified in your aerial crop. The gatehouse projects from the straight northern wall. Exact agreement with all irregular earthwork traces remains uncertain. The projecting gatehouse is excluded from the nominal 4,900 m² footprint. Image alignment is approximate: the irregular site does not exactly match the square hypothesis. The photograph is uniformly scaled and rotated. Field posts date to 9 August 2020; the aerial capture date is unknown.",
  footnote:
    "A visual hypothesis, not an archaeological survey. The historical map uses “Padhar.” No construction date, precise coordinates or verified present-day condition is asserted.",
  featureForView: (baseFeature, remains) =>
    remains && baseFeature.id === "gate"
      ? {
          ...baseFeature,
          title: "Gatehouse",
          kind: "Partial remains · user-described",
          text: "The gate, outer line of the gatehouse, and its western face remain. Three buttresses are shown only on its outer face, approximately 1.25 m wide and 4.35 m centre-to-centre. The interior continuation is uncertain, so no inner passage or second gateway is reconstructed in this remains view.",
          note: "The surviving gatehouse faces follow your description; their exact lengths remain approximate.",
        }
      : remains && baseFeature.id === "walls"
        ? {
            ...baseFeature,
            title: "Walls",
            kind: "Partial remains · user-described",
            text: "The wall immediately east of the gatehouse is shown as standing masonry. Shaded earthwork bands follow the eastern and western wall lines using the same alignment as the reconstruction. Their width and surviving extent are interpretive. Nothing is drawn along the southern wall.",
            note: "No corner bastions or smaller enclosure-wall pillars are drawn in this view. The three buttresses are confined to the gatehouse. The shaded bands represent interpreted ruin mounds, not intact walls or an independently surveyed outline. Their historical interpretation remains approximate.",
          }
        : baseFeature,
};
