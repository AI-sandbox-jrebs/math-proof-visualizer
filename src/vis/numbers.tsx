import { useMemo, useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, palette } from './kit';
import { TeX } from '../components/Math';

const SMALL_PRIMES = [2, 3, 5, 7, 11, 13];

function factorize(n: number): number[] {
  const out: number[] = [];
  let m = n;
  for (let d = 2; d * d <= m; d++) {
    while (m % d === 0) {
      out.push(d);
      m /= d;
    }
  }
  if (m > 1) out.push(m);
  return out;
}

export function Primes() {
  const [chosen, setChosen] = useState<number[]>([2, 3, 5]);
  const product = chosen.reduce((s, p) => s * p, 1);
  const N = product + 1;
  const factors = factorize(N);
  const fresh = factors.filter((f) => !chosen.includes(f));
  return (
    <div>
      <Controls>
        {SMALL_PRIMES.map((p) => (
          <Btn
            key={p}
            active={chosen.includes(p)}
            onClick={() =>
              setChosen((old) => (old.includes(p) ? old.filter((q) => q !== p) : [...old, p].sort((a, b) => a - b)))
            }
          >
            {p}
          </Btn>
        ))}
        <Btn onClick={() => setChosen([2, 3, 5, 7, 11, 13])}>all six</Btn>
      </Controls>
      <div className="vis-equation">
        <TeX
          tex={`N = ${chosen.length ? chosen.join(' \\cdot ') : '1'} + 1 = ${N} = ${
            factors.length ? factors.join(' \\cdot ') : '1'
          }`}
          block
        />
      </div>
      <Readout
        items={[
          { label: 'assumed complete list', value: chosen.join(', ') || 'empty' },
          { label: 'N', value: N },
          { label: 'N prime?', value: factors.length === 1 ? 'yes' : 'no', tone: factors.length === 1 ? 'ok' : 'warn' },
          {
            label: 'prime factors not on the list',
            value: fresh.length ? fresh.join(', ') : '—',
            tone: fresh.length ? 'ok' : 'bad',
          },
        ]}
      />
      <Caption>
        Every prime on your list divides the product, so it leaves remainder <TeX tex="1" /> in{' '}
        <TeX tex="N" /> and cannot divide it. Whatever primes <em>do</em> divide <TeX tex="N" /> are
        therefore new. Select all six to see <TeX tex="30031 = 59 \cdot 509" />: <TeX tex="N" /> itself need
        not be prime — only its factors need to be new.
      </Caption>
    </div>
  );
}

