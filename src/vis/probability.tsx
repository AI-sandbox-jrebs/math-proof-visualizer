import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, makeRng, palette } from './kit';
import { TeX } from '../components/Math';

export function Linearity() {
  const [n, setN] = useState(8);
  const [trials, setTrials] = useState(200);
  const [seed, setSeed] = useState(5);
  const sim = useMemo(() => {
    const rng = makeRng(seed);
    let fixed = 0;
    let lastPerm: number[] = [];
    for (let t = 0; t < trials; t++) {
      const perm = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [perm[i], perm[j]] = [perm[j], perm[i]];
      }
      fixed += perm.filter((v, i) => v === i).length;
      lastPerm = perm;
    }
    return { mean: fixed / trials, lastPerm };
  }, [n, trials, seed]);
  const harmonic = Array.from({ length: n }, (_, i) => 1 / (i + 1)).reduce((s, x) => s + x, 0);
  return (
    <div>
      <Controls>
        <Slider label="items n =" value={n} min={2} max={20} onChange={setN} />
        <Slider label="trials =" value={trials} min={20} max={2000} step={20} onChange={setTrials} />
        <Btn onClick={() => setSeed((s) => s + 1)}>reshuffle</Btn>
      </Controls>
      <div className="vis-perm">
        {sim.lastPerm.map((v, i) => (
          <span key={i} className={`vis-perm-cell${v === i ? ' is-fixed' : ''}`}>
            {v}
          </span>
        ))}
      </div>
      <Readout
        items={[
          { label: 'E[fixed points] (theory)', value: '1.000', tone: 'ok' },
          { label: 'empirical mean', value: sim.mean.toFixed(3) },
          { label: 'Pr[item i fixed]', value: `1/${n}` },
          { label: 'coupon collector nHₙ', value: (n * harmonic).toFixed(2) },
        ]}
      />
      <Caption>
        The indicators "item <TeX tex="i" /> stays put" are heavily dependent — knowing{' '}
        <TeX tex="n-1" /> of them determines the last — yet their expectations still add. Each contributes{' '}
        <TeX tex="1/n" />, so the expected number of fixed points is exactly <TeX tex="1" /> for every{' '}
        <TeX tex="n" />. Raise the trial count and the empirical mean converges to that flat line.
      </Caption>
    </div>
  );
}

type Dist = { label: string; support: number[]; probs: number[] };

const DISTS: Dist[] = [
  { label: 'uniform 0…9', support: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], probs: Array(10).fill(0.1) },
  {
    label: 'geometric-ish',
    support: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    probs: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.0156, 0.0078, 0.0039, 0.002, 0.0022],
  },
  { label: 'two-point (tight)', support: [0, 8], probs: [0.75, 0.25] },
];

export function Markov() {
  const [which, setWhich] = useState(0);
  const [t, setT] = useState(4);
  const dist = DISTS[which];
  const mean = dist.support.reduce((s, v, i) => s + v * dist.probs[i], 0);
  const tail = dist.support.reduce((s, v, i) => (v >= t ? s + dist.probs[i] : s), 0);
  const bound = mean / t;
  const maxP = Math.max(...dist.probs);
  return (
    <div>
      <Controls>
        {DISTS.map((d, i) => (
          <Btn key={d.label} active={which === i} onClick={() => setWhich(i)}>
            {d.label}
          </Btn>
        ))}
        <Slider label="threshold t =" value={t} min={1} max={9} onChange={setT} />
      </Controls>
      <svg viewBox="0 0 340 140" className="vis-svg" style={{ maxHeight: 200 }}>
        {dist.support.map((v, i) => {
          const x = 20 + v * 30;
          const h = (dist.probs[i] / maxP) * 96;
          return (
            <g key={v}>
              <rect
                x={x}
                y={110 - h}
                width={22}
                height={h}
                rx={2}
                fill={v >= t ? palette.d : palette.a}
                opacity={0.9}
              />
              <text x={x + 11} y={124} fontSize="9" textAnchor="middle" fill={palette.dim}>
                {v}
              </text>
            </g>
          );
        })}
        <line x1={14 + t * 30} y1={8} x2={14 + t * 30} y2={112} stroke={palette.c} strokeDasharray="4 3" />
        <text x={16 + t * 30} y={16} fontSize="9" fill={palette.c}>
          t = {t}
        </text>
        <line x1={20 + mean * 30} y1={8} x2={20 + mean * 30} y2={112} stroke={palette.b} strokeWidth={1.5} />
        <text x={22 + mean * 30} y={30} fontSize="9" fill={palette.b}>
          mean {mean.toFixed(2)}
        </text>
      </svg>
      <Readout
        items={[
          { label: 'E[X]', value: mean.toFixed(3) },
          { label: 'Pr[X ≥ t] (true)', value: tail.toFixed(3) },
          { label: 'Markov bound E[X]/t', value: bound.toFixed(3), tone: bound >= tail ? 'ok' : 'bad' },
          { label: 'slack', value: (bound - tail).toFixed(3) },
        ]}
      />
      <Caption>
        The bound always dominates the true tail (green mean, yellow threshold, pink mass at or above{' '}
        <TeX tex="t" />). Pick the two-point distribution with <TeX tex="t = 8" /> and the slack collapses to
        zero — all the mass above the threshold sits exactly at it, which is the equality case showing Markov
        cannot be improved in general.
      </Caption>
    </div>
  );
}

