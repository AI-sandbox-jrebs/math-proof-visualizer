import type { Proof } from '../../types';
import { r } from '../raw';

export const graphs: Proof[] = [
  {
    id: 'handshake-lemma',
    title: 'The Handshake Lemma',
    category: 'graphs',
    order: 1,
    tagline: 'Count edge endpoints twice and parity does the rest.',
    techniques: ['counting', 'direct'],
    difficulty: 1,
    statement:
      r`In any finite undirected graph $G = (V,E)$ the sum of the vertex degrees equals twice the number of edges. Consequently the number of vertices of odd degree is even.`,
    statementDisplay: r`\sum_{v \in V} \deg(v) = 2|E|`,
    intuition:
      r`Every edge has two ends. Counting "ends" by walking around the vertices and counting them by walking along the edges must agree — the classic double count. Since the total is even, odd degrees have to pair up.`,
    steps: [
      {
        label: 'Count incidences two ways',
        body: r`Let $I = \{(v, e) : v \in V,\ e \in E,\ v \in e\}$ be the set of vertex–edge incidences. Grouping $I$ by vertex gives $\sum_v \deg(v)$. Grouping by edge gives $2|E|$, since each edge has exactly two endpoints.`,
        display: r`|I| = \sum_{v\in V} \deg(v) = \sum_{e \in E} 2 = 2|E|`,
        visNote: 'Hover a vertex to count its stubs; hover an edge to see its two stubs.',
      },
      {
        label: 'Split by parity',
        body: r`Partition $V$ into $V_{\text{even}}$ and $V_{\text{odd}}$ by the parity of degree, and split the sum accordingly.`,
        display: r`\sum_{v \in V_{\text{even}}} \deg(v) \;+\; \sum_{v \in V_{\text{odd}}} \deg(v) \;=\; 2|E|`,
      },
      {
        label: 'Isolate the odd part',
        body: r`The first sum is even (a sum of even numbers) and the right-hand side is even, so the second sum is even. A sum of odd numbers is even exactly when there is an even count of them.`,
        display: r`|V_{\text{odd}}| \equiv 0 \pmod 2`,
      },
      {
        label: 'Conclude',
        body: r`Hence $\sum_v \deg(v) = 2|E|$ and the number of odd-degree vertices is even. $\blacksquare$`,
      },
      {
        label: 'Immediate corollaries',
        body: r`No graph has exactly one odd-degree vertex; in any group, the number of people who shook an odd number of hands is even; a $k$-regular graph on $n$ vertices needs $kn$ even, so no 3-regular graph on 5 vertices exists.`,
      },
    ],
    prerequisites: [],
    softLinks: [
      { to: 'euler-circuit', why: 'Parity of degrees is exactly the obstruction to an Eulerian circuit.' },
      { to: 'induction-sum', why: 'Both are double-counting arguments dressed differently.' },
      { to: 'pigeonhole', why: 'Elementary counting facts with disproportionate consequences.' },
    ],
    physical: {
      anchor: 'A room of handshakes',
      description:
        'Each handshake involves exactly two hands, so tallying hands-per-person always yields an even total. That is why a claim like "exactly three people shook an odd number of hands" is refutable without knowing anything about who met whom.',
    },
    applications: [
      'Sanity checks on graph degree sequences',
      'Impossibility results for regular network topologies',
      'Mesh validity checks in computational geometry',
    ],
    visId: 'handshake',
  },
  {
    id: 'euler-circuit',
    title: 'Euler Circuits Exist Exactly When Every Degree Is Even',
    category: 'graphs',
    order: 2,
    tagline: 'Königsberg has no walking tour, and parity is the whole reason.',
    techniques: ['induction', 'construction', 'contradiction'],
    difficulty: 3,
    statement:
      r`A connected graph $G$ (with at least one edge) has a closed walk using every edge exactly once if and only if every vertex has even degree.`,
    intuition:
      r`Every time the tour visits a vertex it uses one edge to arrive and one to leave, consuming edges in pairs. So each degree must be even. Conversely, evenness means you can never get stranded: any walk that runs out of moves must be back where it started, and leftover edges form smaller even graphs you can splice in.`,
    steps: [
      {
        label: 'Necessity',
        body: r`Suppose an Euler circuit exists. Traverse it and pair each arrival at a vertex with the corresponding departure. Every incidence at $v$ is used exactly once and is either an arrival or a departure, and they match up, so $\deg(v)$ is even (the start vertex’s initial departure pairs with the final arrival).`,
      },
      {
        label: 'Sufficiency: walk until stuck',
        body: r`Assume $G$ is connected with all degrees even. Start at any vertex $v_0$ and walk without repeating edges, greedily. Whenever you enter a vertex $u \neq v_0$ you have used an odd number of $u$’s edges, and $\deg(u)$ is even, so an unused edge remains — you cannot be stuck. Hence the walk can only halt at $v_0$, producing a closed circuit $C$.`,
        visNote: 'Trace a walk; the degree counter shows why only the start vertex can trap you.',
      },
      {
        label: 'Splice the remainder',
        body: r`Remove $C$’s edges. Each vertex lost an even number of edges, so all degrees in $G - C$ are still even. If edges remain, connectivity of $G$ guarantees some component of $G - C$ shares a vertex $u$ with $C$.`,
        display: r`\deg_{G-C}(v) = \deg_G(v) - (\text{even}) \equiv 0 \pmod 2`,
      },
      {
        label: 'Induct',
        body: r`By induction on the number of edges, that component has an Euler circuit $C'$ through $u$. Insert $C'$ into $C$ at $u$: the combined closed walk uses every edge of both exactly once. Repeating absorbs all components.`,
        visNote: 'The splice animation inserts the sub-circuit at the shared vertex.',
      },
      {
        label: 'Conclude',
        body: r`Both directions hold, so Euler circuits exist iff all degrees are even. Königsberg’s four landmasses have degrees $3,3,3,5$ — all odd — so no tour exists. $\blacksquare$`,
      },
      {
        label: 'Open trails',
        body: r`Allowing different start and end vertices, the same pairing argument shows an Euler *trail* exists iff exactly zero or two vertices have odd degree — and by the handshake lemma, "exactly one" is impossible.`,
      },
    ],
    prerequisites: ['handshake-lemma', 'induction-sum'],
    softLinks: [
      { to: 'handshake-lemma', why: 'Supplies the parity bookkeeping the proof runs on.' },
      { to: 'pumping-lemma', why: 'Both reason about walks that must revisit structure.' },
      { to: 'max-flow-min-cut', why: 'Conservation at a vertex — in-degree equals out-degree — is the flow condition.' },
    ],
    physical: {
      anchor: 'A snowplough or postal route',
      description:
        'Plough every street once and return to the depot: possible exactly when every intersection has an even number of streets. Real cities do not, which is why route planners must allow repeated streets — the Chinese postman problem is the minimal repair to parity.',
    },
    applications: [
      'Route inspection / snowplough routing',
      'De Bruijn sequences and genome assembly (Eulerian path assembly)',
      'PCB drilling and one-stroke drawing problems',
    ],
    visId: 'euler',
  },
  {
    id: 'bipartite-odd-cycle',
    title: 'A Graph Is 2-Colourable Iff It Has No Odd Cycle',
    category: 'graphs',
    order: 3,
    tagline: 'Colours alternate along a walk, so a closed odd walk cannot close.',
    techniques: ['construction', 'contradiction', 'invariant'],
    difficulty: 2,
    statement:
      r`A graph $G$ is bipartite (properly 2-colourable) if and only if it contains no cycle of odd length.`,
    intuition:
      r`Two-colouring means colour flips along every edge, so the colour of a vertex is decided by the parity of its distance from a root. An odd cycle would return you to the start after an odd number of flips — with the wrong colour. If no odd cycle exists, parity is consistent and BFS layers give the colouring.`,
    steps: [
      {
        label: 'Bipartite ⟹ no odd cycle',
        body: r`Let $c : V \to \{0,1\}$ be a proper 2-colouring and let $v_0 v_1 \cdots v_k = v_0$ be a cycle. Each edge flips the colour, so $c(v_i) = c(v_0) + i \bmod 2$. Closing the cycle needs $c(v_0) = c(v_0) + k$, forcing $k$ even.`,
        display: r`c(v_i) \equiv c(v_0) + i \pmod 2 \;\Longrightarrow\; k \equiv 0 \pmod 2`,
      },
      {
        label: 'No odd cycle ⟹ colour by parity',
        body: r`Assume $G$ connected (else colour each component separately). Fix a root $s$ and set $c(v) = \operatorname{dist}(s,v) \bmod 2$, the BFS layer parity.`,
        visNote: 'BFS layers appear as bands; colour is the band parity.',
      },
      {
        label: 'Check every edge',
        body: r`Take an edge $\{u,v\}$. Distances from $s$ differ by at most one, so either $|\operatorname{dist}(s,u) - \operatorname{dist}(s,v)| = 1$ (colours differ, fine) or the distances are equal.`,
      },
      {
        label: 'Equal distances give an odd cycle',
        body: r`If $\operatorname{dist}(s,u) = \operatorname{dist}(s,v) = d$, take shortest paths $s \to u$ and $s \to v$ and let $x$ be their last common vertex, at distance $a$. The two path segments have length $d - a$ each, and adding $\{u,v\}$ closes a cycle of length $2(d-a) + 1$ — odd, contradicting the hypothesis.`,
        display: r`|C| = (d-a) + (d-a) + 1 = 2(d-a) + 1 \text{ is odd}`,
        visNote: 'A same-layer edge is drawn in red together with the odd cycle it creates.',
      },
      {
        label: 'Conclude',
        body: r`So no edge joins vertices of equal parity: $c$ is a proper 2-colouring and $G$ is bipartite. Both directions give the equivalence. $\blacksquare$`,
      },
      {
        label: 'Algorithmic payoff',
        body: r`The proof *is* the algorithm: one BFS in $O(|V| + |E|)$ either 2-colours the graph or hands back an explicit odd cycle as a certificate of impossibility. Deciding 3-colourability, by contrast, is NP-complete.`,
      },
    ],
    prerequisites: ['handshake-lemma'],
    softLinks: [
      { to: 'max-flow-min-cut', why: 'Bipartite structure is the setting for matching, solved by flow.' },
      { to: 'clique-reduction', why: 'Marks the easy/hard boundary: 2-colouring is linear, 3-colouring NP-complete.' },
      { to: 'binary-search-invariant', why: 'Both proofs turn into their algorithm with no extra work.' },
    ],
    physical: {
      anchor: 'A chessboard, and a knight that cannot return in odd time',
      description:
        'Squares alternate colour, so any sequence of moves that changes colour every step must take an even number of steps to come home. The same parity constraint decides whether a set of tasks can be split into two conflict-free shifts.',
    },
    applications: [
      'Detecting scheduling conflicts and two-sided assignment problems',
      'Bipartite matching (jobs to workers, ads to slots)',
      'Consistency checking in constraint graphs',
    ],
    visId: 'bipartite',
  },
];
