import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, makeRng, palette } from './kit';
import { TeX } from '../components/Math';

const ARRAY = [2, 5, 8, 12, 16, 23, 38, 41, 56, 67, 72, 88, 91, 95, 99];

export function BinarySearch() {
  const [target, setTarget] = useState(41);
  const [state, setState] = useState({ lo: 0, hi: ARRAY.length, steps: 0, done: false, found: -1 });
  const mid = Math.floor((state.lo + state.hi) / 2);
  function step() {
    if (state.done) return;
    if (state.lo >= state.hi) {
      setState({ ...state, done: true, found: -1 });
      return;
    }
    const v = ARRAY[mid];
    if (v === target) setState({ ...state, steps: state.steps + 1, done: true, found: mid });
    else if (v < target) setState({ ...state, lo: mid + 1, steps: state.steps + 1 });
    else setState({ ...state, hi: mid, steps: state.steps + 1 });
  }
  function reset(t = target) {
    setTarget(t);
    setState({ lo: 0, hi: ARRAY.length, steps: 0, done: false, found: -1 });
  }
  const invariantHolds =
    state.found >= 0 || !ARRAY.includes(target) || (ARRAY.indexOf(target) >= state.lo && ARRAY.indexOf(target) < state.hi);
  return (
    <div>
      <Controls>
        <Slider
          label="target ="
          value={ARRAY.indexOf(target) >= 0 ? ARRAY.indexOf(target) : 0}
          min={0}
          max={ARRAY.length - 1}
          onChange={(i) => reset(ARRAY[i])}
          format={(i) => String(ARRAY[i])}
        />
        <Btn onClick={step} disabled={state.done}>
          compare once
        </Btn>
        <Btn onClick={() => reset()}>reset</Btn>
      </Controls>
      <div className="vis-cells">
        {ARRAY.map((v, i) => {
          const live = i >= state.lo && i < state.hi;
          const isMid = live && i === mid && !state.done;
          return (
            <span
              key={i}
              className={`vis-cell${live ? ' is-live' : ' is-dead'}${isMid ? ' is-mid' : ''}${
                state.found === i ? ' is-found' : ''
              }`}
            >
              {v}
            </span>
          );
        })}
      </div>
      <Readout
        items={[
          { label: 'window [lo, hi)', value: `[${state.lo}, ${state.hi})` },
          { label: 'width (decreasing)', value: state.hi - state.lo },
          { label: 'comparisons', value: state.steps },
          { label: 'invariant', value: invariantHolds ? 'holds' : 'violated', tone: invariantHolds ? 'ok' : 'bad' },
          {
            label: 'result',
            value: state.done ? (state.found >= 0 ? `found at ${state.found}` : 'absent') : 'searching',
          },
        ]}
      />
      <Caption>
        Grey cells have been <em>proved</em> irrelevant — sortedness means the target cannot hide there.
        The invariant "if the target exists it lies in the blue window" is never violated, and the width
        strictly decreases, so the loop must end. Those two facts are the entire correctness proof.
      </Caption>
    </div>
  );
}

