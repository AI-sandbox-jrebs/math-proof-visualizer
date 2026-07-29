import { useMemo, useRef, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, palette } from './kit';
import { TeX } from '../components/Math';

export function Pythagoras() {
  const [a, setA] = useState(60);
  const [b, setB] = useState(90);
  const [t, setT] = useState(0); // 0 = arrangement A, 1 = arrangement B
  const S = a + b;
  const scale = 150 / S;
  const c = Math.hypot(a, b);
  const A = (v: number) => v * scale + 10;
  // triangle corners for the two arrangements, interpolated by t
  const tri = (i: number) => {
    const arrangements: [number, number][][] = [
      // arrangement A: four triangles forming two rectangles
      [
        [0, 0],
        [a, 0],
        [a, b],
      ],
      [
        [a, 0],
        [a + b, 0],
        [a, b],
      ],
      [
        [a + b, b],
        [a, b],
        [a + b, b + a],
      ],
      [
        [a, b],
        [a, b + a],
        [a + b, b + a],
      ],
    ];
    const arrangementB: [number, number][][] = [
      [
        [0, 0],
        [b, 0],
        [0, a],
      ],
      [
        [b, 0],
        [S, 0],
        [S, b],
      ],
      [
        [S, b],
        [S, S],
        [a, S],
      ],
      [
        [0, a],
        [a, S],
        [0, S],
      ],
    ];
    return arrangements[i].map(([x, y], k) => {
      const [x2, y2] = arrangementB[i][k];
      return [x + (x2 - x) * t, y + (y2 - y) * t] as [number, number];
    });
  };
  return (
    <div>
      <Controls>
        <Slider label="leg a =" value={a} min={30} max={110} onChange={setA} />
        <Slider label="leg b =" value={b} min={30} max={110} onChange={setB} />
        <Slider label="rearrange" value={t} min={0} max={1} step={0.02} onChange={setT} format={(v) => (v < 0.5 ? 'A' : 'B')} />
      </Controls>
      <svg viewBox="0 0 340 175" className="vis-svg" style={{ maxHeight: 260 }}>
        <rect x={10} y={10} width={S * scale} height={S * scale} fill="#141a28" stroke={palette.grid} />
        {[0, 1, 2, 3].map((i) => (
          <polygon
            key={i}
            points={tri(i)
              .map(([x, y]) => `${A(x)},${A(y)}`)
              .join(' ')}
            fill={palette.a}
            opacity={0.85}
            stroke="#0b0f18"
          />
        ))}
        <text x={180} y={30} fontSize="10" fill={palette.text}>
          container side a + b = {S}
        </text>
        <text x={180} y={48} fontSize="10" fill={palette.dim}>
          uncovered area = {(S * S - 2 * a * b).toFixed(0)}
        </text>
        <text x={180} y={68} fontSize="10" fill={palette.b}>
          {t < 0.5 ? `a² + b² = ${a * a} + ${b * b} = ${a * a + b * b}` : `c² = ${(c * c).toFixed(0)}`}
        </text>
        <text x={180} y={90} fontSize="9" fill={palette.dim}>
          same square, same four triangles
        </text>
        <text x={180} y={104} fontSize="9" fill={palette.dim}>
          so the leftovers are equal
        </text>
      </svg>
      <Readout
        items={[
          { label: 'a² + b²', value: a * a + b * b },
          { label: 'c²', value: (c * c).toFixed(0), tone: 'ok' },
          { label: 'c', value: c.toFixed(2) },
          { label: '4 triangles', value: `2ab = ${2 * a * b}` },
        ]}
      />
      <Caption>
        Slide between the two arrangements. The container never changes and the four triangles are never
        deformed, so the uncovered area is constant: two squares of areas <TeX tex="a^2" /> and{' '}
        <TeX tex="b^2" /> in arrangement A, one tilted square of area <TeX tex="c^2" /> in arrangement B.
      </Caption>
    </div>
  );
}

