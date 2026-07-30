import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, palette } from './kit';
import { TeX } from '../components/Math';

export function Kraft() {
  const [lengths, setLengths] = useState([1, 2, 3, 3]);
  const budget = lengths.reduce((s, l) => s + 2 ** -l, 0);
  const feasible = budget <= 1 + 1e-9;
  const packed = useMemo(() => {
    const sorted = [...lengths].map((l, i) => ({ l, i })).sort((a, b) => a.l - b.l);
    let cursor = 0;
    return sorted.map(({ l, i }) => {
      const width = 2 ** -l;
      const start = cursor;
      cursor += width;
      const code = start < 1 ? Math.round(start * 2 ** l).toString(2).padStart(l, '0') : '—';
      return { l, i, start, width, code, overflow: start + width > 1 + 1e-9 };
    });
  }, [lengths]);
  return (
    <div>
      <Controls>
        {lengths.map((l, i) => (
          <Slider
            key={i}
            label={`ℓ${i + 1} =`}
            value={l}
            min={1}
            max={5}
            onChange={(v) => setLengths((old) => old.map((x, j) => (j === i ? v : x)))}
          />
        ))}
        <Btn onClick={() => setLengths([1, 2, 3, 3])}>tight (=1)</Btn>
        <Btn onClick={() => setLengths([1, 1, 2, 2])}>overspend</Btn>
      </Controls>
      <svg viewBox="0 0 340 96" className="vis-svg" style={{ maxHeight: 140 }}>
        <rect x={10} y={26} width={320} height={34} fill={palette.sunk} stroke={palette.grid} />
        {packed.map((p, k) => (
          <g key={k}>
            <rect
              x={10 + Math.min(1, p.start) * 320}
              y={26}
              width={Math.max(1, Math.min(1 - Math.min(1, p.start), p.width) * 320)}
              height={34}
              fill={p.overflow ? palette.d : [palette.a, palette.b, palette.c, palette.e][k % 4]}
              opacity={0.85}
              stroke={palette.onFill}
            />
            <text x={12 + Math.min(1, p.start) * 320} y={48} fontSize="9" fill={palette.onFill}>
              {p.code}
            </text>
          </g>
        ))}
        <text x={10} y={20} fontSize="9" fill={palette.dim}>
          the unit interval of all infinite bitstrings — each codeword claims a dyadic block of width 2^−ℓ
        </text>
        <text x={10} y={78} fontSize="9" fill={feasible ? palette.b : palette.d}>
          Σ 2^−ℓ = {budget.toFixed(3)} {feasible ? '≤ 1 — a prefix code exists' : '> 1 — impossible'}
        </text>
      </svg>
      <Readout
        items={[
          { label: 'Kraft sum', value: budget.toFixed(4), tone: feasible ? 'ok' : 'bad' },
          { label: 'codewords', value: packed.map((p) => p.code).join(' ') },
          { label: 'slack left', value: Math.max(0, 1 - budget).toFixed(4) },
        ]}
      />
      <Caption>
        Shortening one codeword doubles the slice it claims. The greedy packer lays the blocks left to
        right; while the total stays under <TeX tex="1" /> they never overlap, which is exactly the
        constructive half of the theorem. Press “overspend” to watch a block spill past the end of the
        interval — the code becomes ambiguous.
      </Caption>
    </div>
  );
}

type HuffNode = {
  weight: number;
  symbol?: string;
  left?: HuffNode;
  right?: HuffNode;
};

function buildHuffman(freqs: { symbol: string; weight: number }[]): HuffNode {
  const pool: HuffNode[] = freqs.map((f) => ({ weight: f.weight, symbol: f.symbol }));
  while (pool.length > 1) {
    pool.sort((a, b) => a.weight - b.weight);
    const left = pool.shift()!;
    const right = pool.shift()!;
    pool.push({ weight: left.weight + right.weight, left, right });
  }
  return pool[0];
}

function codes(node: HuffNode, prefix = ''): { symbol: string; code: string; weight: number }[] {
  if (node.symbol !== undefined) return [{ symbol: node.symbol, code: prefix || '0', weight: node.weight }];
  return [...codes(node.left!, `${prefix}0`), ...codes(node.right!, `${prefix}1`)];
}

const DEFAULT_FREQ = [
  { symbol: 'e', weight: 40 },
  { symbol: 't', weight: 25 },
  { symbol: 'a', weight: 15 },
  { symbol: 'n', weight: 12 },
  { symbol: 'z', weight: 8 },
];

