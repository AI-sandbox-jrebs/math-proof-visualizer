import type { ReactNode } from 'react';
import { theme } from '../theme';

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

/** Semantic drawing colours for the SVG visualizations, drawn from the shared theme. */
export const palette = {
  a: theme.river,
  b: theme.fir,
  c: theme.amber,
  d: theme.clay,
  e: theme.lupine,
  aStrong: '#2f4f6e',
  grid: theme.line,
  gridStrong: theme.lineStrong,
  text: theme.ink,
  dim: theme.inkSoft,
  surface: theme.surface,
  sunk: theme.paperDeep,
  onFill: '#fdf8f1',
  tintA: '#dbe4ee',
  tintB: '#dde8dd',
  tintD: '#f4dfd8',
  tintE: '#e6e0f0',
};