export function CauchySchwarz() {
  const [u, setU] = useState({ x: 90, y: -40 });
  const [v, setV] = useState({ x: 50, y: 55 });
  const [drag, setDrag] = useState<'u' | 'v' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const O = { x: 120, y: 88 };
  const dot = u.x * v.x + u.y * v.y;
  const nu = Math.hypot(u.x, u.y);
  const nv = Math.hypot(v.x, v.y);
  const tStar = dot / (nv * nv || 1);
  const proj = { x: v.x * tStar, y: v.y * tStar };
  const w = { x: u.x - proj.x, y: u.y - proj.y };
  const cos = dot / ((nu * nv) || 1);
  const move = (e: React.MouseEvent) => {
    if (!drag || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 340 - O.x;
    const py = ((e.clientY - rect.top) / rect.height) * 175 - O.y;
    const next = { x: Math.round(px), y: Math.round(py) };
    if (drag === 'u') setU(next);
    else setV(next);
  };
  return (
    <div>
      <Controls>
        <Btn onClick={() => { setU({ x: 90, y: -40 }); setV({ x: 50, y: 55 }); }}>reset</Btn>
        <Btn onClick={() => setU({ x: v.x * 1.4, y: v.y * 1.4 })}>make parallel (equality)</Btn>
      </Controls>
      <svg
        ref={svgRef}
        viewBox="0 0 340 175"
        className="vis-svg"
        style={{ maxHeight: 260, cursor: drag ? 'grabbing' : 'default' }}
        onMouseMove={move}
        onMouseUp={() => setDrag(null)}
        onMouseLeave={() => setDrag(null)}
      >
        <line x1={0} y1={O.y} x2={340} y2={O.y} stroke={palette.grid} />
        <line x1={O.x} y1={0} x2={O.x} y2={175} stroke={palette.grid} />
        <line x1={O.x} y1={O.y} x2={O.x + v.x} y2={O.y + v.y} stroke={palette.c} strokeWidth={2.4} />
        <line x1={O.x} y1={O.y} x2={O.x + u.x} y2={O.y + u.y} stroke={palette.a} strokeWidth={2.4} />
        <line
          x1={O.x}
          y1={O.y}
          x2={O.x + proj.x}
          y2={O.y + proj.y}
          stroke={palette.b}
          strokeWidth={3}
          opacity={0.7}
        />
        <line
          x1={O.x + proj.x}
          y1={O.y + proj.y}
          x2={O.x + u.x}
          y2={O.y + u.y}
          stroke={palette.d}
          strokeDasharray="4 3"
          strokeWidth={2}
        />
        <circle
          cx={O.x + u.x}
          cy={O.y + u.y}
          r={7}
          fill={palette.a}
          onMouseDown={() => setDrag('u')}
          style={{ cursor: 'grab' }}
        />
        <circle
          cx={O.x + v.x}
          cy={O.y + v.y}
          r={7}
          fill={palette.c}
          onMouseDown={() => setDrag('v')}
          style={{ cursor: 'grab' }}
        />
        <text x={O.x + u.x + 10} y={O.y + u.y} fontSize="10" fill={palette.a}>
          u
        </text>
        <text x={O.x + v.x + 10} y={O.y + v.y} fontSize="10" fill={palette.c}>
          v
        </text>
        <text x={250} y={20} fontSize="9" fill={palette.b}>
          green = projection of u onto v
        </text>
        <text x={250} y={34} fontSize="9" fill={palette.d}>
          pink = residual w
        </text>
        <text x={8} y={168} fontSize="9" fill={palette.dim}>
          drag either endpoint
        </text>
      </svg>
      <Readout
        items={[
          { label: '⟨u,v⟩', value: dot.toFixed(0) },
          { label: '‖u‖‖v‖', value: (nu * nv).toFixed(0), tone: Math.abs(dot) <= nu * nv + 1e-6 ? 'ok' : 'bad' },
          { label: '‖w‖²', value: (w.x * w.x + w.y * w.y).toFixed(0) },
          { label: 'cos θ', value: cos.toFixed(3) },
        ]}
      />
      <Caption>
        The inequality is the statement that the pink residual has non-negative squared length. Drag{' '}
        <TeX tex="u" /> until it lines up with <TeX tex="v" />: the residual vanishes and the two readouts
        become equal — the equality case is exactly linear dependence. Because the quotient is always in{' '}
        <TeX tex="[-1,1]" />, it can serve as a cosine.
      </Caption>
    </div>
  );
}

const PR_NODES = ['A', 'B', 'C', 'D'];
const PR_LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 0],
  [3, 2],
];

