export type CategoryId =
  | 'foundations'
  | 'computability'
  | 'complexity'
  | 'algorithms'
  | 'graphs'
  | 'numbers'
  | 'probability'
  | 'information'
  | 'geometry';

export type Technique =
  | 'direct'
  | 'induction'
  | 'contradiction'
  | 'contrapositive'
  | 'construction'
  | 'counting'
  | 'diagonalization'
  | 'exchange'
  | 'invariant'
  | 'probabilistic'
  | 'duality'
  | 'amortized';

export interface ProofStep {
  /** Short label shown in the stepper, e.g. "Base case". */
  label: string;
  /** Prose with inline `$math$`, **bold** and `code` supported. */
  body: string;
  /** Optional display-math block shown under the prose. */
  display?: string;
  /** Optional hint tying this step to the visualization. */
  visNote?: string;
}

export interface SoftLink {
  to: string;
  why: string;
}

export interface PhysicalAnchor {
  /** Short name of the everyday object or phenomenon. */
  anchor: string;
  /** How the mathematics shows up in that object. */
  description: string;
}

export interface Proof {
  id: string;
  title: string;
  category: CategoryId;
  /** Position along its category roadmap (1-based, ascending). */
  order: number;
  tagline: string;
  techniques: Technique[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Formal theorem statement. */
  statement: string;
  /** Optional display-math restatement of the theorem. */
  statementDisplay?: string;
  /** Informal reason the theorem is true, before any formalism. */
  intuition: string;
  /** The formal proof, one logical move per step. */
  steps: ProofStep[];
  /** Hard dependencies: proofs that must come earlier in a roadmap. */
  prerequisites: string[];
  /** Cross-category associations with an explanation of the resonance. */
  softLinks: SoftLink[];
  physical: PhysicalAnchor;
  applications: string[];
  /** Key in the visualization registry. */
  visId: string;
}

export interface Category {
  id: CategoryId;
  title: string;
  /** Two or three word subtitle used on cards. */
  kicker: string;
  blurb: string;
  color: string;
  order: number;
}
