import { useState } from 'react';
import { Btn, Caption, Controls, Readout, Slider, palette } from './kit';
import { TeX } from '../components/Math';

export function Pumping() {
  const [p, setP] = useState(5);
  const [cut, setCut] = useState(2); // |x|
  const [len, setLen] = useState(2); // |y|
  const [i, setI] = useState(2);
  const xLen = Math.min(cut, p - 1);
  const yLen = Math.min(len, p - xLen);
  const x = 'a'.repeat(xLen);
  const y = 'a'.repeat(yLen);
  const z = 'a'.repeat(p - xLen - yLen) + 'b'.repeat(p);
  const pumped = x + y.repeat(i) + z;
  const aCount = [...pumped].filter((c) => c === 'a').length;
  const bCount = pumped.length - aCount;
  const inLanguage = aCount === bCount;
  const ring = Array.from({ length: p }, (_, s) => s);
  return (
    <div>
      <Controls>
        <Slider label="states p =" value={p} min={3} max={8} onChange={setP} />
        <Slider label="|x| =" value={xLen} min={0} max={p - 1} onChange={setCut} />
        <Slider label="|y| =" value={yLen} min={1} max={p - xLen} onChange={setLen} />
        <Slider label="pump i =" value={i} min={0} max={4} onChange={setI} />
      </Controls>
      <svg viewBox="0 0 320 90" className="vis-svg" style={{ maxHeight: 120 }}>
        {ring.map((s) => {
          const cx = 26 + s * (268 / Math.max(1, p - 1));
          const looped = s === xLen || s === xLen + yLen;
          return (
            <g key={s}>
              <circle
                cx={cx}
                cy={58}
                r={12}
                fill={looped ? palette.d : '#1d2537'}
                stroke={looped ? '#fff' : palette.grid}
              />
              <text x={cx} y={62} textAnchor="middle" fontSize="10" fill={palette.text}>
                q{s}
              </text>
            </g>
          );
        })}
        <path
          d={`M ${26 + xLen * (268 / Math.max(1, p - 1))} 44 Q ${
            26 + (xLen + yLen / 2) * (268 / Math.max(1, p - 1))
          } 12 ${26 + Math.min(p - 1, xLen + yLen) * (268 / Math.max(1, p - 1))} 44`}
          fill="none"
          stroke={palette.d}
          strokeWidth={2}
          markerEnd="url(#arrow)"
        />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={palette.d} />
          </marker>
        </defs>
        <text x={160} y={16} textAnchor="middle" fontSize="9" fill={palette.dim}>
          reading y returns to the same state — the machine cannot count laps
        </text>
      </svg>
      <div className="vis-string">
        <span className="seg seg-x">{x || '\u03b5'}</span>
        {Array.from({ length: i }, (_, k) => (
          <span key={k} className="seg seg-y">
            {y}
          </span>
        ))}
        <span className="seg seg-z">{z}</span>
      </div>
      <Readout
        items={[
          { label: 'string', value: `xy^${i}z` },
          { label: "#a", value: aCount },
          { label: '#b', value: bCount },
          {
            label: 'in a^n b^n ?',
            value: inLanguage ? 'yes' : 'no',
            tone: inLanguage ? 'ok' : 'bad',
          },
        ]}
      />
      <Caption>
        The original string is <TeX tex="a^p b^p" />, so every legal split keeps{' '}
        <TeX tex="y" /> inside the <TeX tex="a" />-block (because <TeX tex="|xy| \le p" />). Pumping to any{' '}
        <TeX tex="i \neq 1" /> therefore unbalances the counts and leaves the language — while the DFA,
        blind to laps around the highlighted loop, still accepts. That is the contradiction.
      </Caption>
    </div>
  );
}