export function Huffman() {
  const [freqs, setFreqs] = useState(DEFAULT_FREQ);
  const [flat, setFlat] = useState(false);
  const total = freqs.reduce((s, f) => s + f.weight, 0);
  const tree = useMemo(() => buildHuffman(freqs), [freqs]);
  const table = useMemo(() => codes(tree).sort((a, b) => b.weight - a.weight), [tree]);
  const expected = table.reduce((s, c) => s + (c.weight / total) * c.code.length, 0);
  const fixed = Math.ceil(Math.log2(freqs.length));
  const entropy = freqs.reduce((s, f) => {
    const p = f.weight / total;
    return s - p * Math.log2(p);
  }, 0);
  const flatCost = fixed;
  const layout = useMemo(() => {
    const nodes: { x: number; y: number; label: string; leaf: boolean }[] = [];
    const links: { x1: number; y1: number; x2: number; y2: number }[] = [];
    let leafX = 0;
    const walk = (node: HuffNode, depth: number): { x: number; y: number } => {
      const y = 16 + depth * 26;
      if (node.symbol !== undefined) {
        const x = 20 + leafX * (300 / Math.max(1, freqs.length - 1));
        leafX += 1;
        nodes.push({ x, y, label: `${node.symbol}:${node.weight}`, leaf: true });
        return { x, y };
      }
      const l = walk(node.left!, depth + 1);
      const rr = walk(node.right!, depth + 1);
      const x = (l.x + rr.x) / 2;
      nodes.push({ x, y, label: String(node.weight), leaf: false });
      links.push({ x1: x, y1: y, x2: l.x, y2: l.y }, { x1: x, y1: y, x2: rr.x, y2: rr.y });
      return { x, y };
    };
    walk(tree, 0);
    return { nodes, links };
  }, [tree, freqs.length]);
  return (
    <div>
      <Controls>
        {freqs.map((f, i) => (
          <Slider
            key={f.symbol}
            label={`${f.symbol} =`}
            value={f.weight}
            min={1}
            max={60}
            onChange={(v) => setFreqs((old) => old.map((x, j) => (j === i ? { ...x, weight: v } : x)))}
          />
        ))}
        <Btn onClick={() => setFreqs(DEFAULT_FREQ)}>reset</Btn>
        <Btn onClick={() => setFlat((v) => !v)} active={flat}>
          compare fixed-length
        </Btn>
      </Controls>
      <svg viewBox="0 0 340 150" className="vis-svg" style={{ maxHeight: 220 }}>
        {layout.links.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={palette.grid} strokeWidth={1.4} />
        ))}
        {layout.nodes.map((nd, i) => (
          <g key={i}>
            <circle cx={nd.x} cy={nd.y} r={nd.leaf ? 13 : 10} fill={nd.leaf ? palette.b : palette.sunk} stroke={palette.grid} />
            <text
              x={nd.x}
              y={nd.y + 3}
              textAnchor="middle"
              fontSize={nd.leaf ? 9 : 8}
              fill={nd.leaf ? palette.onFill : palette.dim}
            >
              {nd.label}
            </text>
          </g>
        ))}
      </svg>
      <table className="vis-table">
        <thead>
          <tr>
            <th>symbol</th>
            <th>p</th>
            <th>code</th>
            <th>length</th>
          </tr>
        </thead>
        <tbody>
          {table.map((c) => (
            <tr key={c.symbol}>
              <td>{c.symbol}</td>
              <td>{(c.weight / total).toFixed(3)}</td>
              <td>
                <code>{c.code}</code>
              </td>
              <td>{c.code.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Readout
        items={[
          { label: 'expected length', value: expected.toFixed(3), tone: 'ok' },
          { label: 'entropy H(p)', value: entropy.toFixed(3) },
          { label: 'H(p) ≤ E[ℓ] < H+1', value: expected >= entropy && expected < entropy + 1 ? 'holds' : 'check', tone: 'ok' },
          ...(flat ? [{ label: 'fixed-length cost', value: flatCost.toFixed(3), tone: 'bad' as const }] : []),
        ]}
      />
      <Caption>
        Drag the frequencies: the two rarest symbols are always merged first and end up deepest, which is
        the structural fact the exchange argument proves must hold in <em>any</em> optimal tree. The expected
        length stays wedged between the entropy and entropy + 1, and always beats the fixed-length code
        unless the distribution is uniform.
      </Caption>
    </div>
  );
}