export function PageRank() {
  const [alpha, setAlpha] = useState(0.85);
  const [step, setStep] = useState(0);
  const [sink, setSink] = useState(false);
  const links = sink ? PR_LINKS.filter(([a]) => a !== 2) : PR_LINKS;
  const history = useMemo(() => {
    const n = PR_NODES.length;
    const out: number[][] = [Array(n).fill(1 / n)];
    for (let k = 0; k < 40; k++) {
      const prev = out[out.length - 1];
      const next = Array(n).fill((1 - alpha) / n);
      for (let i = 0; i < n; i++) {
        const outs = links.filter(([a]) => a === i);
        if (!outs.length) {
          // dangling node: mass is lost unless redistributed
          continue;
        }
        for (const [, b] of outs) next[b] += (alpha * prev[i]) / outs.length;
      }
      out.push(next);
    }
    return out;
  }, [alpha, links]);
  const cur = history[Math.min(step, history.length - 1)];
  const final = history[history.length - 1];
  const gap = cur.reduce((s, v, i) => s + Math.abs(v - final[i]), 0);
  const mass = cur.reduce((s, v) => s + v, 0);
  return (
    <div>
      <Controls>
        <Slider label="damping α =" value={alpha} min={0.5} max={1} step={0.05} onChange={(v) => { setAlpha(v); setStep(0); }} />
        <Btn onClick={() => setStep((s) => s + 1)}>iterate</Btn>
        <Btn onClick={() => setStep(0)}>reset</Btn>
        <Btn onClick={() => { setSink((v) => !v); setStep(0); }} active={sink}>
          make C a rank sink
        </Btn>
      </Controls>
      <svg viewBox="0 0 340 160" className="vis-svg" style={{ maxHeight: 240 }}>
        {links.map(([a, b], i) => {
          const pa = { x: 40 + a * 80, y: a % 2 ? 120 : 50 };
          const pb = { x: 40 + b * 80, y: b % 2 ? 120 : 50 };
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={palette.grid} strokeWidth={1.4} />
          );
        })}
        {PR_NODES.map((label, i) => {
          const p = { x: 40 + i * 80, y: i % 2 ? 120 : 50 };
          const r = 10 + cur[i] * 70;
          return (
            <g key={label}>
              <circle cx={p.x} cy={p.y} r={r} fill={palette.e} opacity={0.75} stroke="#0b0f18" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#0b0f18">
                {label}
              </text>
              <text x={p.x} y={p.y + r + 12} textAnchor="middle" fontSize="9" fill={palette.dim}>
                {cur[i].toFixed(3)}
              </text>
            </g>
          );
        })}
      </svg>
      <Readout
        items={[
          { label: 'iterations', value: Math.min(step, history.length - 1) },
          { label: 'L¹ gap to fixed point', value: gap.toFixed(5), tone: gap < 1e-3 ? 'ok' : 'warn' },
          { label: 'bound 2αᵏ', value: (2 * alpha ** Math.min(step, 40)).toFixed(5) },
          { label: 'total mass', value: mass.toFixed(4), tone: Math.abs(mass - 1) < 1e-6 ? 'ok' : 'bad' },
        ]}
      />
      <Caption>
        Each iteration shrinks the distance to the fixed point by a factor <TeX tex="\alpha" />, and the
        measured gap stays under the theoretical <TeX tex="2\alpha^k" />. Turn C into a rank sink and watch
        total mass drain away — without the teleport term the iteration has no probability-vector fixed point
        at all, which is why damping is what makes PageRank well posed.
      </Caption>
    </div>
  );
}