export function Halting() {
  const [answer, setAnswer] = useState<'halts' | 'loops'>('halts');
  const behaviour = answer === 'halts' ? 'loops forever' : 'halts immediately';
  return (
    <div>
      <Controls>
        <Btn onClick={() => setAnswer('halts')} active={answer === 'halts'}>
          H(D, D) = 1 &nbsp;“D halts”
        </Btn>
        <Btn onClick={() => setAnswer('loops')} active={answer === 'loops'}>
          H(D, D) = 0 &nbsp;“D loops”
        </Btn>
      </Controls>
      <svg viewBox="0 0 360 150" className="vis-svg" style={{ maxHeight: 220 }}>
        <rect x={8} y={54} width={70} height={40} rx={6} fill="#1d2537" stroke={palette.grid} />
        <text x={43} y={78} textAnchor="middle" fontSize="12" fill={palette.text}>
          ⟨D⟩
        </text>
        <path d="M78 74 H 118" stroke={palette.dim} strokeWidth={1.5} markerEnd="url(#arrow2)" />
        <rect x={118} y={44} width={86} height={60} rx={6} fill="#22304d" stroke={palette.a} />
        <text x={161} y={70} textAnchor="middle" fontSize="12" fill={palette.text}>
          H(M, w)
        </text>
        <text x={161} y={88} textAnchor="middle" fontSize="9" fill={palette.dim}>
          oracle
        </text>
        <path d="M204 74 H 244" stroke={palette.dim} strokeWidth={1.5} markerEnd="url(#arrow2)" />
        <rect x={244} y={44} width={104} height={60} rx={6} fill="#2b2438" stroke={palette.d} />
        <text x={296} y={68} textAnchor="middle" fontSize="12" fill={palette.text}>
          invert
        </text>
        <text x={296} y={86} textAnchor="middle" fontSize="9" fill={palette.dim}>
          do the opposite
        </text>
        <path
          d="M296 104 V 128 H 43 V 94"
          fill="none"
          stroke={palette.d}
          strokeDasharray="4 3"
          strokeWidth={1.5}
          markerEnd="url(#arrow2)"
        />
        <text x={170} y={142} textAnchor="middle" fontSize="9" fill={palette.d}>
          D is fed its own source code
        </text>
        <defs>
          <marker id="arrow2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={palette.dim} />
          </marker>
        </defs>
      </svg>
      <Readout
        items={[
          { label: 'oracle predicts', value: answer === 'halts' ? 'D(D) halts' : 'D(D) never halts' },
          { label: 'D actually', value: behaviour, tone: 'bad' },
          { label: 'verdict', value: 'oracle is wrong', tone: 'bad' },
        ]}
      />
      <Caption>
        Both buttons lead to the same red verdict, and that is the point: whatever the oracle says about
        the single input <TeX tex="(D, D)" />, <TeX tex="D" /> is built to contradict it. Since{' '}
        <TeX tex="D" /> is an ordinary program whenever <TeX tex="H" /> is, the oracle cannot exist.
      </Caption>
    </div>
  );
}

export function Reduction() {
  const [halts, setHalts] = useState(true);
  return (
    <div>
      <Controls>
        <Btn onClick={() => setHalts(true)} active={halts}>
          M(w) halts
        </Btn>
        <Btn onClick={() => setHalts(false)} active={!halts}>
          M(w) runs forever
        </Btn>
      </Controls>
      <svg viewBox="0 0 380 130" className="vis-svg" style={{ maxHeight: 200 }}>
        <text x={10} y={20} fontSize="10" fill={palette.dim}>
          N(x): simulate M(w), then run G(x)
        </text>
        <rect x={10} y={34} width={54} height={44} rx={6} fill="#1d2537" stroke={palette.grid} />
        <text x={37} y={60} textAnchor="middle" fontSize="11" fill={palette.text}>
          x
        </text>
        <rect x={92} y={34} width={94} height={44} rx={6} fill="#22304d" stroke={palette.a} />
        <text x={139} y={54} textAnchor="middle" fontSize="11" fill={palette.text}>
          simulate M(w)
        </text>
        <text x={139} y={70} textAnchor="middle" fontSize="9" fill={halts ? palette.b : palette.d}>
          {halts ? 'gate opens' : 'gate never opens'}
        </text>
        <rect
          x={214}
          y={34}
          width={70}
          height={44}
          rx={6}
          fill={halts ? '#20362f' : '#2b2438'}
          stroke={halts ? palette.b : palette.grid}
        />
        <text x={249} y={60} textAnchor="middle" fontSize="11" fill={palette.text}>
          G(x)
        </text>
        <path d="M64 56 H 90" stroke={palette.dim} strokeWidth={1.5} />
        <path
          d="M186 56 H 212"
          stroke={halts ? palette.b : palette.d}
          strokeWidth={1.5}
          strokeDasharray={halts ? '' : '4 3'}
        />
        <path d="M284 56 H 330" stroke={halts ? palette.b : palette.d} strokeWidth={1.5} />
        <text x={352} y={60} textAnchor="middle" fontSize="11" fill={palette.text}>
          {halts ? 'g(x)' : '⊥'}
        </text>
        <text x={190} y={112} textAnchor="middle" fontSize="9" fill={palette.dim}>
          the property of N is decided entirely by whether M(w) halts
        </text>
      </svg>
      <Readout
        items={[
          { label: 'function computed by N', value: halts ? 'g' : '⊥ (nowhere defined)' },
          { label: 'in P ?', value: halts ? 'yes' : 'no', tone: halts ? 'ok' : 'bad' },
          { label: 'so deciding P decides', value: 'halting', tone: 'warn' },
        ]}
      />
      <Caption>
        Flip the switch and the <em>behaviour</em> of the constructed machine jumps between a function in{' '}
        <TeX tex="P" /> and the nowhere-defined function outside <TeX tex="P" />. Building{' '}
        <TeX tex="N" /> is pure source-code surgery, so any decider for the property would answer the
        halting question — which is impossible.
      </Caption>
    </div>
  );
}
