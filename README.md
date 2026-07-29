# Proof Atlas

An interactive library of the proofs that matter to computer science. Every entry
pairs the **formal mathematical proof**, step by step, with an **interactive
visualization** you can manipulate, and places it on a **roadmap** so related
ideas build on each other in order.

- **Roadmaps** — one sequential track per category (foundations, computability,
  complexity, algorithms, graphs, numbers & cryptography, probability,
  information, geometry & linear algebra). Later proofs list the earlier ones
  they depend on, including imports from other tracks.
- **Atlas map** — a force-directed map of every proof, clustered by category,
  with solid prerequisite edges and dashed "soft links" that record why two
  ideas resonate even when neither depends on the other.
- **Physical anchors** — each proof names an everyday object or phenomenon that
  carries the same structure, so the mathematics stays tied to the physical
  world.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run lint
```

## Adding a proof

1. Add an entry to the relevant file in `src/data/proofs/`. The `Proof` type in
   `src/types.ts` documents every field; use the `r` tag (`String.raw`) so LaTeX
   backslashes survive.
2. Give it a `visId` and register a component under that key in
   `src/vis/registry.ts`.
3. Wire it into a roadmap by setting `category` + `order`, and relate it to other
   ideas with `prerequisites` (hard, same or cross track) and `softLinks`.