export function Quicksort() {
  const [n, setN] = useState(24);
  const [seed, setSeed] = useState(11);
  const [gap, setGap] = useState(3);
  const result = useMemo(() => {
    const rng = makeRng(seed);
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let comparisons = 0;
    const depths: number[] = Array(n).fill(0);
    const sort = (a: number[], depth: number): number[] => {
      if (a.length <= 1) return a;
      const pivotIdx = Math.floor(rng() * a.length);
      const pivot = a[pivotIdx];
      depths[pivot - 1] = depth;
      const left: number[] = [];
      const right: number[] = [];
      a.forEach((v, i) => {
        if (i === pivotIdx) return;
        comparisons++;
        if (v < pivot) left.push(v);
        else right.push(v);
      });
      return [...sort(left, depth + 1), pivot, ...sort(right, depth + 1)];
    };
    sort(arr, 0);
    return { comparisons, depths };
  }, [n, seed]);
  const predicted = 2 * n * Math.log(n);
  const pairProb = 2 / (gap + 1);
  return (
    <div>
      <Controls>
        <Slider label="n =" value={n} min={4} max={60} onChange={setN} />
        <Btn onClick={() => setSeed((s) => s + 1)}>new random pivots</Btn>
        <Slider label="pair gap j−i =" value={gap} min={1} max={Math.max(1, n - 1)} onChange={setGap} />
      </Controls>
      <svg viewBox="0 0 340 120" className="vis-svg" style={{ maxHeight: 180 }}>
        {result.depths.map((d, i) => {
          const w = 320 / n;
          const maxD = Math.max(...result.depths, 1);
          const h = ((maxD - d) / maxD) * 90 + 6;
          return (
            <rect key={i} x={10 + i * w} y={104 - h} width={Math.max(1, w - 1)} height={h} rx={1} fill={palette.a} opacity={0.75} />
          );
        })}
        <text x={10} y={116} fontSize="8" fill={palette.dim}>
          bar height = how early each element became a pivot (taller = closer to the root)
        </text>
      </svg>
      <Readout
        items={[
          { label: 'comparisons this run', value: result.comparisons },
          { label: '2n ln n', value: predicted.toFixed(0) },
          { label: 'n²/2 (worst case)', value: ((n * n) / 2).toFixed(0), tone: 'warn' },
          {
            label: `Pr[compare pair with gap ${gap}]`,
            value: `2/${gap + 1} = ${pairProb.toFixed(3)}`,
            tone: 'ok',
          },
        ]}
      />
      <Caption>
        Reroll the pivots: the comparison count hovers near <TeX tex="2n\ln n" /> and never approaches the
        quadratic worst case. Two elements are compared only if one of them is the first pivot drawn from
        the interval between them, so distant pairs (large gap) are increasingly unlikely to ever meet —
        that <TeX tex="2/(j-i+1)" /> is the whole proof.
      </Caption>
    </div>
  );
}

type Node = { id: string; x: number; y: number };
type Edge = { a: string; b: string; w: number };

const NODES: Node[] = [
  { id: 's', x: 30, y: 80 },
  { id: 'a', x: 110, y: 30 },
  { id: 'b', x: 110, y: 130 },
  { id: 'c', x: 200, y: 80 },
  { id: 'd', x: 280, y: 30 },
  { id: 'e', x: 290, y: 130 },
];

const EDGES: Edge[] = [
  { a: 's', b: 'a', w: 4 },
  { a: 's', b: 'b', w: 2 },
  { a: 'a', b: 'b', w: 1 },
  { a: 'a', b: 'c', w: 5 },
  { a: 'b', b: 'c', w: 8 },
  { a: 'c', b: 'd', w: 3 },
  { a: 'c', b: 'e', w: 6 },
  { a: 'd', b: 'e', w: 2 },
];