const BINS = [
  { label: '365 days', m: 365 },
  { label: '2¹⁶ hashes', m: 65536 },
  { label: '10⁶ ids', m: 1000000 },
];

export function Birthday() {
  const [which, setWhich] = useState(0);
  const m = BINS[which].m;
  const [n, setN] = useState(23);
  const exact = useMemo(() => {
    let p = 1;
    for (let i = 0; i < n; i++) p *= 1 - i / m;
    return p;
  }, [n, m]);
  const bound = Math.exp((-n * (n - 1)) / (2 * m));
  const threshold = Math.ceil(1.1774 * Math.sqrt(m));
  const maxN = Math.min(m, Math.ceil(3 * Math.sqrt(m)));
  const curve = Array.from({ length: 60 }, (_, i) => {
    const k = Math.round((i / 59) * maxN);
    let p = 1;
    for (let j = 0; j < k; j++) p *= 1 - j / m;
    return { k, collide: 1 - p };
  });
  return (
    <div>
      <Controls>
        {BINS.map((b, i) => (
          <Btn key={b.label} active={which === i} onClick={() => { setWhich(i); setN(Math.ceil(1.1774 * Math.sqrt(b.m))); }}>
            {b.label}
          </Btn>
        ))}
        <Slider label="items n =" value={Math.min(n, maxN)} min={1} max={maxN} onChange={setN} />
      </Controls>
      <svg viewBox="0 0 340 140" className="vis-svg" style={{ maxHeight: 200 }}>
        <polyline
          points={curve.map((c) => `${14 + (c.k / maxN) * 312},${118 - c.collide * 104}`).join(' ')}
          fill="none"
          stroke={palette.a}
          strokeWidth={2}
        />
        <line x1={14} y1={118 - 0.5 * 104} x2={326} y2={118 - 0.5 * 104} stroke={palette.grid} strokeDasharray="3 3" />
        <text x={300} y={118 - 0.5 * 104 - 4} fontSize="8" fill={palette.dim}>
          50%
        </text>
        <line
          x1={14 + (Math.min(n, maxN) / maxN) * 312}
          y1={10}
          x2={14 + (Math.min(n, maxN) / maxN) * 312}
          y2={120}
          stroke={palette.c}
          strokeWidth={1.5}
        />
        <line
          x1={14 + (threshold / maxN) * 312}
          y1={10}
          x2={14 + (threshold / maxN) * 312}
          y2={120}
          stroke={palette.b}
          strokeDasharray="4 3"
        />
        <text x={14 + (threshold / maxN) * 312 + 3} y={22} fontSize="8" fill={palette.b}>
          1.18√m = {threshold}
        </text>
        <text x={14} y={134} fontSize="8" fill={palette.dim}>
          probability of at least one collision, as items are added
        </text>
      </svg>
      <Readout
        items={[
          { label: 'bins m', value: m.toLocaleString() },
          { label: 'Pr[collision]', value: (1 - exact).toFixed(4), tone: 1 - exact > 0.5 ? 'bad' : 'ok' },
          { label: 'bound on no-collision', value: bound.toFixed(4) },
          { label: 'expected colliding pairs', value: (((n * (n - 1)) / 2 / m)).toFixed(3) },
        ]}
      />
      <Caption>
        The curve rises steeply well before <TeX tex="n" /> approaches <TeX tex="m" />: the crossing point
        sits at <TeX tex="1.18\sqrt{m}" /> (dashed green). With <TeX tex="2^{16}" /> hash values, roughly 300
        items already make a collision likely — the reason a <TeX tex="b" />-bit digest only buys{' '}
        <TeX tex="b/2" /> bits of collision resistance.
      </Caption>
    </div>
  );
}
