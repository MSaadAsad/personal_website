"use client";

import { useState } from 'react';
import './ModelDiagrams.css';
import { researchData } from './ResearchExplorerData';

const LAYERS = Array.from({ length: 32 }, (_, i) => ({ number: i + 1, full: (i + 1) % 4 === 0 }));

function Arrow() {
  return <span className="model-arrow" aria-hidden="true">→</span>;
}

function DecoderGlyph({ x, y }: { x: number; y: number }) {
  return <g>{Array.from({ length: 5 }, (_, i) => <rect key={i} x={x} y={y + i * 7} width="82" height="5" className="inference-decoder-layer" />)}</g>;
}

export function InferenceDiagram() {
  return <figure className="model-diagram inference-paths" aria-labelledby="inference-diagram-title">
    <figcaption id="inference-diagram-title">Generating an answer vs. selecting one</figcaption>
    <div className="inference-visual-scroll">
      <svg className="inference-visual" viewBox="0 0 1000 350" role="img" aria-labelledby="inference-title inference-desc">
        <title id="inference-title">Repeated token generation versus a single decision evaluation</title>
        <desc id="inference-desc">On the left, each decoder evaluation generates one token, which is added to the next input. On the right, one evaluation scores the supplied A and B options. Token names are schematic, and no probability values or experimental results are implied.</desc>
        <defs><marker id="inference-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="currentColor" /></marker></defs>
        <text x="20" y="22" className="inference-heading">Autoregressive generation</text>
        <text x="605" y="22" className="inference-heading">Direct decision</text>
        <line x1="555" x2="555" y1="5" y2="330" className="inference-divider" />
        {[0, 1, 2].map(i => {
          const y = 76 + i * 77;
          return <g key={i}>
            <text x="20" y={y - 11} className="inference-small">Evaluation {i + 1}</text>
            <rect x="20" y={y} width="188" height="33" rx="2" className="inference-input" />
            <text x="32" y={y + 21} className="inference-text">{['Prompt', 'Prompt + t₁', 'Prompt + t₁ + t₂'][i]}</text>
            <path d={`M210 ${y + 16}H253`} className="inference-wire" markerEnd="url(#inference-arrow)" />
            <path d={`M343 ${y + 16}H412`} className="inference-wire" markerEnd="url(#inference-arrow)" />
            <DecoderGlyph x={259} y={y} />
            <rect x="419" y={y} width="52" height="33" rx="2" className="inference-token" />
            <text x="445" y={y + 21} textAnchor="middle" className="inference-token-label">{['t₁', 't₂', 't₃'][i]}</text>
            {i < 2 && <path d={`M473 ${y + 16}H505V${y + 51}H8V${y + 93}H18`} className="inference-feedback" markerEnd="url(#inference-arrow)" />}
          </g>;
        })}
        <text x="259" y="51" className="inference-small">Decoder</text>
        <text x="20" y="306" className="inference-small">Each new token becomes part of the next input.</text>
        <text x="20" y="329" className="inference-small">Repeat until the answer is complete.</text>
        <rect x="605" y="76" width="352" height="33" rx="2" className="inference-input" />
        <text x="621" y="97" className="inference-text">Context + question + A/B options</text>
        <path d="M781 111V151" className="inference-wire" markerEnd="url(#inference-arrow)" />
        <path d="M781 194V237" className="inference-wire" />
        <path d="M781 237H708V257" className="inference-wire" markerEnd="url(#inference-arrow)" />
        <path d="M781 237H872V257" className="inference-wire" markerEnd="url(#inference-arrow)" />
        <DecoderGlyph x={740} y={158} />
        <text x="846" y="167" className="inference-small">One decoder</text>
        <text x="846" y="187" className="inference-small">evaluation</text>
        <rect x="655" y="262" width="106" height="34" rx="2" className="inference-input" />
        <rect x="819" y="262" width="106" height="34" rx="2" className="inference-input" />
        <text x="708" y="284" textAnchor="middle" className="inference-text">Score A</text>
        <text x="872" y="284" textAnchor="middle" className="inference-text">Score B</text>
        <text x="605" y="329" className="inference-small">Read the option scores; no generated answer.</text>
      </svg>
    </div>
  </figure>;
}

type PatchEffect = { model: string; layer: number; d: number; group: string; mean_signed_logit_change: number; low: number; high: number };