function nodeAt(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function Dijkstra() {
  const [settled, setSettled] = useState<string[]>([]);
  const [negative, setNegative] = useState(false);
  const edges = negative ? EDGES.map((e) => (e.a === 'a' && e.b === 'c' ? { ...e, w: -3 } : e)) : EDGES;
  const dist = useMemo(() => {
    const d = new Map<string, number>(NODES.map((n) => [n.id, Infinity]));
    d.set('s', 0);
    const done = new Set<string>();
    for (const id of settled) {
      done.add(id);
      for (const e of edges) {
        for (const [u, v] of [
          [e.a, e.b],
          [e.b, e.a],
        ]) {
          if (u !== id) continue;
          const cand = d.get(id)! + e.w;
          if (cand < d.get(v)!) d.set(v, cand);
        }
      }
    }
    return d;
  }, [settled, edges]);
  const next = NODES.filter((n) => !settled.includes(n.id)).sort(
    (x, y) => dist.get(x.id)! - dist.get(y.id)!,
  )[0];
  return (
    <div>
      <Controls>
        <Btn
          onClick={() => next && setSettled((s) => [...s, next.id])}
          disabled={!next || dist.get(next.id) === Infinity}
        >
          extract nearest
        </Btn>
        <Btn onClick={() => setSettled([])}>reset</Btn>
        <Btn onClick={() => { setNegative((v) => !v); setSettled([]); }} active={negative}>
          make a→c weight −3
        </Btn>
      </Controls>
      <svg viewBox="0 0 340 170" className="vis-svg" style={{ maxHeight: 260 }}>
        {edges.map((e, i) => {
          const u = nodeAt(e.a);
          const v = nodeAt(e.b);
          const active = settled.includes(e.a) || settled.includes(e.b);
          return (
            <g key={i}>
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={e.w < 0 ? palette.d : active ? palette.a : palette.grid}
                strokeWidth={active ? 2.2 : 1.2}
              />
              <text
                x={(u.x + v.x) / 2}
                y={(u.y + v.y) / 2 - 4}
                fontSize="9"
                fill={e.w < 0 ? palette.d : palette.dim}
                textAnchor="middle"
              >
                {e.w}
              </text>
            </g>
          );
        })}
        {NODES.map((nd) => {
          const isSettled = settled.includes(nd.id);
          const d = dist.get(nd.id)!;
          return (
            <g key={nd.id}>
              <circle
                cx={nd.x}
                cy={nd.y}
                r={16}
                fill={isSettled ? palette.b : next && next.id === nd.id ? '#2f3d5c' : '#1d2537'}
                stroke={isSettled ? '#fff' : palette.grid}
                strokeWidth={1.4}
              />
              <text x={nd.x} y={nd.y + 4} textAnchor="middle" fontSize="11" fill={isSettled ? '#0b0f18' : palette.text}>
                {nd.id}
              </text>
              <text x={nd.x} y={nd.y - 20} textAnchor="middle" fontSize="9" fill={palette.c}>
                {d === Infinity ? '∞' : d}
              </text>
            </g>
          );
        })}
      </svg>
      <Readout
        items={[
          { label: 'settled', value: settled.join(' → ') || '—' },
          { label: 'next to extract', value: next ? `${next.id} (d = ${dist.get(next.id)})` : 'done' },
          {
            label: negative ? 'labels trustworthy?' : 'weights',
            value: negative ? 'no — c settles too early' : 'all non-negative',
            tone: negative ? 'bad' : 'ok',
          },
        ]}
      />
      <Caption>
        Extract repeatedly: each newly filled node is settled with its final distance, and the yellow
        labels only ever improve for unsettled nodes. Turn edge <TeX tex="a \to c" /> negative and the
        greedy order breaks — <TeX tex="c" /> gets settled at 8 while a later relaxation would have given 1,
        pinpointing where the proof used non-negativity.
      </Caption>
    </div>
  );
}

export function MstCut() {
  const [threshold, setThreshold] = useState(150);
  const crossing = EDGES.filter((e) => {
    const u = nodeAt(e.a).x < threshold;
    const v = nodeAt(e.b).x < threshold;
    return u !== v;
  });
  const lightest = crossing.reduce<Edge | null>((best, e) => (!best || e.w < best.w ? e : best), null);
  // Kruskal over the fixed graph
  const mst = useMemo(() => {
    const parent = new Map(NODES.map((n) => [n.id, n.id]));
    const find = (x: string): string => (parent.get(x) === x ? x : find(parent.get(x)!));
    const chosen: Edge[] = [];
    for (const e of [...EDGES].sort((p, q) => p.w - q.w)) {
      const ra = find(e.a);
      const rb = find(e.b);
      if (ra !== rb) {
        parent.set(ra, rb);
        chosen.push(e);
      }
    }
    return chosen;
  }, []);
  const inMst = lightest ? mst.some((e) => e.a === lightest.a && e.b === lightest.b) : false;
  return (
    <div>
      <Controls>
        <Slider label="cut position" value={threshold} min={60} max={290} onChange={setThreshold} />
      </Controls>
      <svg viewBox="0 0 340 170" className="vis-svg" style={{ maxHeight: 260 }}>
        <line x1={threshold} y1={4} x2={threshold} y2={166} stroke={palette.c} strokeDasharray="6 4" strokeWidth={2} />
        {EDGES.map((e, i) => {
          const u = nodeAt(e.a);
          const v = nodeAt(e.b);
          const isCross = crossing.includes(e);
          const isLight = lightest === e;
          const isMst = mst.includes(e);
          return (
            <g key={i}>
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isLight ? palette.b : isCross ? palette.c : isMst ? palette.a : palette.grid}
                strokeWidth={isLight ? 3.4 : isMst ? 2.2 : 1}
                strokeDasharray={isCross && !isLight ? '3 3' : ''}
              />
              <text x={(u.x + v.x) / 2} y={(u.y + v.y) / 2 - 4} fontSize="9" fill={palette.dim} textAnchor="middle">
                {e.w}
              </text>
            </g>
          );
        })}
        {NODES.map((nd) => (
          <g key={nd.id}>
            <circle
              cx={nd.x}
              cy={nd.y}
              r={15}
              fill={nd.x < threshold ? '#22304d' : '#1d2537'}
              stroke={palette.grid}
            />
            <text x={nd.x} y={nd.y + 4} textAnchor="middle" fontSize="11" fill={palette.text}>
              {nd.id}
            </text>
          </g>
        ))}
      </svg>
      <Readout
        items={[
          { label: 'edges crossing', value: crossing.map((e) => `${e.a}${e.b}(${e.w})`).join(' ') || '—' },
          { label: 'lightest crossing', value: lightest ? `${lightest.a}${lightest.b} = ${lightest.w}` : '—' },
          { label: 'in the MST?', value: inMst ? 'yes' : 'n/a', tone: inMst ? 'ok' : 'warn' },
          { label: 'MST weight', value: mst.reduce((s, e) => s + e.w, 0) },
        ]}
      />
      <Caption>
        Slide the cut anywhere. Dashed yellow edges cross it; the thick green one is the lightest crossing
        edge, and it is always a blue MST edge. Any spanning tree omitting it would contain a cycle that
        crosses the cut twice, and swapping in the green edge would strictly reduce the total weight.
      </Caption>
    </div>
  );
}

