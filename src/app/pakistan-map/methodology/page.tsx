import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './methodology.css';

export const metadata: Metadata = {
  title: 'Data & Method — Naya Naqsha',
  description: 'Sources and calculation rules for Naya Naqsha.',
};

const external = { target: '_blank', rel: 'noreferrer' } as const;

function SourceRow({ number, indicator, source, rule }: { number:string; indicator:string; source:ReactNode; rule:string }) {
  return <div className="method-row" role="row">
    <span><i>{number}</i><strong>{indicator}</strong></span><span>{source}</span><span>{rule}</span>
  </div>;
}

export default function MethodologyPage() {
  return <main className="method-shell">
    <header><a href="/pakistan-map">← Back to map</a><span>NAYA NAQSHA · DATA NOTE</span></header>
    <section className="method-hero">
      <span>DATA &amp; METHOD · UPDATED 5 SEPTEMBER 2026</span>
      <h1>Sources and calculations</h1>
      <p>The map starts with district data and combines it into the boundaries you draw. A dash means unavailable, not zero.</p>
    </section>

    <section className="method-content">
      <article className="method-principles">
        <div><b>01</b><h2>Official</h2><p>Copied from, or recalculated directly from, a published government table.</p></div>
        <div><b>02</b><h2>Calculated</h2><p>Built from compatible published counts. Rates use the source table’s own denominator.</p></div>
        <div><b>≈</b><h2>Estimated</h2><p>Weighted from district survey rates or modelled data. These values carry an ≈ or “estimate” label.</p></div>
        <div><b>—</b><h2>Missing</h2><p>The source does not support this value. A dash never means zero.</p></div>
      </article>

      <article className="method-card">
        <span className="kicker">SOURCES</span><h2>What we use</h2>
        <div className="method-table" role="table" aria-label="Data sources and calculation rules">
          <div className="method-row method-head" role="row"><b>Indicator</b><b>Source</b><b>Use in Naya Naqsha</b></div>
          <SourceRow number="01" indicator="Population, age, language, religion, housing and basic services" source={<a href="https://www.pbs.gov.pk/result-excel/" {...external}>Pakistan Bureau of Statistics, Census 2023 ↗</a>} rule="District counts are summed. Shares are recalculated from summed counts. Census Tables 1, 5, 9, 11 and 23–25 are used." />
          <SourceRow number="02" indicator="Literacy, schooling, labour and living standards" source={<><a href="https://darbar.adaad.org/" {...external}>Data Darbar by Adaad ↗</a>, drawing on PBS Census and PSLM/HIES releases</>} rule="Data Darbar supplied the cleaned district series used by the map. Count fields are summed; district rates are population-weighted. Available HIES district observations are rural-only." />
          <SourceRow number="03" indicator="Deprivation, relative wealth and night lights" source={<><a href="https://darbar.adaad.org/" {...external}>Data Darbar by Adaad ↗</a>; Meta RWI, WorldPop and VIIRS source layers</>} rule="These are modelled or proxy measures. They are not GDP. The deprivation field is Data Darbar’s index, not Pakistan’s official national MPI." />
          <SourceRow number="04" indicator="AJK and Gilgit–Baltistan" source={<><a href="https://pndajk.gov.pk/uploadfiles/downloads/AJ%26K%20Statistical%20Year%20Book%202024%281%29.pdf" {...external}>AJK Statistical Year Book ↗</a>; <a href="https://src.pnd.gog.pk/GBatGlance/GBatGlance2023.pdf" {...external}>GB at a Glance ↗</a></>} rule="Official regional figures are used because PBS Census 2023 does not cover AJK or GB. Population is from 2017; social indicators range from 2016–17 to 2022 and keep their stated year." />
          <SourceRow number="05" indicator="Election results" source={<a href="https://www.ecp.gov.pk/" {...external}>Election Commission of Pakistan ↗</a>} rule="The 2018 and 2024 views replay directly elected general seats. Reserved seats are excluded. Regional panels use the relevant AJK and GB election results." />
          <SourceRow number="06" indicator="Administrative boundaries" source={<a href="https://github.com/abdullahumer1101/pkmapr" {...external}>pkmapr / OCHA boundary files ↗</a>} rule="Geometry is indicative. Statistical values remain tied to the district geography of their source year." />
        </div>
      </article>

      <div className="method-split">
        <article className="method-card">
          <span className="kicker">CALCULATIONS</span><h2>Combining districts</h2>
          <dl>
            <div><dt>Counts</dt><dd>Σ district counts</dd></div>
            <div><dt>Rates with counts</dt><dd>Σ numerator ÷ Σ denominator</dd></div>
            <div><dt>District-rate estimates</dt><dd>Σ(rate × population) ÷ Σ population</dd></div>
            <div><dt>Density</dt><dd>Σ population ÷ Σ area</dd></div>
            <div><dt>Household size</dt><dd>Σ population ÷ Σ estimated households</dd></div>
          </dl>
        </article>
        <article className="method-card">
          <span className="kicker">GEOGRAPHY</span><h2>Coverage rules</h2>
          <ul>
            <li>Divisions are totals of their member districts.</li>
            <li>Tehsil population is modelled. District-only rates shown for tehsil maps are estimates, not tehsil observations.</li>
            <li>Ambiguous tehsil matches remain unmatched.</li>
            <li>2017 AJK/GB population and 2023 Pakistan population may be ranked together, but are not added into one share.</li>
            <li>Missing values remain blank and never enter a total as zero.</li>
          </ul>
        </article>
      </div>

      <article className="method-card">
        <span className="kicker">POLITICS</span><h2>Replay and projection</h2>
        <p>Assembly charts reassign recorded constituency winners to the boundaries drawn by the user; they are not forecasts. A seat is counted only when its mapped districts stay together. The Senate chart is an equal-seat scenario for proposed provinces, not a claim about current law. Islamabad retains its federal representation; AJK and GB remain outside Pakistan’s federal Parliament.</p>
      </article>
    </section>
  </main>;
}
