import { useMemo, useState } from 'react';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';
import { categories, categoryById, edges, neighbours, proofById, proofs } from '../data';
import type { CategoryId } from '../types';
import { Prose } from '../components/Math';
import { Action, Kicker, Panel } from '../components/ui';
import { palette } from '../vis/kit';
import { theme } from '../theme';

const W = 1000;
const H = 660;

interface AtlasNode extends SimulationNodeDatum {
  id: string;
  category: CategoryId;
  title: string;
  difficulty: number;
}

type AtlasLink = SimulationLinkDatum<AtlasNode> & { kind: 'prerequisite' | 'soft' };

function anchor(index: number, total: number) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return { x: W / 2 + 330 * Math.cos(angle), y: H / 2 + 250 * Math.sin(angle) };
}

function layout() {
  const anchors = new Map(categories.map((c, i) => [c.id, anchor(i, categories.length)]));
  const nodes: AtlasNode[] = proofs.map((p) => {
    const a = anchors.get(p.category)!;
    return {
      id: p.id,
      category: p.category,
      title: p.title,
      difficulty: p.difficulty,
      x: a.x + (p.order - 2) * 12,
      y: a.y + (p.order - 2) * 12,
    };
  });
  const links: AtlasLink[] = edges.map((e) => ({ source: e.source, target: e.target, kind: e.kind }));
  const sim = forceSimulation<AtlasNode>(nodes)
    .force(
      'link',
      forceLink<AtlasNode, AtlasLink>(links)
        .id((d) => d.id)
        .distance((l) => (l.kind === 'soft' ? 200 : 90))
        .strength((l) => (l.kind === 'soft' ? 0.06 : 0.35)),
    )
    .force('charge', forceManyBody<AtlasNode>().strength(-260))
    .force('collide', forceCollide<AtlasNode>(26))
    .force('x', forceX<AtlasNode>((d) => anchors.get(d.category)!.x).strength(0.28))
    .force('y', forceY<AtlasNode>((d) => anchors.get(d.category)!.y).strength(0.28))
    .stop();
  sim.tick(400);
  return { nodes, links, anchors };
}

