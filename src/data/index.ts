import type { CategoryId, Proof } from '../types';
import { categories, categoryById } from './categories';
import { foundations } from './proofs/foundations';
import { computability } from './proofs/computability';
import { complexity } from './proofs/complexity';
import { algorithms } from './proofs/algorithms';
import { graphs } from './proofs/graphs';
import { numbers } from './proofs/numbers';
import { probability } from './proofs/probability';
import { information } from './proofs/information';
import { geometry } from './proofs/geometry';

export const proofs: Proof[] = [
  ...foundations,
  ...computability,
  ...complexity,
  ...algorithms,
  ...graphs,
  ...numbers,
  ...probability,
  ...information,
  ...geometry,
];

export const proofById = new Map(proofs.map((p) => [p.id, p]));

export { categories, categoryById };

export function proofsInCategory(id: CategoryId): Proof[] {
  return proofs.filter((p) => p.category === id).sort((a, b) => a.order - b.order);
}

/** Roadmap step: a proof plus the prerequisites that sit outside its own track. */
export interface RoadmapNode {
  proof: Proof;
  /** Prerequisites belonging to another category, i.e. cross-track imports. */
  imported: Proof[];
}

export function roadmap(id: CategoryId): RoadmapNode[] {
  return proofsInCategory(id).map((proof) => ({
    proof,
    imported: proof.prerequisites
      .map((pid) => proofById.get(pid))
      .filter((p): p is Proof => !!p && p.category !== id),
  }));
}

export type EdgeKind = 'prerequisite' | 'soft';

export interface Edge {
  source: string;
  target: string;
  kind: EdgeKind;
  why?: string;
}

/**
 * All links in the atlas. Prerequisites point forward (earlier -> later);
 * soft links are de-duplicated so a mutual pair yields a single edge.
 */
export const edges: Edge[] = (() => {
  const out: Edge[] = [];
  const seenSoft = new Set<string>();
  for (const p of proofs) {
    for (const pre of p.prerequisites) {
      if (proofById.has(pre)) out.push({ source: pre, target: p.id, kind: 'prerequisite' });
    }
    for (const link of p.softLinks) {
      if (!proofById.has(link.to)) continue;
      const key = [p.id, link.to].sort().join('::');
      if (seenSoft.has(key)) continue;
      seenSoft.add(key);
      out.push({ source: p.id, target: link.to, kind: 'soft', why: link.why });
    }
  }
  return out;
})();

export function neighbours(id: string): { prerequisites: Proof[]; unlocks: Proof[]; related: { proof: Proof; why: string }[] } {
  const proof = proofById.get(id);
  const prerequisites = (proof?.prerequisites ?? [])
    .map((p) => proofById.get(p))
    .filter((p): p is Proof => !!p);
  const unlocks = proofs.filter((p) => p.prerequisites.includes(id));
  const related = new Map<string, string>();
  for (const link of proof?.softLinks ?? []) {
    if (proofById.has(link.to)) related.set(link.to, link.why);
  }
  for (const other of proofs) {
    for (const link of other.softLinks) {
      if (link.to === id && !related.has(other.id)) related.set(other.id, link.why);
    }
  }
  return {
    prerequisites,
    unlocks,
    related: [...related.entries()].map(([pid, why]) => ({ proof: proofById.get(pid)!, why })),
  };
}

export const techniqueIndex = (() => {
  const map = new Map<string, Proof[]>();
  for (const p of proofs) {
    for (const t of p.techniques) {
      const list = map.get(t) ?? [];
      list.push(p);
      map.set(t, list);
    }
  }
  return map;
})();
