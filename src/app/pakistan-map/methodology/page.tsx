import type { Metadata } from 'next';
import './methodology.css';

export const metadata: Metadata = {
  title: 'Data Methodology — Naya Naqsha',
  description: 'Sources, aggregation rules, assumptions, and limitations for Naya Naqsha.',
};

const rows = [
  ['Population, sex and urban/rural counts', 'PBS Census 2023, principally Tables 1 and 5', 'Published district counts are summed. Density is summed population divided by summed area; percentages are recomputed from summed numerators and denominators.'],
  ['Language and religion', 'PBS Census 2023, Tables 11 and 9', 'Published category counts are summed before percentages are calculated. These tables exclude some restricted-area records, so their denominator can be below the headline population.'],
  ['Age structure', 'PBS Census 2023, Table 5', 'Published age-group counts are summed, then shares and dependency ratios are recomputed from those counts. The Table 5 universe can differ slightly from the headline Table 1 population, so its own denominator is retained.'],
  ['Water, sanitation and housing', 'PBS Census 2023, Tables 23–25', 'Published household counts are summed, then rates are recomputed from the corresponding table household denominator. Missing districts are omitted rather than treated as zero.'],
  ['Literacy and out-of-school children', 'PBS Census 2023 district tables via Data Darbar', 'Literacy is recomputed from literate and illiterate counts. Out-of-school figures are summed only where a published district count exists.'],
  ['Matric attainment and labour indicators', 'PBS Census 2023 district indicators via Data Darbar', 'Only district percentages are available in the working dataset. Custom-unit figures are population-weighted estimates, not published province totals.'],
  ['Enrolment, numeracy, consumption, food insecurity, internet and electricity', 'PSLM/HIES district indicators via Data Darbar', 'The available district observations are rural-only. Custom-unit figures are population-weighted rural estimates; they are not estimates of the full urban-and-rural population.'],
  ['Deprivation', 'Data Darbar district deprivation data', 'Shown as the Data Darbar deprivation index. It is population-weighted for custom units and must not be read as Pakistan’s official national MPI.'],
  ['Tehsil population, wealth and night lights', 'Data Darbar; Meta relative wealth, WorldPop and VIIRS', 'Tehsil population and wealth are modeled estimates; night radiance is a remote-sensing proxy. These are exploratory indicators, not census counts or GDP.'],
] as const;

