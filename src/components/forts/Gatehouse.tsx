const BUTTRESS_WIDTH = 1.25;
const BUTTRESS_SPACING = 4.35;
// Corner centres span 8.7 m; including the 1.25 m buttresses gives 9.95 m overall. The gatehouse walls terminate on those corner centres.
const GATE_BUTTRESSES = [35 - BUTTRESS_SPACING, 35, 35 + BUTTRESS_SPACING];
export function GateButtresses() {
  return (
    <g
      aria-label="Three gatehouse buttresses, 1.25 metres wide and 4.35 metres centre-to-centre"
      data-gate-buttresses="true"
    >
      {GATE_BUTTRESSES.map((x) => (
        <circle key={x} cx={x} cy="-6" r={BUTTRESS_WIDTH / 2} fill="#111111" />
      ))}
    </g>
  );
}
// The gate occupies x=30.65..39.35 m between corner buttress centres and projects an estimated 6 m outward.
// Gaps in the east and inner walls are both 2.5 m wide and meet at 90 degrees.
const GATE_WALLS = "M30.65 0V-6H39.35V-4.25M39.35 -1.75V0H36.25M33.75 0H30.65";
export function Gatehouse({ detail = false }: { detail?: boolean }) {
  return (
    <g>
      <path d="M30.65 0V-6H39.35V0Z" fill="#f2f2ef" />
      <path
        d={GATE_WALLS}
        strokeLinecap="square"
        stroke="#111111"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="miter"
      />
      <path
        d={GATE_WALLS}
        strokeLinecap="square"
        stroke="#111111"
        strokeWidth=".72"
        fill="none"
      />
      <path
        d="M39.35 -4.25h-1.1M39.35 -1.75h-1.1M33.75 0v-1.1M36.25 0v-1.1"
        stroke="#111111"
        strokeWidth=".25"
        fill="none"
      />
      <GateButtresses />
      <path
        d="M45 -3H35V3.5M34.45 2.7L35 3.5L35.55 2.7"
        fill="none"
        stroke="#555555"
        strokeWidth=".2"
        strokeDasharray=".6 .35"
      />
      {detail && (
        <g className="pf-gate-annotations">
          <path
            d="M30.65 -7.5V-8H39.35V-7.5M35 -7.5V-8"
            fill="none"
            stroke="#988771"
            strokeWidth=".08"
          />
          <text x="32.825" y="-8.5" textAnchor="middle">
            4.35 m c/c
          </text>
          <text x="37.175" y="-8.5" textAnchor="middle">
            4.35 m c/c
          </text>
          <text x="35" y="-10.5" textAnchor="middle">
            ≈10 m overall
          </text>
          <path
            d="M30 -9.5V-10H40V-9.5"
            stroke="#988771"
            strokeWidth=".08"
            fill="none"
          />
          <path
            d="M28.8 -6H28.3V0H28.8"
            stroke="#988771"
            strokeWidth=".08"
            fill="none"
          />
          <text transform="translate(27.7 -3) rotate(-90)" textAnchor="middle">
            6 m · estimated
          </text>
          <text x="35" y="5.2" textAnchor="middle">
            INTO THE FORT
          </text>
          <text x="43.5" y="-3.9" textAnchor="middle">
            ENTRY
          </text>
          <text x="31" y="-3">
            90°
          </text>
          <path
            d="M33 -3V-1H35"
            fill="none"
            stroke="#555555"
            strokeWidth=".1"
          />
        </g>
      )}
    </g>
  );
}