type FlowEdge = { a: string; b: string; cap: number; flow: number };

const FNODES: Node[] = [
  { id: 's', x: 24, y: 85 },
  { id: 'u', x: 120, y: 32 },
  { id: 'v', x: 120, y: 138 },
  { id: 'w', x: 220, y: 32 },
  { id: 'x', x: 220, y: 138 },
  { id: 't', x: 314, y: 85 },
];

const FEDGES: FlowEdge[] = [
  { a: 's', b: 'u', cap: 10, flow: 0 },
  { a: 's', b: 'v', cap: 8, flow: 0 },
  { a: 'u', b: 'v', cap: 2, flow: 0 },
  { a: 'u', b: 'w', cap: 5, flow: 0 },
  { a: 'v', b: 'x', cap: 10, flow: 0 },
  { a: 'w', b: 't', cap: 7, flow: 0 },
  { a: 'x', b: 'w', cap: 4, flow: 0 },
  { a: 'x', b: 't', cap: 6, flow: 0 },
];

function fnodeAt(id: string) {
  return FNODES.find((n) => n.id === id)!;
}

export function MaxFlow() {
  const [flow, setFlow] = useState<FlowEdge[]>(FEDGES.map((e) => ({ ...e })));
  const residualNeighbours = (id: string) => {
    const out: { to: string; edge: FlowEdge; forward: boolean }[] = [];
    for (const e of flow) {
      if (e.a === id && e.cap - e.flow > 0) out.push({ to: e.b, edge: e, forward: true });
      if (e.b === id && e.flow > 0) out.push({ to: e.a, edge: e, forward: false });
    }
    return out;
  };
  const bfs = () => {
    const prev = new Map<string, { from: string; edge: FlowEdge; forward: boolean }>();
    const seen = new Set<string>(['s']);
    const queue = ['s'];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of residualNeighbours(cur)) {
        if (seen.has(nb.to)) continue;
        seen.add(nb.to);
        prev.set(nb.to, { from: cur, edge: nb.edge, forward: nb.forward });
        queue.push(nb.to);
      }
    }
    return { prev, reachable: seen };
  };
  const { prev, reachable } = bfs();
  const hasPath = reachable.has('t');
  const augment = () => {
    if (!hasPath) return;
    const path: { edge: FlowEdge; forward: boolean }[] = [];
    let cur = 't';
    while (cur !== 's') {
      const step = prev.get(cur)!;
      path.push({ edge: step.edge, forward: step.forward });
      cur = step.from;
    }
    const bottleneck = Math.min(
      ...path.map(({ edge, forward }) => (forward ? edge.cap - edge.flow : edge.flow)),
    );
    setFlow((old) =>
      old.map((e) => {
        const on = path.find((p) => p.edge.a === e.a && p.edge.b === e.b);
        if (!on) return e;
        return { ...e, flow: e.flow + (on.forward ? bottleneck : -bottleneck) };
      }),
    );
  };
  const value = flow.filter((e) => e.a === 's').reduce((s, e) => s + e.flow, 0);
  const cutEdges = flow.filter((e) => reachable.has(e.a) && !reachable.has(e.b));
  const cutCapacity = cutEdges.reduce((s, e) => s + e.cap, 0);
  return (
    <div>
      <Controls>
        <Btn onClick={augment} disabled={!hasPath}>
          augment along a path
        </Btn>
        <Btn onClick={() => setFlow(FEDGES.map((e) => ({ ...e })))}>reset</Btn>
      </Controls>
      <svg viewBox="0 0 340 175" className="vis-svg" style={{ maxHeight: 265 }}>
        {flow.map((e, i) => {
          const u = fnodeAt(e.a);
          const v = fnodeAt(e.b);
          const saturated = e.flow === e.cap;
          const inCut = cutEdges.includes(e);
          return (
            <g key={i}>
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={inCut ? palette.d : saturated ? palette.c : e.flow > 0 ? palette.b : palette.grid}
                strokeWidth={1 + (e.flow / e.cap) * 4}
              />
              <text x={(u.x + v.x) / 2} y={(u.y + v.y) / 2 - 5} fontSize="9" textAnchor="middle" fill={palette.dim}>
                {e.flow}/{e.cap}
              </text>
            </g>
          );
        })}
        {FNODES.map((nd) => (
          <g key={nd.id}>
            <circle
              cx={nd.x}
              cy={nd.y}
              r={15}
              fill={!hasPath && reachable.has(nd.id) ? '#3a2a3f' : '#1d2537'}
              stroke={reachable.has(nd.id) && !hasPath ? palette.d : palette.grid}
              strokeWidth={1.4}
            />
            <text x={nd.x} y={nd.y + 4} textAnchor="middle" fontSize="11" fill={palette.text}>
              {nd.id}
            </text>
          </g>
        ))}
      </svg>
      <Readout
        items={[
          { label: 'flow value', value: value },
          { label: 'augmenting path left?', value: hasPath ? 'yes' : 'no', tone: hasPath ? 'warn' : 'ok' },
          { label: 'min cut capacity', value: hasPath ? '—' : cutCapacity, tone: hasPath ? undefined : 'ok' },
          { label: 'cut edges', value: hasPath ? '—' : cutEdges.map((e) => `${e.a}${e.b}`).join(' ') },
        ]}
      />
      <Caption>
        Augment until no path remains. At that moment the pink nodes are exactly those still reachable in
        the residual graph, and the pink edges leaving them are all saturated — so their total capacity
        equals the flow value. The cut is a certificate that no larger flow exists.
      </Caption>
    </div>
  );
}
