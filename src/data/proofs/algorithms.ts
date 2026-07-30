import type { Proof } from '../../types';
import { r } from '../raw';

export const algorithms: Proof[] = [
  {
    id: 'binary-search-invariant',
    title: 'Binary Search Is Correct (Loop Invariants)',
    category: 'algorithms',
    order: 1,
    tagline: 'Keep one sentence true forever and correctness falls out at the end.',
    techniques: ['invariant', 'induction'],
    difficulty: 2,
    statement:
      r`Let $A[0..n-1]$ be sorted ascending and $t$ a target. The loop with $\text{lo} = 0$, $\text{hi} = n$, repeatedly setting $\text{mid} = \lfloor (\text{lo}+\text{hi})/2 \rfloor$ and narrowing to $[\text{lo}, \text{mid})$ or $[\text{mid}+1, \text{hi})$, terminates and returns an index of $t$ if $t \in A$, and reports absence otherwise.`,
    intuition:
      r`The invariant is "if $t$ is anywhere in the array, it is in $A[\text{lo} .. \text{hi}-1]$". Every comparison discards a half that provably cannot contain $t$ (because the array is sorted), so the invariant survives. The window shrinks every iteration, so the loop ends — and at that point the window is empty or a single hit.`,
    steps: [
      {
        label: 'State the invariant',
        body: r`Let $I$ be the assertion: $0 \le \text{lo} \le \text{hi} \le n$, and every index $i$ with $A[i] = t$ satisfies $\text{lo} \le i < \text{hi}$.`,
        display: r`I : \quad t \in A \;\Longrightarrow\; t \in A[\text{lo}..\text{hi}-1]`,
        visNote: 'The shaded window is the live range; grey cells are provably eliminated.',
      },
      {
        label: 'Establishment',
        body: r`Initially $\text{lo} = 0$, $\text{hi} = n$, so the range is the whole array and $I$ holds trivially.`,
      },
      {
        label: 'Preservation',
        body: r`Assume $I$ and $\text{lo} < \text{hi}$, so $\text{lo} \le \text{mid} < \text{hi}$ is a legal index. If $A[\text{mid}] < t$ then by sortedness $A[i] \le A[\text{mid}] < t$ for all $i \le \text{mid}$, so no occurrence of $t$ lies at or before $\text{mid}$; setting $\text{lo} \leftarrow \text{mid}+1$ preserves $I$. The case $A[\text{mid}] > t$ is symmetric with $\text{hi} \leftarrow \text{mid}$. If $A[\text{mid}] = t$ we return $\text{mid}$, which is correct.`,
        visNote: 'Step through comparisons; the invariant banner stays green.',
      },
      {
        label: 'Termination',
        body: r`The quantity $\text{hi} - \text{lo}$ is a non-negative integer that strictly decreases each iteration: $\text{mid} < \text{hi}$ makes the right branch shrink it, and $\text{mid} + 1 > \text{lo}$ makes the left branch shrink it. By well-ordering the loop cannot run forever.`,
        display: r`\text{hi} - \text{lo} \;\text{strictly decreases and is} \ge 0`,
      },
      {
        label: 'Postcondition',
        body: r`On exit either we returned a $\text{mid}$ with $A[\text{mid}] = t$ (correct), or $\text{lo} = \text{hi}$ so the live range is empty. By $I$, if $t$ were in $A$ it would lie in that empty range — impossible. So reporting absence is correct. $\blacksquare$`,
      },
      {
        label: 'Cost',
        body: r`The window length is at most halved each iteration, giving at most $\lceil \log_2 (n+1) \rceil$ iterations: $T(n) = T(n/2) + O(1)$, which is Master Theorem case 2 with $c^* = 0$, hence $\Theta(\log n)$.`,
      },
    ],
    prerequisites: ['induction-sum'],
    softLinks: [
      { to: 'master-theorem', why: 'The same halving recurrence, solved generally.' },
      { to: 'sorting-lower-bound', why: 'Each comparison yields one bit; log n bits pin down one of n positions.' },
      { to: 'euclid-gcd', why: 'Another loop proved by a decreasing non-negative measure.' },
    ],
    physical: {
      anchor: 'Finding a word in a paper dictionary',
      description:
        'Open the middle, decide which half the word is in, and the other half is gone forever — you never revisit it and you never doubt the decision, because the pages are ordered. The invariant is the confidence that the word, if it exists, is still between your thumbs.',
    },
    applications: [
      'Bounds in std::lower_bound, bisect, database index seeks',
      'Binary search on the answer for monotone predicates',
      'Template for proving any loop via invariant + decreasing measure',
    ],
    visId: 'binarySearch',
  },
  {
    id: 'quicksort-expected',
    title: 'Randomized Quicksort Runs in Expected O(n log n)',
    category: 'algorithms',
    order: 2,
    tagline: 'Count the probability that two elements ever meet.',
    techniques: ['probabilistic', 'counting'],
    difficulty: 4,
    statement:
      r`Randomized quicksort on $n$ distinct elements, choosing each pivot uniformly at random from the current subarray, performs $2n \ln n + O(n)$ comparisons in expectation.`,
    statementDisplay: r`\mathbb{E}[\#\text{comparisons}] = 2(n+1)H_n - 4n = O(n \log n)`,
    intuition:
      r`Instead of solving a recurrence, ask for each *pair* of elements how likely they are ever compared. Two elements are compared exactly when one of them is the first pivot chosen from the range between them — and every element in that range is equally likely to be first. So the probability depends only on the gap, and summing gives harmonic numbers.`,
    steps: [
      {
        label: 'Indicator variables',
        body: r`Sort the elements as $z_1 < z_2 < \cdots < z_n$ and let $X_{ij} = 1$ if $z_i$ and $z_j$ are ever compared, else $0$. Quicksort compares a pair at most once (comparisons always involve the current pivot, which is then removed), so the total comparison count is exactly $\sum_{i<j} X_{ij}$.`,
        display: r`X = \sum_{i=1}^{n-1}\sum_{j=i+1}^{n} X_{ij}`,
      },
      {
        label: 'Linearity of expectation',
        body: r`Expectation is linear regardless of dependence between the $X_{ij}$, so we only need each individual probability.`,
        display: r`\mathbb{E}[X] = \sum_{i<j} \Pr[z_i \text{ and } z_j \text{ are compared}]`,
      },
      {
        label: 'When are two elements compared?',
        body: r`Consider $Z_{ij} = \{z_i, \dots, z_j\}$. These stay together in the same subarray until a pivot from $Z_{ij}$ is chosen. If that first pivot is $z_i$ or $z_j$, the two are compared. If it is any interior $z_k$, they are separated into different subarrays and never compared.`,
        visNote: 'Highlight a pair; the shaded band is the interval whose first pivot decides their fate.',
      },
      {
        label: 'Compute the probability',
        body: r`By symmetry of uniform pivot choice, each of the $j - i + 1$ elements of $Z_{ij}$ is equally likely to be the first pivot chosen from that set, so two of those outcomes are favourable.`,
        display: r`\Pr[X_{ij} = 1] = \frac{2}{j - i + 1}`,
      },
      {
        label: 'Sum the harmonic series',
        body: r`Substituting $k = j - i$ and counting how often each gap occurs gives a harmonic sum, and $H_n = \ln n + O(1)$.`,
        display: r`\mathbb{E}[X] = \sum_{i=1}^{n-1}\sum_{k=1}^{n-i} \frac{2}{k+1} \;<\; 2n \sum_{k=1}^{n} \frac{1}{k} = 2nH_n = 2n\ln n + O(n)`,
      },
      {
        label: 'Conclude',
        body: r`Expected comparisons are $O(n \log n)$, and since all other work is proportional to comparisons, expected running time is $O(n \log n)$ — with no assumption whatsoever about the input order. $\blacksquare$`,
      },
      {
        label: 'Randomness moves the risk',
        body: r`Deterministic pivot rules have adversarial inputs forcing $\Theta(n^2)$. Randomizing does not remove the bad cases; it makes them unlikely *for every fixed input*, which is what an adversary cannot defeat.`,
      },
    ],
    prerequisites: ['master-theorem', 'linearity-expectation'],
    softLinks: [
      { to: 'linearity-expectation', why: 'This is the flagship application: sum indicators, ignore dependence.' },
      { to: 'sorting-lower-bound', why: 'Randomization cannot beat the n log n barrier, only meet it.' },
      { to: 'birthday-collision', why: 'Both count pairs and reason about which pair "collides" first.' },
    ],
    physical: {
      anchor: 'Splitting a deck of cards at a random card',
      description:
        'Cut the deck anywhere and sort each half. A wildly lopsided cut wastes work, but cuts are random and most are reasonable, so the total shuffling effort concentrates near its average — the same reason random load balancing works in practice.',
    },
    applications: [
      'Default sort in many standard libraries (with introsort fallbacks)',
      'Randomized selection (quickselect) in expected linear time',
      'Template for analysing randomized algorithms via indicators',
    ],
    visId: 'quicksort',
  },
  {
    id: 'dijkstra-correctness',
    title: 'Dijkstra’s Algorithm Finds Shortest Paths',
    category: 'algorithms',
    order: 3,
    tagline: 'The nearest unfinished node can no longer be improved.',
    techniques: ['invariant', 'induction', 'contradiction'],
    difficulty: 3,
    statement:
      r`Let $G = (V,E)$ have non-negative edge weights $w(u,v) \ge 0$ and source $s$. When Dijkstra’s algorithm extracts a vertex $u$ from the priority queue, $d[u] = \delta(s,u)$, the true shortest-path distance. Hence on termination $d[v] = \delta(s,v)$ for all reachable $v$.`,
    intuition:
      r`Distances are settled in increasing order. When the closest unsettled node is picked, any alternative route to it must leave the settled region and travel at least as far already — and non-negative weights mean the detour can never claw the distance back. That last clause is exactly what negative edges break.`,
    steps: [
      {
        label: 'Invariant to prove',
        body: r`Let $S$ be the set of extracted ("settled") vertices. The invariant is: for every $u \in S$, $d[u] = \delta(s,u)$; and for every $v \notin S$, $d[v]$ equals the length of the shortest path from $s$ to $v$ whose intermediate vertices all lie in $S$.`,
        visNote: 'Settled nodes are filled; the frontier labels are the tentative d-values.',
      },
      {
        label: 'Base case',
        body: r`Initially $S = \emptyset$, $d[s] = 0 = \delta(s,s)$ and $d[v] = \infty$ for $v \neq s$, which is correct since no paths through $\emptyset$ exist.`,
      },
      {
        label: 'Extraction is safe',
        body: r`Suppose the invariant holds and $u$ is extracted, i.e. $u$ minimizes $d$ among $V \setminus S$. Assume for contradiction $d[u] > \delta(s,u)$, and let $P$ be a true shortest path $s \to u$. Let $y$ be the first vertex of $P$ not in $S$, and $x$ its predecessor (so $x \in S$).`,
      },
      {
        label: 'Bound the alternative route',
        body: r`Since $x \in S$, $d[x] = \delta(s,x)$, and the relaxation of edge $(x,y)$ already happened when $x$ was extracted, so $d[y] \le d[x] + w(x,y) = \delta(s,y)$. As $y$ lies on a shortest path to $u$, the prefix is shortest: $\delta(s,y) \le \delta(s,u)$ using non-negativity of the remaining segment.`,
        display: r`d[y] \;\le\; \delta(s,y) \;\le\; \delta(s,u) \;<\; d[u]`,
      },
      {
        label: 'Contradiction',
        body: r`So $d[y] < d[u]$ with $y \notin S$, contradicting the choice of $u$ as the minimum. Hence $d[u] = \delta(s,u)$, and the invariant extends to $S \cup \{u\}$; relaxing $u$’s outgoing edges restores the second clause.`,
      },
      {
        label: 'Conclude',
        body: r`By induction on $|S|$ every extracted vertex has its final correct distance, so on termination all reachable distances are exact. $\blacksquare$`,
      },
      {
        label: 'Where non-negativity was used',
        body: r`Exactly once: to claim $\delta(s,y) \le \delta(s,u)$ for $y$ on the path to $u$. With a negative edge later on the path, a far-away node can become nearer, settled labels become wrong, and one needs Bellman–Ford instead.`,
        visNote: 'Toggle a negative edge to watch a settled label become stale.',
      },
    ],
    prerequisites: ['binary-search-invariant'],
    softLinks: [
      { to: 'mst-cut-property', why: 'Both are greedy algorithms proved by an exchange/cut argument.' },
      { to: 'max-flow-min-cut', why: 'Frontier arguments: what crosses the boundary between settled and unsettled.' },
      { to: 'induction-sum', why: 'The proof is induction on the size of the settled set.' },
    ],
    physical: {
      anchor: 'A wavefront of water spreading through a pipe network',
      description:
        'Water released at the source reaches junctions in order of distance; the moment it arrives somewhere is the shortest travel time, and it never arrives earlier by a longer route. A negative-weight pipe would be one where water arrives before it left — which is why the physical picture also tells you when the algorithm fails.',
    },
    applications: [
      'Routing in maps and networks (OSPF, IS-IS)',
      'A* search is Dijkstra with a heuristic potential',
      'Shortest paths in weighted planning and DP graphs',
    ],
    visId: 'dijkstra',
  },
  {
    id: 'mst-cut-property',
    title: 'The Cut Property and Why Greedy MST Works',
    category: 'algorithms',
    order: 4,
    tagline: 'The lightest edge across any cut belongs to some minimum tree.',
    techniques: ['exchange', 'contradiction'],
    difficulty: 3,
    statement:
      r`Let $G=(V,E)$ be connected with distinct edge weights and let $(S, V \setminus S)$ be any nontrivial cut. Then the unique minimum-weight edge $e$ crossing the cut belongs to every minimum spanning tree of $G$.`,
    intuition:
      r`Suppose a spanning tree avoids the lightest crossing edge. Adding that edge creates a cycle, and any cycle crossing a cut must cross it at least twice — so there is a heavier crossing edge in the cycle to throw away. The swap gives a lighter spanning tree, so the original could not have been minimum.`,
    steps: [
      {
        label: 'Setup',
        body: r`Let $T$ be a spanning tree of $G$ with $e = \{u, v\} \notin T$, where $u \in S$, $v \notin S$ and $e$ is the minimum-weight edge crossing the cut.`,
        visNote: 'Drag the cut boundary; crossing edges are highlighted and the lightest is marked.',
      },
      {
        label: 'Adding e creates a cycle',
        body: r`$T$ is spanning and acyclic, so it contains a unique path $P$ from $u$ to $v$. Then $T + e$ contains exactly one cycle, namely $P$ followed by $e$.`,
      },
      {
        label: 'The cycle crosses twice',
        body: r`The path $P$ starts in $S$ and ends outside $S$, so some edge $f \in P$ crosses the cut. Because $e$ is the unique minimum crossing edge and $f \neq e$, we have $w(f) > w(e)$.`,
        display: r`f \in P \text{ crosses the cut}, \quad w(f) > w(e)`,
      },
      {
        label: 'Exchange',
        body: r`Let $T' = T + e - f$. Removing $f$ from the unique cycle keeps the graph acyclic, and it stays connected because $e$ reconnects the two components $f$ split. So $T'$ is a spanning tree, and its weight is strictly smaller.`,
        display: r`w(T') = w(T) + w(e) - w(f) < w(T)`,
      },
      {
        label: 'Conclude',
        body: r`So any spanning tree omitting $e$ is not minimum; equivalently every MST contains $e$. $\blacksquare$`,
      },
      {
        label: 'Kruskal and Prim in one line',
        body: r`Prim adds the lightest edge leaving the built component — a cut edge, hence safe. Kruskal adds the globally lightest edge joining two components — the lightest edge across the cut separating one of them, hence safe. Both algorithms are the cut property applied repeatedly.`,
      },
      {
        label: 'Ties',
        body: r`With repeated weights the edge need only belong to *some* MST; breaking ties consistently (e.g. by index) restores uniqueness and the proof goes through verbatim.`,
      },
    ],
    prerequisites: ['dijkstra-correctness', 'handshake-lemma'],
    softLinks: [
      { to: 'huffman-optimality', why: 'Another greedy proved by exchanging two elements of a hypothetical optimum.' },
      { to: 'max-flow-min-cut', why: 'Cuts as the certificate object appear in both.' },
      { to: 'dijkstra-correctness', why: 'Same frontier-based greedy safety argument.' },
    ],
    physical: {
      anchor: 'Laying the cheapest cable between two islands',
      description:
        'However you divide a country into two regions, the cheapest single link spanning that divide will be in the national grid — because any alternative plan crossing the divide twice is wasting money on a redundant crossing.',
    },
    applications: [
      'Network design and clustering (single-linkage = Kruskal)',
      'Image segmentation and maze generation',
      'Approximation algorithms for TSP built on MSTs',
    ],
    visId: 'mstCut',
  },
  {
    id: 'max-flow-min-cut',
    title: 'Max-Flow Min-Cut Duality',
    category: 'algorithms',
    order: 5,
    tagline: 'The bottleneck you can point at is exactly the flow you can push.',
    techniques: ['duality', 'construction', 'contradiction'],
    difficulty: 4,
    statement:
      r`In a flow network $(G, c, s, t)$ with non-negative capacities, the maximum value of an $s$–$t$ flow equals the minimum capacity of an $s$–$t$ cut.`,
    statementDisplay: r`\max_{f} |f| \;=\; \min_{(S,T)} c(S,T)`,
    intuition:
      r`Every unit of flow must cross every cut, so no flow can beat the tightest cut — that direction is bookkeeping. The other direction is the surprise: when no augmenting path remains, the set of vertices still reachable in the residual graph *is* a cut whose capacity equals the current flow, so the bound is achieved exactly.`,
    steps: [
      {
        label: 'Weak duality',
        body: r`For any flow $f$ and any cut $(S,T)$ with $s \in S$, $t \in T$, conservation gives $|f| = f(S,T) - f(T,S) \le f(S,T) \le c(S,T)$. Hence $\max |f| \le \min c(S,T)$.`,
        display: r`|f| = f(S,T) - f(T,S) \le c(S,T)`,
        visNote: 'Any cut you draw shows its capacity; the flow value never exceeds it.',
      },
      {
        label: 'Three equivalent statements',
        body: r`We show (i) $f$ is a maximum flow; (ii) the residual graph $G_f$ has no augmenting $s \to t$ path; (iii) $|f| = c(S,T)$ for some cut. The cycle (i) ⟹ (ii) ⟹ (iii) ⟹ (i) proves the theorem.`,
      },
      {
        label: '(i) ⟹ (ii)',
        body: r`If an augmenting path existed with bottleneck residual capacity $\beta > 0$, pushing $\beta$ along it yields a valid flow of value $|f| + \beta$, contradicting maximality.`,
      },
      {
        label: '(ii) ⟹ (iii)',
        body: r`Let $S$ be the vertices reachable from $s$ in $G_f$; then $t \notin S$, so $(S, T)$ with $T = V \setminus S$ is a cut. For $u \in S$, $v \in T$: the edge $(u,v)$ must be saturated ($f(u,v) = c(u,v)$), else residual capacity would put $v$ in $S$; and $f(v,u) = 0$, else the residual back-edge would too.`,
        display: r`|f| = f(S,T) - f(T,S) = c(S,T) - 0 = c(S,T)`,
        visNote: 'Once no augmenting path is left, the reachable set lights up as the minimum cut.',
      },
      {
        label: '(iii) ⟹ (i)',
        body: r`By weak duality every flow is at most $c(S,T)$; a flow attaining it is therefore maximum (and that cut is minimum).`,
      },
      {
        label: 'Conclude',
        body: r`Max flow equals min cut, and Ford–Fulkerson terminates with integer capacities since each augmentation raises $|f|$ by at least $1$. $\blacksquare$`,
      },
      {
        label: 'What duality buys',
        body: r`The min cut is a *certificate*: a short, checkable reason why no better flow exists. Whenever a maximization has a matching minimization, you get both an algorithm and a proof of optimality — the pattern behind LP duality and König’s theorem for bipartite matching.`,
      },
    ],
    prerequisites: ['mst-cut-property'],
    softLinks: [
      { to: 'clique-reduction', why: 'Contrast in tractability: duality gives polynomial algorithms, reductions give hardness.' },
      { to: 'mst-cut-property', why: 'Cuts serve as the fundamental certificate in both theorems.' },
      { to: 'bipartite-odd-cycle', why: 'Bipartite matching is a unit-capacity flow; König’s theorem is this theorem in disguise.' },
    ],
    physical: {
      anchor: 'Traffic through a city with narrow bridges',
      description:
        'However you widen the highways, the rush-hour throughput of a city is set by one thin ring of bridges. Find the cheapest set of bridges whose removal disconnects downtown from the suburbs and you have measured the capacity of the whole network.',
    },
    applications: [
      'Bipartite matching and scheduling',
      'Image segmentation via graph cuts',
      'Network reliability and project selection',
    ],
    visId: 'maxflow',
  },
];
