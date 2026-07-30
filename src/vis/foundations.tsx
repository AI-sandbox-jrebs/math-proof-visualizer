import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, makeRng, palette } from './kit';
import { TeX } from '../components/Math';

export function Staircase() {
  const [n, setN] = useState(6);
  const cell = Math.max(10, Math.min(28, 260 / (n + 1)));
  const w = (n + 1) * cell;
  const h = n * cell;
  const blocks: { x: number; y: number; own: boolean }[] = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col <= n; col++) {
      // the staircase occupies col <= row; the mirrored copy fills the rest
      if (col <= row) blocks.push({ x: col, y: row, own: true });
      else blocks.push({ x: col, y: row, own: false });
    }
  }
  return (
    <div>
      <Controls>
        <Slider label="n =" value={n} min={1} max={14} onChange={setN} />
      </Controls>
      <svg viewBox={`0 0 ${w + 2} ${h + 2}`} className="vis-svg" style={{ maxHeight: 300 }}>
        {blocks.map((b) => (
          <rect
            key={`${b.x}-${b.y}`}
            x={b.x * cell + 1}
            y={b.y * cell + 1}
            width={cell - 1.5}
            height={cell - 1.5}
            rx={2}
            fill={b.own ? palette.a : palette.sunk}
            stroke={b.own ? palette.aStrong : palette.grid}
            strokeWidth={0.8}
          />
        ))}
      </svg>
      <Readout
        items={[
          { label: 'staircase blocks', value: (n * (n + 1)) / 2 },
          { label: 'rectangle', value: `${n} × ${n + 1} = ${n * (n + 1)}` },
          { label: 'ratio', value: 'exactly one half', tone: 'ok' },
        ]}
      />
      <Caption>
        The blue staircase is <TeX tex="1 + 2 + \dots + n" />; the dark blocks are a second copy rotated
        180°. Together they tile an <TeX tex="n \times (n+1)" /> rectangle, so the staircase is half of it.
        Increasing <TeX tex="n" /> adds one row to the staircase and one column to the rectangle — the
        inductive step, drawn.
      </Caption>
    </div>
  );
}

const CONVERGENTS: [number, number][] = [
  [1, 1],
  [3, 2],
  [7, 5],
  [17, 12],
  [41, 29],
  [99, 70],
  [239, 169],
  [577, 408],
];