export function JevK5Diagram() {
  const [selected, setSelected] = useState(12);
  const [depth, setDepth] = useState(2);
  const rows: PatchEffect[] = researchData.patching.filter((r: PatchEffect) => r.d === depth && r.group === 'query_names');
  const models = [{ name: 'JevK5 v0.3', color: '#0000EE', left: 350 }, { name: 'Qwen3.5-4B', color: '#4d5e76', left: 675 }];
  const effects = rows.filter(r => r.layer === selected);
  const minimum = Math.floor(Math.min(0, ...rows.map(r => r.low)) * 10) / 10;
  const maximum = Math.ceil(Math.max(.1, ...rows.map(r => r.high)) * 10) / 10;
  const X = (value: number, left: number) => left + (value - minimum) / (maximum - minimum) * 270;
  const Y = (layer: number) => 113 + (layer - 1) * 14;
  const ticks = Array.from({ length: 5 }, (_, i) => minimum + (maximum - minimum) * i / 4);
  const signed = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(3)}`;
  return <figure className="model-diagram causal-stack" aria-labelledby="jevk5-diagram-title">
    <figcaption id="jevk5-diagram-title">Where changing a hidden state changes the answer</figcaption>
    <div className="stack-controls" role="group" aria-label="Reasoning depth">
      {[1, 2, 3, 4].map(d => <button key={d} type="button" aria-pressed={depth === d}
        onClick={() => setDepth(d)}>{d} {d === 1 ? 'hop' : 'hops'}</button>)}
    </div>
    <div className="stack-scroll">
      <svg className="causal-stack-svg" viewBox="0 0 1000 625" role="group" aria-labelledby="stack-title stack-description">
        <title id="stack-title">Decoder structure and question-name patch effects at all 32 layers</title>
        <desc id="stack-description">The shared hybrid decoder is drawn as a vertical stack. Each row aligns with mean answer-margin shifts for JevK5 and Qwen; whiskers show pointwise 95 percent bootstrap intervals. Select a layer to inspect its values.</desc>
        <defs><marker id="stack-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="currentColor" /></marker></defs>
        <text x="150" y="20" textAnchor="middle" className="stack-small">Facts + question + options</text>
        <rect x="65" y="36" width="170" height="29" rx="2" className="stack-embedding" />
        <text x="150" y="55" textAnchor="middle" className="stack-label">Embeddings</text>
        <path d="M150 24 V35 M150 66 V101" className="stack-flow" markerEnd="url(#stack-arrow)" />
        <text x="25" y="95" className="stack-small">Layer</text>
        <text x="150" y="95" textAnchor="middle" className="stack-small">Hybrid decoder</text>
        <path d="M150 107 V554" className="stack-spine" />
        {models.map(model => <g key={model.name}>
          <text x={model.left} y="24" className="stack-model-name" fill={model.color}>{model.name}</text>
          <text x={model.left} y="48" className="stack-small">Source-answer margin change</text>
          {ticks.map((tick, i) => <g key={i}>
            <line x1={X(tick, model.left)} x2={X(tick, model.left)} y1="96" y2="559" className="stack-guide" />
            <text x={X(tick, model.left)} y="83" textAnchor="middle" className="stack-small">{tick.toFixed(1)}</text>
          </g>)}
          <line x1={X(0, model.left)} x2={X(0, model.left)} y1="96" y2="559" className="stack-zero" />
        </g>)}
        {LAYERS.map(layer => {
          const values = rows.filter(r => r.layer === layer.number);
          const label = `Layer ${layer.number}, ${layer.full ? 'full causal attention' : 'Gated DeltaNet'}. ${values.map(r => `${r.model}: ${signed(r.mean_signed_logit_change)} logits, 95 percent interval ${r.low.toFixed(3)} to ${r.high.toFixed(3)}`).join('. ')}`;
          return <g key={layer.number} role="button" tabIndex={0} aria-label={label}
            aria-pressed={selected === layer.number} aria-controls="layer-detail"
            className={`stack-row${selected === layer.number ? ' stack-row-selected' : ''}`}
            onClick={() => setSelected(layer.number)} onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(layer.number); }
            }}>
            <title>{label}</title>
            <rect x="17" y={Y(layer.number) - 7} width="950" height="14" className="stack-row-hit" />
            <text x="40" y={Y(layer.number) + 4} textAnchor="end" className="stack-layer-number">{String(layer.number).padStart(2, '0')}</text>
            <rect x="59" y={Y(layer.number) - 5} width="182" height="10" rx="1"
              className={`stack-block ${layer.full ? 'stack-attention' : 'stack-delta'}${selected === layer.number ? ' stack-block-selected' : ''}`} />
            {models.map(model => {
              const value = values.find(r => r.model === model.name)!;
              const zero = X(0, model.left), mean = X(value.mean_signed_logit_change, model.left), y = Y(layer.number);
              return <g key={model.name}>
                <rect x={Math.min(zero, mean)} y={y - 3.5} width={Math.max(.6, Math.abs(mean - zero))} height="7" fill={model.color} />
                <line x1={X(value.low, model.left)} x2={X(value.high, model.left)} y1={y} y2={y} stroke={model.color} className="stack-whisker" />
                {[value.low, value.high].map((v, i) => <line key={i} x1={X(v, model.left)} x2={X(v, model.left)} y1={y - 2.5} y2={y + 2.5} stroke={model.color} className="stack-whisker" />)}
              </g>;
            })}
          </g>;
        })}
        <path d="M150 554 V573" className="stack-flow" markerEnd="url(#stack-arrow)" />
        <text x="150" y="591" textAnchor="middle" className="stack-small">Final norm → A/B readout</text>
        <rect x="350" y="583" width="18" height="7" className="stack-block stack-delta" />
        <text x="378" y="591" className="stack-small">Gated DeltaNet</text>
        <rect x="560" y="583" width="18" height="7" className="stack-block stack-attention" />
        <text x="588" y="591" className="stack-small">Full attention</text>
      </svg>
    </div>
    <div className="stack-selection" id="layer-detail" aria-live="polite">
      <div className="stack-selected-label"><strong>Layer {selected}</strong><span>{selected % 4 === 0 ? 'Full causal attention' : 'Gated DeltaNet'} · question-name patch</span></div>
      <dl className="stack-selected-values">
        {effects.map(effect => <div key={effect.model}><dt>{effect.model}</dt>
          <dd>{signed(effect.mean_signed_logit_change)} <span>margin units</span></dd>
          <small>95% interval: {signed(effect.low)} to {signed(effect.high)}</small>
        </div>)}
      </dl>
    </div>
    <p className="stack-study-note">40 matched pairs per hop. Both models share this decoder layout; bars show causal effects, not attention weights.</p>
  </figure>;
}
