import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, palette } from './kit';
import { TeX } from '../components/Math';

function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

export function DecisionTree() {
  const [n, setN] = useState(5);
  const fact = factorial(n);
  const need = Math.ceil(Math.log2(fact));
  const depths = Array.from({ length: Math.max(6, need + 2) }, (_, i) => i);
  const maxLeaves = 2 ** depths[depths.length - 1];
  return (
    <div>
      <Controls>
        <Slider label="elements n =" value={n} min={2} max={10} onChange={setN} />
      </Controls>
      <svg viewBox="0 0 340 170" className="vis-svg" style={{ maxHeight: 240 }}>
        {depths.map((h) => {
          const y = 12 + h * (150 / depths.length);
          const w = (Math.log2(2 ** h + 1) / Math.log2(maxLeaves + 1)) * 300;
          const enough = 2 ** h >= fact;
          return (
            <g key={h}>
              <rect
                x={10}
                y={y}
                width={Math.max(2, w)}
                height={150 / depths.length - 4}
                rx={2}
                fill={enough ? palette.b : palette.a}
                opacity={enough ? 0.95 : 0.75}
              />
              <text x={14} y={y + 11} fontSize="8" fill={palette.onFill}>
                depth {h}: {2 ** h} leaves
              </text>
            </g>
          );
        })}
        <line
          x1={10 + (Math.log2(fact + 1) / Math.log2(maxLeaves + 1)) * 300}
          y1={8}
          x2={10 + (Math.log2(fact + 1) / Math.log2(maxLeaves + 1)) * 300}
          y2={164}
          stroke={palette.d}
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <text
          x={Math.min(300, 14 + (Math.log2(fact + 1) / Math.log2(maxLeaves + 1)) * 300)}
          y={168}
          fontSize="9"
          fill={palette.d}
        >
          n! = {fact.toLocaleString()} orderings needed
        </text>
      </svg>
      <Readout
        items={[
          { label: 'orderings n!', value: fact.toLocaleString() },
          { label: 'log₂(n!)', value: Math.log2(fact).toFixed(2) },
          { label: 'comparisons needed', value: need, tone: 'ok' },
          { label: 'n log₂ n', value: (n * Math.log2(n)).toFixed(1) },
        ]}
      />
      <Caption>
        Each bar is one more comparison, doubling the leaves the decision tree can reach (note the
        logarithmic horizontal axis). The dashed line is the number of orderings the algorithm must be able
        to output. The first green bar is the shallowest possible tree — no comparison sort can be faster.
      </Caption>
    </div>
  );
}

export function RecursionTree() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [c, setC] = useState(1);
  const n = 64;
  const levels = Math.max(1, Math.round(Math.log(n) / Math.log(b)));
  const cStar = Math.log(a) / Math.log(b);
  const work = Array.from({ length: levels + 1 }, (_, j) => a ** j * (n / b ** j) ** c);
  const maxWork = Math.max(...work);
  const total = work.reduce((s, w) => s + w, 0);
  const verdict =
    Math.abs(c - cStar) < 1e-9
      ? { label: 'case 2 — every level ties', result: 'Θ(n^{c^*} \\log n)' }
      : c < cStar
        ? { label: 'case 1 — leaves dominate', result: 'Θ(n^{c^*})' }
        : { label: 'case 3 — root dominates', result: 'Θ(f(n))' };
  return (
    <div>
      <Controls>
        <Slider label="branching a =" value={a} min={1} max={8} onChange={setA} />
        <Slider label="shrink b =" value={b} min={2} max={4} onChange={setB} />
        <Slider label="f(n) = n^c, c =" value={c} min={0} max={3} step={0.5} onChange={setC} />
      </Controls>
      <svg viewBox="0 0 340 160" className="vis-svg" style={{ maxHeight: 240 }}>
        {work.map((w, j) => {
          const y = 6 + j * (150 / (levels + 1));
          const width = (w / maxWork) * 250;
          return (
            <g key={j}>
              <rect
                x={70}
                y={y}
                width={Math.max(1.5, width)}
                height={150 / (levels + 1) - 3}
                rx={2}
                fill={j === 0 ? palette.c : j === levels ? palette.b : palette.a}
                opacity={0.85}
              />
              <text x={8} y={y + 10} fontSize="8" fill={palette.dim}>
                level {j}: {a ** j} × ({(n / b ** j).toFixed(1)})
              </text>
            </g>
          );
        })}
      </svg>
      <Readout
        items={[
          { label: 'c* = log_b a', value: cStar.toFixed(3) },
          { label: 'c', value: c },
          { label: 'leaves', value: (a ** levels).toLocaleString() },
          { label: 'total work', value: total.toFixed(0) },
        ]}
      />
      <Caption>
        Bar width is the total work at that level: orange is the root (the combine step), green the leaves
        (the base cases). <b>{verdict.label}</b>, giving <TeX tex={verdict.result} />. Set{' '}
        <TeX tex="a = b = 2,\; c = 1" /> for merge sort and watch every bar become the same length.
      </Caption>
    </div>
  );
}