export function Gcd() {
  const [a, setA] = useState(42);
  const [b, setB] = useState(30);
  const rows = useMemo(() => {
    const out: { a: number; b: number; q: number; r: number }[] = [];
    let x = Math.max(a, b);
    let y = Math.min(a, b);
    while (y > 0 && out.length < 12) {
      const q = Math.floor(x / y);
      const r = x % y;
      out.push({ a: x, b: y, q, r });
      x = y;
      y = r;
    }
    return { steps: out, g: x };
  }, [a, b]);
  const bezout = useMemo(() => {
    // extended Euclid on (a, b)
    let [old_r, r] = [a, b];
    let [old_s, s] = [1, 0];
    let [old_t, t] = [0, 1];
    while (r !== 0) {
      const q = Math.floor(old_r / r);
      [old_r, r] = [r, old_r - q * r];
      [old_s, s] = [s, old_s - q * s];
      [old_t, t] = [t, old_t - q * t];
    }
    return { x: old_s, y: old_t, g: old_r };
  }, [a, b]);
  const scale = 150 / Math.max(a, b);
  return (
    <div>
      <Controls>
        <Slider label="a =" value={a} min={1} max={120} onChange={setA} />
        <Slider label="b =" value={b} min={1} max={120} onChange={setB} />
      </Controls>
      <svg viewBox="0 0 340 165" className="vis-svg" style={{ maxHeight: 240 }}>
        <rect x={10} y={10} width={a * scale} height={b * scale} fill="#1d2537" stroke={palette.grid} />
        {(() => {
          // tile the rectangle greedily with the largest squares that fit
          const tiles: { x: number; y: number; s: number }[] = [];
          let ox = 10;
          let oy = 10;
          let w = a;
          let h = b;
          let guard = 0;
          while (w > 0 && h > 0 && guard++ < 40) {
            const s = Math.min(w, h);
            const count = Math.floor(Math.max(w, h) / s);
            for (let i = 0; i < count; i++) {
              tiles.push(
                w >= h
                  ? { x: ox + i * s * scale, y: oy, s }
                  : { x: ox, y: oy + i * s * scale, s },
              );
            }
            if (w >= h) {
              ox += count * s * scale;
              w = w - count * s;
            } else {
              oy += count * s * scale;
              h = h - count * s;
            }
          }
          return tiles.map((t, i) => (
            <rect
              key={i}
              x={t.x}
              y={t.y}
              width={t.s * scale}
              height={t.s * scale}
              fill="none"
              stroke={t.s === rows.g ? palette.b : palette.a}
              strokeWidth={t.s === rows.g ? 2 : 1}
            />
          ));
        })()}
        <text x={10} y={162} fontSize="9" fill={palette.dim}>
          greedy square tiling of an {a} × {b} rectangle — the smallest square has side gcd = {rows.g}
        </text>
      </svg>
      <table className="vis-table">
        <thead>
          <tr>
            <th>a</th>
            <th>b</th>
            <th>q</th>
            <th>r = a − qb</th>
          </tr>
        </thead>
        <tbody>
          {rows.steps.map((s, i) => (
            <tr key={i}>
              <td>{s.a}</td>
              <td>{s.b}</td>
              <td>{s.q}</td>
              <td className={s.r === 0 ? 'tone-ok' : ''}>{s.r}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Readout
        items={[
          { label: 'gcd', value: rows.g, tone: 'ok' },
          { label: 'steps', value: rows.steps.length },
          {
            label: 'Bézout',
            value: `${a}·(${bezout.x}) + ${b}·(${bezout.y}) = ${bezout.g}`,
          },
        ]}
      />
      <Caption>
        Each row replaces <TeX tex="(a,b)" /> by <TeX tex="(b, a \bmod b)" />: the common divisors are
        untouched but the numbers shrink, which is simultaneously the correctness invariant and the
        termination measure. Running the rows backwards produces the Bézout coefficients — and hence
        modular inverses.
      </Caption>
    </div>
  );
}

function modpow(base: number, exp: number, mod: number): number {
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1;
  }
  return result;
}

const FERMAT_MODULI = [7, 11, 13, 17, 561];

export function Fermat() {
  const [pIdx, setPIdx] = useState(0);
  const [a, setA] = useState(3);
  const p = FERMAT_MODULI[pIdx];
  const isPrime = factorize(p).length === 1;
  const residues = Array.from({ length: Math.min(p - 1, 16) }, (_, i) => i + 1);
  const power = modpow(a, p - 1, p);
  return (
    <div>
      <Controls>
        {FERMAT_MODULI.map((m, i) => (
          <Btn key={m} active={pIdx === i} onClick={() => setPIdx(i)}>
            {m === 561 ? '561 (composite)' : m}
          </Btn>
        ))}
        <Slider label="a =" value={a} min={2} max={Math.max(3, p - 1)} onChange={setA} />
      </Controls>
      <svg viewBox="0 0 340 120" className="vis-svg" style={{ maxHeight: 170 }}>
        {residues.map((i, idx) => {
          const x = 16 + idx * (308 / Math.max(1, residues.length - 1));
          const target = (a * i) % p;
          const tIdx = residues.indexOf(target);
          const tx = tIdx >= 0 ? 16 + tIdx * (308 / Math.max(1, residues.length - 1)) : x;
          return (
            <g key={i}>
              <path
                d={`M ${x} 34 C ${x} 62, ${tx} 62, ${tx} 88`}
                fill="none"
                stroke={target === 0 ? palette.d : palette.a}
                strokeWidth={1.2}
                opacity={0.8}
              />
              <text x={x} y={26} fontSize="9" textAnchor="middle" fill={palette.dim}>
                {i}
              </text>
              <text x={x} y={104} fontSize="9" textAnchor="middle" fill={palette.text}>
                {(a * i) % p}
              </text>
            </g>
          );
        })}
        <text x={4} y={116} fontSize="8" fill={palette.dim}>
          top row: residues 1…{Math.min(p - 1, 16)} — bottom row: each multiplied by a, mod {p}
        </text>
      </svg>
      <Readout
        items={[
          { label: 'modulus', value: `${p} (${isPrime ? 'prime' : 'composite'})`, tone: isPrime ? 'ok' : 'warn' },
          { label: `${a}^${p - 1} mod ${p}`, value: power, tone: power === 1 ? 'ok' : 'bad' },
          {
            label: 'verdict',
            value: power === 1 ? (isPrime ? 'consistent with Fermat' : 'Fermat liar!') : 'proves composite',
            tone: power === 1 && !isPrime ? 'bad' : power === 1 ? 'ok' : 'warn',
          },
        ]}
      />
      <Caption>
        For prime <TeX tex="p" /> the arrows form a permutation: no two residues collide and none maps to
        zero, so multiplying all of them gives <TeX tex="a^{p-1}(p-1)! \equiv (p-1)!" /> and the factorial
        cancels. Choose 561 — a Carmichael number — and bases like <TeX tex="a=2" /> still return{' '}
        <TeX tex="1" />: the converse of Fermat is false, which is why Miller–Rabin exists.
      </Caption>
    </div>
  );
}

export function Rsa() {
  const p = 11;
  const q = 13;
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const e = 7;
  const d = 103; // 7 * 103 = 721 = 6*120 + 1
  const [m, setM] = useState(9);
  const cipher = modpow(m, e, n);
  const back = modpow(cipher, d, n);
  return (
    <div>
      <Controls>
        <Slider label="message m =" value={m} min={0} max={n - 1} onChange={setM} />
      </Controls>
      <div className="vis-equation">
        <TeX tex={`n = ${p}\\cdot ${q} = ${n}, \\quad \\varphi(n) = ${phi}, \\quad e = ${e}, \\quad d = ${d}, \\quad ed = ${e * d} = ${e * d / phi | 0}\\cdot ${phi} + 1`} block />
      </div>
      <div className="vis-pipeline">
        <span className="pipe-node">m = {m}</span>
        <span className="pipe-arrow">
          ^{e} mod {n}
        </span>
        <span className="pipe-node is-cipher">c = {cipher}</span>
        <span className="pipe-arrow">
          ^{d} mod {n}
        </span>
        <span className={`pipe-node${back === m ? ' is-ok' : ' is-bad'}`}>{back}</span>
      </div>
      <Readout
        items={[
          { label: `m mod ${p}`, value: m % p },
          { label: `m mod ${q}`, value: m % q },
          { label: 'round trip', value: back === m ? 'recovered' : 'failed', tone: back === m ? 'ok' : 'bad' },
          {
            label: 'shares a factor with n?',
            value: m % p === 0 || m % q === 0 ? 'yes — still works' : 'no',
            tone: 'ok',
          },
        ]}
      />
      <Caption>
        Every message returns intact, including the awkward ones like <TeX tex="m = 11" /> or{' '}
        <TeX tex="m = 13" /> that share a factor with <TeX tex="n" />. That is exactly the case the proof
        handles by working modulo <TeX tex="p" /> and <TeX tex="q" /> separately and gluing with the Chinese
        Remainder Theorem, instead of quoting Euler&apos;s theorem on units alone.
      </Caption>
    </div>
  );
}
