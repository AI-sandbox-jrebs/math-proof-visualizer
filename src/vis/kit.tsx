import type { ReactNode } from 'react';

export function Controls({ children }: { children: ReactNode }) {
  return <div className="vis-controls">{children}</div>;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="vis-slider">
      <span className="vis-slider-label">
        {label}
        <b>{format ? format(value) : value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Btn({
  children,
  onClick,
  active,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`vis-btn${active ? ' is-active' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Readout({ items }: { items: { label: string; value: ReactNode; tone?: 'ok' | 'bad' | 'warn' }[] }) {
  return (
    <div className="vis-readout">
      {items.map((it) => (
        <div key={it.label} className={`vis-stat${it.tone ? ` tone-${it.tone}` : ''}`}>
          <span>{it.label}</span>
          <b>{it.value}</b>
        </div>
      ))}
    </div>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="vis-caption">{children}</p>;
}

/** Deterministic pseudo-random generator so demos are reproducible per seed. */
export function makeRng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

export const palette = {
  a: '#7c9cff',
  b: '#6fe3c4',
  c: '#ffc46b',
  d: '#ff8fa3',
  e: '#c79bff',
  grid: '#2a3348',
  text: '#e8ecf7',
  dim: '#8b96b0',
};
