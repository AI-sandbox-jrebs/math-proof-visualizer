import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';

/** Sets the per-subtree accent colour that every component below reads from. */
export function accentStyle(color: string): CSSProperties {
  return { '--accent': color } as CSSProperties;
}

export function Kicker({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="kicker" style={color ? { color } : undefined}>
      {children}
    </span>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="section-heading">{children}</h2>;
}

/** A raised paper surface. `to` turns it into a link card that lifts on hover. */
export function Card({
  children,
  to,
  tone = 'plain',
  className = '',
  style,
}: {
  children: ReactNode;
  to?: string;
  tone?: 'plain' | 'ridge' | 'sunk';
  className?: string;
  style?: CSSProperties;
}) {
  const cls = `card card-${tone}${to ? ' card-link' : ''}${className ? ` ${className}` : ''}`;
  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

/** A card with a small uppercase label, used for every block on a proof page. */
export function Panel({
  label,
  children,
  tone = 'plain',
  className = '',
}: {
  label?: string;
  children: ReactNode;
  tone?: 'plain' | 'quote' | 'field' | 'stage';
  className?: string;
}) {
  return (
    <section className={`panel panel-${tone}${className ? ` ${className}` : ''}`}>
      {label ? <h2 className="panel-label">{label}</h2> : null}
      {children}
    </section>
  );
}

export function Chips({ children }: { children: ReactNode }) {
  return <div className="chips">{children}</div>;
}

export function Chip({
  children,
  tone = 'plain',
}: {
  children: ReactNode;
  tone?: 'plain' | 'accent' | 'quiet';
}) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

export function Badge({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'ok' | 'bad' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

/** Five dots, filled to the proof's difficulty. */
export function Difficulty({ level }: { level: number }) {
  return (
    <span className="difficulty" title={`difficulty ${level}/5`}>
      {'●'.repeat(level)}
      <span className="difficulty-rest">{'●'.repeat(5 - level)}</span>
    </span>
  );
}

export function Crumbs({ children }: { children: ReactNode }) {
  return <nav className="crumbs">{children}</nav>;
}

export function Action({
  to,
  children,
  tone = 'solid',
}: {
  to: string;
  children: ReactNode;
  tone?: 'solid' | 'ghost';
}) {
  return (
    <Link className={`action action-${tone}`} to={to}>
      {children}
    </Link>
  );
}

/** Numbered rail + card, one rung of a track's roadmap. */
export function Rung({ index, last, children }: { index: number; last?: boolean; children: ReactNode }) {
  return (
    <li className="rung">
      <div className="rung-rail">
        <span className="rung-marker">{index}</span>
        {last ? null : <span className="rung-line" />}
      </div>
      <div className="rung-body">{children}</div>
    </li>
  );
}

/** The physical-world anchor, styled as a field note wherever it appears. */
export function FieldNote({ anchor, children }: { anchor: string; children: ReactNode }) {
  return (
    <p className="field-note">
      <b>{anchor}</b>
      <span className="field-note-dash"> — </span>
      {children}
    </p>
  );
}