export function Amortized() {
  const [n, setN] = useState(20);
  const [growth, setGrowth] = useState<'double' | 'plus4'>('double');
  const series = useMemo(() => {
    const out: { cost: number; resized: boolean; capacity: number }[] = [];
    let cap = 1;
    let size = 0;
    for (let i = 0; i < n; i++) {
      let cost = 1;
      let resized = false;
      if (size === cap) {
        cost += cap;
        cap = growth === 'double' ? cap * 2 : cap + 4;
        resized = true;
      }
      size += 1;
      out.push({ cost, resized, capacity: cap });
    }
    return out;
  }, [n, growth]);
  const total = series.reduce((s, x) => s + x.cost, 0);
  const maxCost = Math.max(...series.map((s) => s.cost));
  return (
    <div>
      <Controls>
        <Slider label="appends n =" value={n} min={4} max={64} onChange={setN} />
        <Btn onClick={() => setGrowth('double')} active={growth === 'double'}>
          double capacity
        </Btn>
        <Btn onClick={() => setGrowth('plus4')} active={growth === 'plus4'}>
          grow by +4
        </Btn>
      </Controls>
      <svg viewBox="0 0 340 150" className="vis-svg" style={{ maxHeight: 220 }}>
        {series.map((s, i) => {
          const w = 320 / n;
          const h = (s.cost / maxCost) * 110;
          return (
            <rect
              key={i}
              x={10 + i * w}
              y={130 - h}
              width={Math.max(1, w - 1)}
              height={h}
              fill={s.resized ? palette.d : palette.a}
              rx={1}
            />
          );
        })}
        <line
          x1={10}
          y1={130 - ((total / n) / maxCost) * 110}
          x2={330}
          y2={130 - ((total / n) / maxCost) * 110}
          stroke={palette.b}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={12} y={126 - ((total / n) / maxCost) * 110} fontSize="9" fill={palette.b}>
          average cost {(total / n).toFixed(2)}
        </text>
        <text x={10} y={145} fontSize="8" fill={palette.dim}>
          each bar is one append; pink bars are resizes
        </text>
      </svg>
      <Readout
        items={[
          { label: 'total cost', value: total },
          { label: 'per append', value: (total / n).toFixed(2), tone: growth === 'double' ? 'ok' : 'bad' },
          { label: 'resizes', value: series.filter((s) => s.resized).length },
          { label: 'growth', value: growth === 'double' ? 'geometric' : 'arithmetic' },
        ]}
      />
      <Caption>
        With doubling, the average line stays flat as <TeX tex="n" /> grows — the spikes get taller but
        rarer at exactly the compensating rate. Switch to <TeX tex="+4" /> growth and the same slider makes
        the average climb: the resize costs are no longer a geometric series but a quadratic one.
      </Caption>
    </div>
  );
}

