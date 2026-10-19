'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { researchData } from './ResearchExplorerData';
import './ResearchExplorer.css';

type View = 'depth' | 'context' | 'patching';
type Point = { x: number; label: string; value: number; low?: number; high?: number; note?: string };
type Series = { name: string; color: string; dash?: string; points: Point[] };
const data = researchData as any;
const BLUE = '#fff';
const ELECTRIC = '#0000ee';
const INK = '#091a45';
const positions: [string, string][] = [
  ['query_names', 'Question names'], ['decision', 'Answer position'],
  ['bridge_entities', 'Bridge entities'], ['path_premises', 'Relevant premises'],
  ['distractor_premises', 'Distractor premises'],
];

function ChoiceGroup({ label, value, options, onChange }: {
  label: string; value: string; options: [string, string][]; onChange: (value: string) => void;
}) {
  return <div className="research-choice" role="group" aria-label={label}>
    <span className="research-choice-label">{label}</span>
    <div className="research-choice-options">
      {options.map(([id, title]) => <button key={id} type="button" aria-pressed={value === id}
        className={value === id ? 'selected' : ''} onClick={() => onChange(id)}>{title}</button>)}
    </div>
  </div>;
}

function LineChart({ title, subtitle, xLabel, yLabel, series, percent = false, zeroLine = false, referenceLine, scaleValues = [] }: {
  title: string; subtitle: string; xLabel: string; yLabel: string; series: Series[];
  percent?: boolean; zeroLine?: boolean; referenceLine?: { value: number; label: string }; scaleValues?: number[];
}) {
  const W = 900, H = 440, L = 82, R = 858, T = 92, B = 354;
  const points = series.flatMap(s => s.points);
  if (!points.length) return <div className="research-empty">No measurements for this view.</div>;
  const values = [...points.flatMap(p => [p.low ?? p.value, p.value, p.high ?? p.value]), ...scaleValues];
  if (referenceLine) values.push(referenceLine.value);
  let ymin = Math.min(...values), ymax = Math.max(...values);
  if (zeroLine) { ymin = Math.min(0, ymin); ymax = Math.max(0, ymax); }
  if (percent) { ymin = Math.max(0, ymin - 5); ymax = Math.min(100, ymax + 5); }
  else { const pad = (ymax - ymin || 1) * .13; ymin -= pad; ymax += pad; }
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  const xmin = Math.min(...points.map(p => p.x)), xmax = Math.max(...points.map(p => p.x));
  const xRange = xmax === xmin ? 1 : xmax - xmin;
  const X = (v: number) => L + (v - xmin) / xRange * (R - L);
  const Y = (v: number) => B - (v - ymin) / (ymax - ymin) * (B - T);
  const ticks = Array.from({ length: 5 }, (_, i) => ymin + (ymax - ymin) * i / 4);
  const fmt = (v: number) => percent ? `${Math.round(v)}%` : v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  const allTicks = Array.from(new Map(points.map(p => [p.x, p.label])).entries()).sort((a, b) => a[0] - b[0]);
  const xTicks = allTicks.length > 8 ? allTicks.filter(([x]) => x === xmin || x === xmax || x % 4 === 0) : allTicks;
  const path = (ps: Point[]) => ps.slice().sort((a, b) => a.x - b.x).map((p, i) => `${i ? 'L' : 'M'} ${X(p.x)} ${Y(p.value)}`).join(' ');
  return <svg className="research-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
    <text x="34" y="30" className="research-chart-title">{title}</text>
    <text x="34" y="53" className="research-chart-subtitle">{subtitle}</text>
    {ticks.map((v, i) => <g key={i}><line x1={L} x2={R} y1={Y(v)} y2={Y(v)} className="chart-grid" />
      <text x={L - 12} y={Y(v) + 4} textAnchor="end" className="chart-tick">{fmt(v)}</text></g>)}
    {referenceLine && <line x1={L} x2={R} y1={Y(referenceLine.value)} y2={Y(referenceLine.value)} className="chart-reference" />}
    {zeroLine && ymin < 0 && ymax > 0 && <line x1={L} x2={R} y1={Y(0)} y2={Y(0)} className="chart-reference" />}
    <line x1={L} x2={R} y1={B} y2={B} className="chart-axis" />
    {xTicks.map(([x, label]) => <text key={x} x={X(x)} y={B + 22} textAnchor="middle" className="chart-tick">{label}</text>)}
    {series.map((s, si) => <g key={s.name}>
      {s.points.length > 1 && <><path d={path(s.points)} fill="none" stroke={INK} strokeWidth="7" strokeDasharray={s.dash} strokeLinecap="round" strokeLinejoin="round" />
        <path d={path(s.points)} fill="none" stroke={s.color} strokeWidth="3.3" strokeDasharray={s.dash} strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {s.points.map(p => <g key={`${s.name}-${p.x}`}>
        {p.low !== undefined && p.high !== undefined && <><line x1={X(p.x)} x2={X(p.x)} y1={Y(p.low)} y2={Y(p.high)} stroke={INK} strokeWidth="6" />
          <line x1={X(p.x)} x2={X(p.x)} y1={Y(p.low)} y2={Y(p.high)} stroke={s.color} strokeWidth="2.4" /></>}
        <circle cx={X(p.x)} cy={Y(p.value)} r="6" fill={s.color} stroke={INK} strokeWidth="2.8">
          <title>{`${s.name} · ${xLabel}: ${p.label} · ${yLabel}: ${p.value.toFixed(3)}${p.low !== undefined && p.high !== undefined ? ` · 95% interval: ${p.low.toFixed(3)} to ${p.high.toFixed(3)}` : ''}${p.note ? ` · ${p.note}` : ''}`}</title>
        </circle>
      </g>)}
      <g transform={`translate(${L + si * 260} 78)`}>
        <line x1="0" x2="24" y1="0" y2="0" stroke={INK} strokeWidth="7" strokeDasharray={s.dash} />
        <line x1="0" x2="24" y1="0" y2="0" stroke={s.color} strokeWidth="3.3" strokeDasharray={s.dash} />
        <circle cx="12" cy="0" r="5.5" fill={s.color} stroke={INK} strokeWidth="2.5" />
        <text x="33" y="4" className="chart-legend">{s.name}</text>
      </g>
    </g>)}
    {referenceLine && <g transform={`translate(${L + series.length * 260} 78)`}>
      <line x1="0" x2="24" y1="0" y2="0" className="chart-reference" />
      <text x="33" y="4" className="chart-reference-label">{referenceLine.label}</text>
    </g>}
    <text x={(L + R) / 2} y="417" textAnchor="middle" className="chart-label">{xLabel.toUpperCase()}</text>
    <text transform={`translate(22 ${(T + B) / 2}) rotate(-90)`} textAnchor="middle" className="chart-label">{yLabel.toUpperCase()}</text>
  </svg>;
}

export default function ResearchExplorer({ view = 'depth' }: { view?: View }) {
  const figureRef = useRef<HTMLElement>(null);
  const [patchLayer, setPatchLayer] = useState('12');
  const [patchAxis, setPatchAxis] = useState('depths');
  const [patchDepth, setPatchDepth] = useState('2');
  const [contextDepth, setContextDepth] = useState('1');
  const [patchPosition, setPatchPosition] = useState('query_names');

  const chart = useMemo(() => {
    let title = '', subtitle = '', xLabel = '', yLabel = '', percent = false, zeroLine = false;
    let series: Series[] = [], scaleValues: number[] = [];
    if (view === 'depth') {
      title = 'Accuracy declines as relational chains get longer';
      subtitle = '300 balanced questions per depth and model · 25 premises';
      xLabel = 'Relational hops'; yLabel = 'Accuracy'; percent = true;
      const models = ['JevK5 v0.3', 'Qwen3.5-4B'];
      series = models.map((m, i) => ({ name: m, color: i ? BLUE : ELECTRIC, dash: i ? '8 6' : undefined,
        points: data.depth.filter((r: any) => r.model === m).map((r: any) => ({ x: r.depth, label: `${r.depth}`, value: r.accuracy * 100,
          low: r.accuracy_lo * 100, high: r.accuracy_hi * 100, note: `n=${r.n}` })) }));
    } else if (view === 'context') {
      const depth = Number(contextDepth);
      title = 'Accuracy with added irrelevant context';
      subtitle = `${depth}-hop questions · 300 paired items per model`;
      xLabel = 'Off-path premises'; yLabel = 'Accuracy'; percent = true;
      series = ['JevK5 v0.3', 'Qwen3.5-4B'].map((model, i) => ({ name: model,
        color: i ? BLUE : ELECTRIC, dash: i ? '8 6' : undefined,
        points: data.context.filter((r: any) => r.model === model && r.depth === depth)
          .map((r: any) => ({ x: r.off_path, label: `${r.off_path}`, value: r.accuracy * 100,
            low: r.accuracy_lo * 100, high: r.accuracy_hi * 100, note: `n=${r.n}; total premises=${r.premises}` })) }));
    } else {
      const layer = Number(patchLayer), depth = Number(patchDepth);
      const position = positions.find(([key]) => key === patchPosition)?.[1] ?? patchPosition;
      title = 'Effect of activation patching';
      subtitle = `${position} · ${patchAxis === 'layers' ? `${depth} hops · all 32 layers` : `layer ${layer} · 1–4 hops`}`;
      xLabel = patchAxis === 'layers' ? 'Decoder layer' : 'Source depth (hops)';
      yLabel = 'Source-answer margin change'; zeroLine = true;
      series = ['JevK5 v0.3', 'Qwen3.5-4B'].map((model, i) => ({ name: model,
        color: i ? BLUE : ELECTRIC, dash: i ? '8 6' : undefined,
        points: data.patching.filter((r: any) => r.model === model && r.group === patchPosition &&
          (patchAxis === 'layers' ? r.d === depth : r.layer === layer))
          .map((r: any) => ({ x: patchAxis === 'layers' ? r.layer : r.d,
            label: `${patchAxis === 'layers' ? r.layer : r.d}`, value: r.mean_signed_logit_change,
            low: r.low, high: r.high, note: `n=${r.n}; layer=${r.layer}; hops=${r.d}` })) }));
      if (patchAxis === 'depths') scaleValues = data.patching.filter((r: any) => r.group === patchPosition)
        .flatMap((r: any) => [r.low, r.high]);
    }
    return { title, subtitle, xLabel, yLabel, series, percent, zeroLine, scaleValues,
      referenceLine: view === 'depth' ? { value: 50, label: '50% chance' } : undefined };
  }, [view, patchLayer, patchPosition, patchAxis, patchDepth, contextDepth]);

  useEffect(() => {
    const figure = figureRef.current;
    const article = figure?.closest('article');
    if (!figure || !article) return;
    const update = () => {
      const a = article.getBoundingClientRect();
      const boxes = Array.from(article.querySelectorAll<HTMLElement>('.research-figure'));
      let path = `M0 0H${a.width}V${a.height}H0Z`;
      for (const box of boxes) {
        const rect = box.getBoundingClientRect();
        const x = rect.left - a.left, y = rect.top - a.top;
        path += `M${x} ${y}h${rect.width}v${rect.height}h-${rect.width}Z`;
      }
      // One transparent hole per figure; all holes reveal the same existing sky.
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="0 0 ${a.width} ${a.height}"><path fill="white" fill-rule="evenodd" d="${path}"/></svg>`;
      article.style.setProperty('--research-cutout-mask', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
      article.classList.add('research-cutout');
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(article);
    article.querySelectorAll('.research-figure').forEach(box => observer.observe(box));
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect(); window.removeEventListener('resize', update);
      if (article.querySelector('.research-figure')) requestAnimationFrame(update);
      else { article.classList.remove('research-cutout'); article.style.removeProperty('--research-cutout-mask'); }
    };
  }, []);

  return <figure ref={figureRef} className="research-figure" data-view={view}>
    <div className="research-card">
      {view === 'context' && <div className="research-controls">
        <ChoiceGroup label="Hops" value={contextDepth} options={['1', '2', '3', '4'].map(d => [d, d])} onChange={setContextDepth} />
      </div>}
      {view === 'patching' && <div className="research-controls">
        <ChoiceGroup label="Plot" value={patchAxis} options={[["layers", "Across layers"], ["depths", "Across depths"]]} onChange={setPatchAxis} />
        {patchAxis === 'layers' ?
          <ChoiceGroup label="Hops" value={patchDepth} options={(patchPosition === 'bridge_entities' ? ['2', '3', '4'] : ['1', '2', '3', '4']).map(d => [d, d])} onChange={setPatchDepth} /> :
          <label className="research-layer-range"><span>Layer {patchLayer}</span>
            <input type="range" min="1" max="32" step="1" value={patchLayer} aria-label="Decoder layer" onChange={e => setPatchLayer(e.target.value)} />
          </label>}
        <ChoiceGroup label="Position" value={patchPosition} options={positions} onChange={value => {
          setPatchPosition(value); if (value === 'bridge_entities' && patchDepth === '1') setPatchDepth('2');
        }} />
      </div>}
      <LineChart {...chart} />
      {view === 'patching' && <div className="research-footnote" aria-live="polite">
        {view === 'patching' && <>40 matched pairs per hop · positive = toward donor answer · pointwise 95% bootstrap intervals.</>}
      </div>}
    </div>
  </figure>;
}