export default function AtlasPage() {
  const { nodes, links, anchors } = useMemo(layout, []);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusCategory, setFocusCategory] = useState<CategoryId | null>(null);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const related = useMemo(() => {
    if (!selected) return new Set<string>();
    const n = neighbours(selected);
    return new Set([
      selected,
      ...n.prerequisites.map((p) => p.id),
      ...n.unlocks.map((p) => p.id),
      ...n.related.map((r) => r.proof.id),
    ]);
  }, [selected]);
  const selectedProof = selected ? proofById.get(selected) : undefined;
  const selectedLinks = selected ? neighbours(selected) : null;

  const dim = (id: string, cat: CategoryId) => {
    if (selected) return !related.has(id);
    if (focusCategory) return cat !== focusCategory;
    return false;
  };

  return (
    <div className="page atlas-page">
      <header className="atlas-head">
        <h1>The map</h1>
        <p>
          Every proof, clustered by track. Solid edges are prerequisites — follow them and you are walking a
          roadmap. Dashed edges are soft links: ideas that rhyme across tracks (a counting argument reused as
          a lower bound, a parity trick reused on graphs). Hover a node for its name, click it to isolate its
          neighbourhood.
        </p>
        <div className="atlas-filters">
          <button
            type="button"
            className={`vis-btn${!focusCategory ? ' is-active' : ''}`}
            onClick={() => {
              setFocusCategory(null);
              setSelected(null);
            }}
          >
            all tracks
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`vis-btn${focusCategory === c.id ? ' is-active' : ''}`}
              style={{
                borderColor: c.color,
                color: focusCategory === c.id ? palette.onFill : c.color,
                background: focusCategory === c.id ? c.color : undefined,
              }}
              onClick={() => {
                setFocusCategory(c.id);
                setSelected(null);
              }}
            >
              {c.title}
            </button>
          ))}
        </div>
      </header>

      <div className="atlas-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="atlas-svg" onClick={() => setSelected(null)}>
          {categories.map((c) => {
            const a = anchors.get(c.id)!;
            return (
              <text
                key={c.id}
                x={a.x}
                y={a.y - 96}
                textAnchor="middle"
                fontSize={15}
                fill={c.color}
                opacity={focusCategory && focusCategory !== c.id ? 0.25 : 0.8}
              >
                {c.title}
              </text>
            );
          })}
          {links.map((l, i) => {
            const s = typeof l.source === 'string' ? byId.get(l.source)! : (l.source as AtlasNode);
            const t = typeof l.target === 'string' ? byId.get(l.target)! : (l.target as AtlasNode);
            if (!s || !t) return null;
            const faded = dim(s.id, s.category) || dim(t.id, t.category);
            return (
              <line
                key={i}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke={l.kind === 'soft' ? theme.lupine : theme.lineStrong}
                strokeWidth={l.kind === 'soft' ? 1.1 : 1.8}
                strokeDasharray={l.kind === 'soft' ? '5 5' : undefined}
                opacity={faded ? 0.08 : l.kind === 'soft' ? 0.45 : 0.85}
              />
            );
          })}
          {nodes.map((n) => {
            const colour = categoryById.get(n.category)!.color;
            const faded = dim(n.id, n.category);
            const isSelected = selected === n.id;
            const labelled = isSelected || hovered === n.id || related.has(n.id) || focusCategory === n.category;
            return (
              <g
                key={n.id}
                opacity={faded ? 0.15 : 1}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered((h) => (h === n.id ? null : h))}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(n.id === selected ? null : n.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={7 + n.difficulty * 1.6}
                  fill={colour}
                  stroke={isSelected ? theme.ink : palette.onFill}
                  strokeWidth={isSelected ? 2.5 : 1}
                />
                <text
                  x={n.x}
                  y={(n.y ?? 0) - 14 - n.difficulty}
                  textAnchor="middle"
                  fontSize={10}
                  fill={theme.ink}
                  opacity={labelled ? 1 : 0}
                  style={{ transition: 'opacity 0.12s ease' }}
                >
                  {n.title.length > 30 ? `${n.title.slice(0, 29)}…` : n.title}
                </text>
              </g>
            );
          })}
        </svg>

        <Panel className="atlas-panel">
          {selectedProof && selectedLinks ? (
            <>
              <Kicker color={categoryById.get(selectedProof.category)!.color}>
                {categoryById.get(selectedProof.category)!.title}
              </Kicker>
              <h2>{selectedProof.title}</h2>
              <Prose className="muted" text={selectedProof.tagline} />
              <h3>Physical anchor</h3>
              <p className="muted">
                <b>{selectedProof.physical.anchor}</b> — {selectedProof.physical.description}
              </p>
              {selectedLinks.prerequisites.length ? (
                <>
                  <h3>Comes after</h3>
                  <ul>
                    {selectedLinks.prerequisites.map((p) => (
                      <li key={p.id}>
                        <button type="button" className="linkish" onClick={() => setSelected(p.id)}>
                          {p.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {selectedLinks.unlocks.length ? (
                <>
                  <h3>Leads to</h3>
                  <ul>
                    {selectedLinks.unlocks.map((p) => (
                      <li key={p.id}>
                        <button type="button" className="linkish" onClick={() => setSelected(p.id)}>
                          {p.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {selectedLinks.related.length ? (
                <>
                  <h3>Rhymes with</h3>
                  <ul>
                    {selectedLinks.related.map(({ proof: p, why }) => (
                      <li key={p.id}>
                        <button type="button" className="linkish" onClick={() => setSelected(p.id)}>
                          {p.title}
                        </button>
                        <Prose className="why" text={why} />
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <Action to={`/proof/${selectedProof.id}`}>Open the proof</Action>
            </>
          ) : (
            <>
              <h2>Legend</h2>
              <ul className="legend">
                <li>
                  <span className="legend-line" /> prerequisite — required before
                </li>
                <li>
                  <span className="legend-line is-soft" /> soft link — same idea, different setting
                </li>
                <li>
                  <span className="legend-dot" /> node size = difficulty
                </li>
              </ul>
              <p className="muted">
                Proximity is meaningful: the force layout pulls proofs towards their track anchor while
                prerequisite edges pull tracks together, so neighbouring clusters are the ones that actually
                share machinery. Click a node for its neighbourhood and its physical anchor.
              </p>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}
