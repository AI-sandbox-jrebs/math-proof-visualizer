import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, palette } from './kit';
import { TeX } from '../components/Math';

const RING = 6;
const ringPos = (i: number, n = RING, r = 62, cx = 170, cy = 85) => ({
  x: cx + r * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
  y: cy + r * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
});

export function Handshake() {
  const [edges, setEdges] = useState<[number, number][]>([
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 3],
    [3, 5],
  ]);
  const [pending, setPending] = useState<number | null>(null);
  const degree = Array.from({ length: RING }, (_, i) => edges.filter(([a, b]) => a === i || b === i).length);
  const sum = degree.reduce((s, d) => s + d, 0);
  const odd = degree.filter((d) => d % 2 === 1).length;
  const click = (i: number) => {
    if (pending === null) {
      setPending(i);
      return;
    }
    if (pending === i) {
      setPending(null);
      return;
    }
    const key: [number, number] = [Math.min(pending, i), Math.max(pending, i)];
    setEdges((old) =>
      old.some(([a, b]) => a === key[0] && b === key[1])
        ? old.filter(([a, b]) => !(a === key[0] && b === key[1]))
        : [...old, key],
    );
    setPending(null);
  };
  return (
    <div>
      <Controls>
        <Btn onClick={() => setEdges([])}>clear</Btn>
        <Btn
          onClick={() =>
            setEdges(
              Array.from({ length: RING }, (_, i) => [i, (i + 1) % RING] as [number, number]),
            )
          }
        >
          cycle
        </Btn>
        <Btn
          onClick={() => {
            const all: [number, number][] = [];
            for (let i = 0; i < RING; i++) for (let j = i + 1; j < RING; j++) all.push([i, j]);
            setEdges(all);
          }}
        >
          complete
        </Btn>
      </Controls>
      <svg viewBox="0 0 340 170" className="vis-svg" style={{ maxHeight: 250 }}>
        {edges.map(([a, b], i) => {
          const u = ringPos(a);
          const v = ringPos(b);
          return <line key={i} x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={palette.a} strokeWidth={1.8} />;
        })}
        {Array.from({ length: RING }, (_, i) => {
          const p = ringPos(i);
          const isOdd = degree[i] % 2 === 1;
          return (
            <g key={i} onClick={() => click(i)} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={16}
                fill={pending === i ? palette.c : isOdd ? '#3a2a3f' : '#1d2537'}
                stroke={isOdd ? palette.d : palette.grid}
                strokeWidth={1.6}
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill={palette.text}>
                {degree[i]}
              </text>
            </g>
          );
        })}
        <text x={170} y={166} textAnchor="middle" fontSize="9" fill={palette.dim}>
          click two vertices to toggle an edge — labels are degrees, pink means odd
        </text>
      </svg>
      <Readout
        items={[
          { label: 'Σ deg(v)', value: sum },
          { label: '2|E|', value: 2 * edges.length, tone: sum === 2 * edges.length ? 'ok' : 'bad' },
          { label: 'odd-degree vertices', value: odd, tone: odd % 2 === 0 ? 'ok' : 'bad' },
        ]}
      />
      <Caption>
        Build any graph you like: the two counters always agree, and the number of pink (odd) vertices is
        always even. Toggling one edge changes exactly two degrees, so it flips the parity of two vertices
        at once — the count of odd vertices can only move by <TeX tex="0" /> or <TeX tex="\pm 2" />.
      </Caption>
    </div>
  );
}

type MultiEdge = { a: number; b: number; bend: number; id: string };

const LAND = [
  { id: 0, name: 'north', x: 170, y: 26 },
  { id: 1, name: 'island', x: 100, y: 92 },
  { id: 2, name: 'south', x: 170, y: 152 },
  { id: 3, name: 'east', x: 268, y: 92 },
];

const BRIDGES: MultiEdge[] = [
  { a: 0, b: 1, bend: -18, id: 'b1' },
  { a: 0, b: 1, bend: 18, id: 'b2' },
  { a: 1, b: 2, bend: -18, id: 'b3' },
  { a: 1, b: 2, bend: 18, id: 'b4' },
  { a: 0, b: 3, bend: 0, id: 'b5' },
  { a: 2, b: 3, bend: 0, id: 'b6' },
  { a: 1, b: 3, bend: 0, id: 'b7' },
];

const EXTRA: MultiEdge = { a: 0, b: 2, bend: 60, id: 'b8' };