export default function MethodologyPage() {
  return <main className="method-shell">
    <header><a href="/pakistan-map">← Back to map</a><span>NAYA NAQSHA · DATA NOTE</span></header>
    <section className="method-hero">
      <span>METHODOLOGY · UPDATED 4 SEPTEMBER 2026</span>
      <h1>What the numbers mean</h1>
      <p>Naya Naqsha combines administrative boundaries with several statistical products. It keeps each indicator tied to one definition and source family; it does not replace missing observations with zero or silently substitute a newer province total into an older district table.</p>
    </section>

    <section className="method-content">
      <article className="method-principles">
        <div><b>01</b><h2>Published</h2><p>A value copied or recomputed directly from canonical table counts. Published counts are additive when their geography, date, and universe match.</p></div>
        <div><b>02</b><h2>Derived</h2><p>A value calculated from published numerators and denominators—for example population density or a combined household-service rate. The formula is stated below.</p></div>
        <div><b>03</b><h2>Estimate</h2><p>A value inferred from district percentages, survey observations, or modeled data. Estimates use the ≈ mark or an explicit “estimate” label.</p></div>
        <div><b>—</b><h2>Unavailable</h2><p>A dash means the source does not support the requested geography or definition. It never means zero.</p></div>
      </article>

      <article className="method-card">
        <span className="kicker">SOURCE REGISTER</span><h2>Indicators and aggregation</h2>
        <div className="method-table" role="table" aria-label="Indicator sources and aggregation rules">
          <div className="method-row method-head" role="row"><b>Indicator</b><b>Canonical source</b><b>Rule used here</b></div>
          {rows.map(([indicator,source,rule],index)=><div className="method-row" role="row" key={indicator}><span><i>{String(index+1).padStart(2,'0')}</i><strong>{indicator}</strong></span><span>{source}</span><span>{rule}</span></div>)}
        </div>
      </article>

      <div className="method-split">
        <article className="method-card">
          <span className="kicker">GEOGRAPHY</span><h2>Districts, divisions and tehsils</h2>
          <ul>
            <li>The statistical base is the district geography used by PBS Census 2023. Later administrative notifications do not rewrite the underlying census tables.</li>
            <li>Division values are reconstructed from their member districts. Exact-count indicators are summed; rates follow the rule listed above. A source table’s own denominator is retained even when it differs from the headline population.</li>
            <li>For tehsil-built maps, tehsil population determines how much of a district belongs to each proposed unit. District-only social rates are inherited as estimates and are not described as tehsil observations.</li>
            <li>Tehsil matching accepts exact names and a small, explicit list of historical renames. Ambiguous records remain unmatched.</li>
            <li>Boundary geometry comes from <a href="https://github.com/abdullahumer1101/pkmapr" target="_blank" rel="noreferrer">pkmapr/OCHA ↗</a>. Boundaries are indicative and may lag legal notifications.</li>
          </ul>
        </article>
        <article className="method-card">
          <span className="kicker">FORMULAS</span><h2>How combined values are made</h2>
          <dl>
            <div><dt>Count</dt><dd>Σ district counts</dd></div>
            <div><dt>Rate with counts</dt><dd>Σ numerator ÷ Σ denominator</dd></div>
            <div><dt>District-rate estimate</dt><dd>Σ(rate × matched population) ÷ Σ matched population</dd></div>
            <div><dt>Density</dt><dd>Σ population ÷ Σ area</dd></div>
            <div><dt>Household size</dt><dd>Σ population ÷ Σ(population ÷ district household size)</dd></div>
            <div><dt>Annual growth</dt><dd>Combined 2017 base is reconstructed from district growth rates, then compounded to 2023. It remains approximate because published rates are rounded.</dd></div>
          </dl>
        </article>
      </div>

      <div className="method-split">
        <article className="method-card">
          <span className="kicker">AJK &amp; GILGIT–BALTISTAN</span><h2>Different statistical systems</h2>
          <p>Pakistan’s PBS 2023 district tables do not cover AJK or Gilgit–Baltistan. Naya Naqsha therefore uses the latest compatible official regional material available in the project: 2017 population, AJK PSLM 2019–20 social indicators, and GB MICS/official summary indicators from 2016–17 through 2022.</p>
          <p>Values from 2017 and 2023 may be ranked side by side with their dates shown, but they are not combined into a population composition or percentage total. Where a historical district was later split, its value is used only if all successor districts remain together.</p>
        </article>
        <article className="method-card">
          <span className="kicker">ELECTIONS</span><h2>Replays, not forecasts</h2>
          <p>The 2018 and 2024 assembly views replay directly elected general-seat winners from Election Commission of Pakistan results against the user’s boundaries. Reserved seats are excluded. A constituency spanning several districts is counted only when those districts stay together.</p>
          <p>The Senate display is a proportional equal-seat scenario for proposed provinces, not a constitutional or legal forecast. Islamabad keeps its actual federal status; AJK and GB remain outside Pakistan’s federal Parliament. Regional assembly panels use their respective election-commission results and exclude seats that cannot be mapped geographically.</p>
        </article>
      </div>

      <article className="method-card sources">
        <span className="kicker">PRIMARY SOURCES</span><h2>Links</h2>
        <div><a href="https://www.pbs.gov.pk/result-excel/" target="_blank" rel="noreferrer">PBS Census 2023 tables ↗</a><a href="https://www.pbs.gov.pk/wp-content/uploads/2020/07/National-Census-Report-2023.pdf" target="_blank" rel="noreferrer">National Census Report 2023 ↗</a><a href="https://www.pbs.gov.pk/hies/" target="_blank" rel="noreferrer">PBS HIES / PSLM ↗</a><a href="https://darbar.adaad.org/" target="_blank" rel="noreferrer">Data Darbar ↗</a><a href="https://www.ecp.gov.pk/" target="_blank" rel="noreferrer">Election Commission of Pakistan ↗</a><a href="https://src.pnd.gog.pk/GBatGlance/GBatGlance2023.pdf" target="_blank" rel="noreferrer">Gilgit–Baltistan at a Glance ↗</a><a href="https://pndajk.gov.pk/uploadfiles/downloads/AJ%26K%20Statistical%20Year%20Book%202024%281%29.pdf" target="_blank" rel="noreferrer">AJK Statistical Year Book ↗</a></div>
      </article>
    </section>
  </main>;
}