const CLAUSES: string[][] = [
  ['x', '¬y', 'z'],
  ['¬x', 'y', 'z'],
  ['x', 'y', '¬z'],
];

function negates(a: string, b: string) {
  return a === `¬${b}` || b === `¬${a}`;
}

export function Clique() {
  const [picked, setPicked] = useState<(number | null)[]>([0, null, null]);
  const points = CLAUSES.flatMap((clause, ci) =>
    clause.map((lit, li) => ({
      ci,
      li,
      lit,
      x: 40 + ci * 130,
      y: 30 + li * 45,
    })),
  );
  const edges = points.flatMap((u, i) =>
    points.slice(i + 1).filter((v) => v.ci !== u.ci && !negates(u.lit, v.lit)).map((v) => ({ u, v })),
  );
  const chosen = picked
    .map((li, ci) => (li === null ? null : points.find((p) => p.ci === ci && p.li === li)!))
    .filter((p): p is (typeof points)[number] => !!p);
  const complete =
    chosen.length === CLAUSES.length &&
    chosen.every((u, i) => chosen.slice(i + 1).every((v) => !negates(u.lit, v.lit)));
  const assignment = new Map<string, boolean>();
  for (const p of chosen) {
    const neg = p.lit.startsWith('¬');
    assignment.set(neg ? p.lit.slice(1) : p.lit, !neg);
  }
  return (
    <div>
      <Controls>
        <Btn onClick={() => setPicked([0, 1, 0])}>satisfying pick</Btn>
        <Btn onClick={() => setPicked([0, 0, 0])}>contradictory pick</Btn>
        <Btn onClick={() => setPicked([null, null, null])}>clear</Btn>
      </Controls>
      <div className="vis-formula">
        <TeX tex="\varphi = (x \vee \neg y \vee z) \wedge (\neg x \vee y \vee z) \wedge (x \vee y \vee \neg z)" />
      </div>
      <svg viewBox="0 0 340 170" className="vis-svg" style={{ maxHeight: 240 }}>
        {edges.map(({ u, v }, i) => {
          const on =
            chosen.includes(u) && chosen.includes(v) ? palette.b : palette.grid;
          return (
            <line
              key={i}
              x1={u.x}
              y1={u.y}
              x2={v.x}
              y2={v.y}
              stroke={on}
              strokeWidth={on === palette.b ? 2.4 : 0.8}
            />
          );
        })}
        {points.map((p) => {
          const isChosen = picked[p.ci] === p.li;
          return (
            <g key={`${p.ci}-${p.li}`} onClick={() => setPicked((old) => old.map((v, i) => (i === p.ci ? p.li : v)))} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={15}
                fill={isChosen ? palette.b : palette.sunk}
                stroke={isChosen ? '#fff' : palette.grid}
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill={isChosen ? palette.onFill : palette.text}>
                {p.lit}
              </text>
            </g>
          );
        })}
        {CLAUSES.map((_, ci) => (
          <text key={ci} x={40 + ci * 130} y={155} textAnchor="middle" fontSize="9" fill={palette.dim}>
            clause {ci + 1}
          </text>
        ))}
      </svg>
      <Readout
        items={[
          { label: 'vertices chosen', value: `${chosen.length} / ${CLAUSES.length}` },
          {
            label: 'is a clique?',
            value: complete ? 'yes' : 'no',
            tone: complete ? 'ok' : 'bad',
          },
          {
            label: 'assignment',
            value:
              complete && assignment.size
                ? [...assignment.entries()].map(([k, v]) => `${k}=${v ? 'T' : 'F'}`).join('  ')
                : '—',
          },
        ]}
      />
      <Caption>
        Click one literal per clause. Edges join literals from <em>different</em> clauses that are not each
        other&apos;s negation, so a triangle spanning all three columns is exactly a consistent choice of one
        true literal per clause — a satisfying assignment. The contradictory pick fails because{' '}
        <TeX tex="x" /> and <TeX tex="\neg x" /> are never adjacent.
      </Caption>
    </div>
  );
}