export function Euler() {
  const [extra, setExtra] = useState(false);
  const [walked, setWalked] = useState<string[]>([]);
  const bridges = extra ? [...BRIDGES, EXTRA] : BRIDGES;
  const degree = LAND.map((l) => bridges.filter((b) => b.a === l.id || b.b === l.id).length);
  const oddCount = degree.filter((d) => d % 2 === 1).length;
  const remaining = bridges.filter((b) => !walked.includes(b.id));
  const current = (() => {
    if (!walked.length) return null;
    // reconstruct the endpoint of the walk
    let at = bridges.find((b) => b.id === walked[0])!.a;
    for (const id of walked) {
      const e = bridges.find((b) => b.id === id)!;
      at = e.a === at ? e.b : e.a;
    }
    return at;
  })();
  const tryWalk = (e: MultiEdge) => {
    if (walked.includes(e.id)) return;
    if (current === null || e.a === current || e.b === current) setWalked((w) => [...w, e.id]);
  };
  return (
    <div>
      <Controls>
        <Btn onClick={() => { setExtra((v) => !v); setWalked([]); }} active={extra}>
          {extra ? 'remove the 8th bridge' : 'add an 8th bridge'}
        </Btn>
        <Btn onClick={() => setWalked([])}>restart walk</Btn>
      </Controls>
      <svg viewBox="0 0 340 175" className="vis-svg" style={{ maxHeight: 260 }}>
        {bridges.map((e) => {
          const u = LAND[e.a];
          const v = LAND[e.b];
          const mx = (u.x + v.x) / 2 + e.bend;
          const my = (u.y + v.y) / 2 - Math.abs(e.bend) * 0.2;
          const used = walked.includes(e.id);
          const reachable = current === null || e.a === current || e.b === current;
          return (
            <path
              key={e.id}
              d={`M ${u.x} ${u.y} Q ${mx} ${my} ${v.x} ${v.y}`}
              fill="none"
              stroke={used ? palette.b : reachable ? palette.c : palette.grid}
              strokeWidth={used ? 3 : 1.8}
              style={{ cursor: used ? 'default' : 'pointer' }}
              onClick={() => tryWalk(e)}
            />
          );
        })}
        {LAND.map((l, i) => (
          <g key={l.id}>
            <circle
              cx={l.x}
              cy={l.y}
              r={17}
              fill={current === l.id ? palette.c : degree[i] % 2 ? '#3a2a3f' : '#20362f'}
              stroke={palette.grid}
            />
            <text x={l.x} y={l.y + 4} textAnchor="middle" fontSize="11" fill={palette.text}>
              {degree[i]}
            </text>
            <text x={l.x} y={l.y + 30} textAnchor="middle" fontSize="8" fill={palette.dim}>
              {l.name}
            </text>
          </g>
        ))}
      </svg>
      <Readout
        items={[
          { label: 'bridges', value: bridges.length },
          { label: 'odd-degree landmasses', value: oddCount, tone: oddCount === 0 ? 'ok' : 'bad' },
          { label: 'bridges walked', value: `${walked.length} / ${bridges.length}` },
          {
            label: 'Euler circuit exists?',
            value: oddCount === 0 ? 'yes' : 'no',
            tone: oddCount === 0 ? 'ok' : 'bad',
          },
        ]}
      />
      <Caption>
        Click bridges to walk them; only bridges touching your current landmass (yellow) are available.
        Königsberg&apos;s four landmasses have degrees 3, 3, 3, 5 — all odd — so you always strand yourself with{' '}
        {remaining.length > 0 ? `${remaining.length} bridge(s)` : 'bridges'} unused. Add the eighth bridge to
        make every degree even and the tour becomes possible from anywhere.
      </Caption>
    </div>
  );
}

export function Bipartite() {
  const [n, setN] = useState(5);
  const [chord, setChord] = useState(false);
  const colours = useMemo(() => Array.from({ length: n }, (_, i) => i % 2), [n]);
  const cycleOdd = n % 2 === 1;
  const conflict = cycleOdd ? [n - 1, 0] : chord ? [0, 2] : null;
  return (
    <div>
      <Controls>
        <Slider label="cycle length =" value={n} min={3} max={10} onChange={setN} />
        <Btn onClick={() => setChord((v) => !v)} active={chord}>
          add a chord 0–2
        </Btn>
      </Controls>
      <svg viewBox="0 0 340 175" className="vis-svg" style={{ maxHeight: 260 }}>
        {Array.from({ length: n }, (_, i) => {
          const u = ringPos(i, n, 62, 170, 88);
          const v = ringPos((i + 1) % n, n, 62, 170, 88);
          const bad = conflict && conflict[0] === i && conflict[1] === (i + 1) % n;
          return (
            <line
              key={i}
              x1={u.x}
              y1={u.y}
              x2={v.x}
              y2={v.y}
              stroke={bad ? palette.d : palette.grid}
              strokeWidth={bad ? 3 : 1.5}
            />
          );
        })}
        {chord ? (
          <line
            x1={ringPos(0, n, 62, 170, 88).x}
            y1={ringPos(0, n, 62, 170, 88).y}
            x2={ringPos(2 % n, n, 62, 170, 88).x}
            y2={ringPos(2 % n, n, 62, 170, 88).y}
            stroke={palette.d}
            strokeWidth={3}
          />
        ) : null}
        {Array.from({ length: n }, (_, i) => {
          const p = ringPos(i, n, 62, 170, 88);
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={15}
                fill={colours[i] === 0 ? palette.a : palette.c}
                stroke="#0b0f18"
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill="#0b0f18">
                {i}
              </text>
            </g>
          );
        })}
      </svg>
      <Readout
        items={[
          { label: 'cycle parity', value: cycleOdd ? 'odd' : 'even', tone: cycleOdd ? 'bad' : 'ok' },
          {
            label: '2-colourable?',
            value: cycleOdd || chord ? 'no' : 'yes',
            tone: cycleOdd || chord ? 'bad' : 'ok',
          },
          {
            label: 'certificate',
            value: cycleOdd ? `odd cycle of length ${n}` : chord ? 'odd cycle 0–1–2' : 'proper colouring',
          },
        ]}
      />
      <Caption>
        Colour by distance parity from vertex 0. On an even cycle the colours alternate all the way round
        and close consistently. On an odd cycle the last edge joins two vertices of the same colour (pink),
        and that edge plus the path back is precisely the odd cycle certifying non-bipartiteness. A chord
        does the same thing by creating a short odd cycle.
      </Caption>
    </div>
  );
}