export function Descent() {
  const [k, setK] = useState(4);
  const [pair, setPair] = useState<[number, number]>([1024, 724]);
  const rows = CONVERGENTS.slice(0, k + 1);
  const ladder = useMemo(() => {
    const out: { p: number; q: number; pEven: boolean; qEven: boolean }[] = [];
    let [p, q] = pair;
    for (let i = 0; i < 8; i++) {
      const pEven = p % 2 === 0;
      const qEven = q % 2 === 0;
      out.push({ p, q, pEven, qEven });
      if (!pEven || !qEven) break;
      p /= 2;
      q /= 2;
    }
    return out;
  }, [pair]);
  const stuck = ladder[ladder.length - 1];
  return (
    <div>
      <Controls>
        <Slider label="approximations shown" value={k} min={0} max={7} onChange={setK} />
        <Btn onClick={() => setPair([1024, 724])} active={pair[0] === 1024}>
          start 1024/724
        </Btn>
        <Btn onClick={() => setPair([4096, 2048])} active={pair[0] === 4096}>
          start 4096/2048
        </Btn>
      </Controls>
      <table className="vis-table">
        <thead>
          <tr>
            <th>p / q</th>
            <th>
              <TeX tex="p^2" />
            </th>
            <th>
              <TeX tex="2q^2" />
            </th>
            <th>
              <TeX tex="p^2 - 2q^2" />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([p, q]) => (
            <tr key={`${p}/${q}`}>
              <td>
                {p}/{q}
              </td>
              <td>{p * p}</td>
              <td>{2 * q * q}</td>
              <td className={p * p - 2 * q * q === 0 ? 'tone-bad' : 'tone-warn'}>
                {p * p - 2 * q * q > 0 ? '+' : ''}
                {p * p - 2 * q * q}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Caption>
        These are the best rational approximations to <TeX tex="\sqrt2" />. The last column is never zero
        — it stubbornly alternates <TeX tex="\pm 1" />. No fraction ever lands on the target.
      </Caption>
      <div className="vis-ladder">
        {ladder.map((row, i) => (
          <div key={i} className="vis-ladder-row">
            <span className="vis-ladder-frac">
              {row.p}/{row.q}
            </span>
            <span className={row.pEven ? 'badge ok' : 'badge bad'}>p {row.pEven ? 'even' : 'odd'}</span>
            <span className={row.qEven ? 'badge ok' : 'badge bad'}>q {row.qEven ? 'even' : 'odd'}</span>
            {row.pEven && row.qEven ? <span className="vis-ladder-arrow">÷2 ↓</span> : null}
          </div>
        ))}
      </div>
      <Caption>
        The descent ladder: if <TeX tex="p^2 = 2q^2" /> then both must be even, so the fraction can be
        halved — forever. Here the ladder halts at{' '}
        <b>
          {stuck.p}/{stuck.q}
        </b>{' '}
        because something turned odd, which is exactly the contradiction: a genuine solution could never
        get stuck, and no infinite descent exists in <TeX tex="\mathbb{N}" />.
      </Caption>
    </div>
  );
}

export function Pigeonhole() {
  const [n, setN] = useState(9);
  const [m, setM] = useState(4);
  const [seed, setSeed] = useState(7);
  const [spread, setSpread] = useState(true);
  const assignment = useMemo(() => {
    const rng = makeRng(seed);
    return Array.from({ length: n }, (_, i) => (spread ? i % m : Math.floor(rng() * m)));
  }, [n, m, seed, spread]);
  const loads = Array.from({ length: m }, (_, b) => assignment.filter((a) => a === b).length);
  const maxLoad = Math.max(...loads, 0);
  const guaranteed = Math.ceil(n / m);
  return (
    <div>
      <Controls>
        <Slider label="items n =" value={n} min={1} max={24} onChange={setN} />
        <Slider label="boxes m =" value={m} min={1} max={10} onChange={setM} />
        <Btn onClick={() => setSpread(true)} active={spread}>
          spread evenly
        </Btn>
        <Btn
          onClick={() => {
            setSpread(false);
            setSeed((s) => s + 1);
          }}
          active={!spread}
        >
          random throw
        </Btn>
      </Controls>
      <div className="vis-boxes">
        {loads.map((load, b) => (
          <div key={b} className={`vis-box${load > 1 ? ' is-over' : ''}`}>
            <div className="vis-box-items">
              {Array.from({ length: load }, (_, i) => (
                <span key={i} className="vis-item" />
              ))}
            </div>
            <span className="vis-box-label">{load}</span>
          </div>
        ))}
      </div>
      <Readout
        items={[
          { label: 'n > m ?', value: n > m ? 'yes' : 'no', tone: n > m ? 'ok' : 'warn' },
          { label: 'guaranteed max load', value: guaranteed, tone: guaranteed > 1 ? 'ok' : undefined },
          { label: 'observed max load', value: maxLoad },
        ]}
      />
      <Caption>
        "Spread evenly" is the adversary trying hardest to avoid a collision. Once{' '}
        <TeX tex="n > m" /> even that best effort fails: some box holds{' '}
        <TeX tex="\lceil n/m \rceil" /> items. The guarantee is about <em>every</em> placement, which is
        why the even spread is the interesting one to watch.
      </Caption>
    </div>
  );
}

export function Diagonal() {
  const [k, setK] = useState(7);
  const [seed, setSeed] = useState(3);
  const [hover, setHover] = useState<number | null>(null);
  const table = useMemo(() => {
    const rng = makeRng(seed);
    return Array.from({ length: k }, () => Array.from({ length: k }, () => (rng() < 0.5 ? 0 : 1)));
  }, [k, seed]);
  const diag = table.map((row, i) => 1 - row[i]);
  return (
    <div>
      <Controls>
        <Slider label="rows shown" value={k} min={3} max={12} onChange={setK} />
        <Btn onClick={() => setSeed((s) => s + 1)}>new list</Btn>
      </Controls>
      <div className="vis-grid-wrap">
        <table className="vis-bits">
          <tbody>
            {table.map((row, i) => (
              <tr
                key={i}
                className={hover === i ? 'is-hover' : ''}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <th>
                  s<sub>{i}</sub>
                </th>
                {row.map((bit, j) => (
                  <td key={j} className={i === j ? 'is-diag' : ''}>
                    {bit}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="vis-bits-d">
              <th>d</th>
              {diag.map((bit, j) => (
                <td key={j} className={hover === j ? 'is-diff' : ''}>
                  {bit}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <Caption>
        Every row is a sequence someone claims is on the list. The highlighted diagonal is read off and
        flipped to build <TeX tex="d" />.{' '}
        {hover !== null ? (
          <>
            Hovering row {hover}: it differs from <TeX tex="d" /> in position {hover} (
            {table[hover][hover]} vs {diag[hover]}), so it cannot equal <TeX tex="d" />.
          </>
        ) : (
          <>Hover a row to see the single position where it is guaranteed to differ from <TeX tex="d" />.</>
        )}
      </Caption>
    </div>
  );
}
