import type { Proof } from '../../types';
import { r } from '../raw';

export const complexity: Proof[] = [
  {
    id: 'sorting-lower-bound',
    title: 'Comparison Sorting Needs Ω(n log n) Comparisons',
    category: 'complexity',
    order: 1,
    tagline: 'A yes/no question yields one bit; permutations demand log n! of them.',
    techniques: ['counting', 'contradiction'],
    difficulty: 3,
    statement:
      r`Any deterministic algorithm that sorts $n$ distinct elements using only pairwise comparisons performs $\Omega(n \log n)$ comparisons in the worst case.`,
    statementDisplay: r`\text{worst-case comparisons} \;\ge\; \lceil \log_2 (n!) \rceil \;=\; \Omega(n \log n)`,
    intuition:
      r`Each comparison splits the space of still-possible input orderings into two. Starting from $n!$ candidate orderings and needing to finish with exactly one, you must halve at least $\log_2 n!$ times. It is a game of twenty questions where the answer space is the set of permutations.`,
    steps: [
      {
        label: 'Model as a decision tree',
        body: r`Fix the algorithm and $n$. Its behaviour on inputs that differ only in order is a binary tree: each internal node is a comparison "$a_i < a_j$?", each edge an answer, each leaf the permutation the algorithm outputs on reaching it. The number of comparisons on an input is the depth of its leaf.`,
        visNote: 'Each level of the tree shown is one comparison; leaves are candidate orderings.',
      },
      {
        label: 'Every permutation needs its own leaf',
        body: r`If two distinct input orderings led to the same leaf, the algorithm would apply the same permutation to both, and at most one of the two results can be sorted. Since the algorithm is correct on all $n!$ orderings, the tree has at least $n!$ leaves.`,
        display: r`\#\text{leaves} \ge n!`,
      },
      {
        label: 'Bound depth by leaf count',
        body: r`A binary tree of height $h$ has at most $2^h$ leaves (immediate induction on $h$). Therefore $2^h \ge n!$, so $h \ge \log_2(n!)$.`,
        display: r`2^{h} \;\ge\; \#\text{leaves} \;\ge\; n! \;\Longrightarrow\; h \ge \log_2 (n!)`,
      },
      {
        label: 'Estimate log n!',
        body: r`Keeping only the largest half of the factors, $n! \ge (n/2)^{n/2}$, so $\log_2 n! \ge \frac{n}{2} \log_2 \frac{n}{2} = \Omega(n \log n)$. (Stirling sharpens this to $n \log_2 n - n \log_2 e + O(\log n)$.)`,
        display: r`\log_2(n!) \;\ge\; \frac{n}{2}\log_2\frac{n}{2} \;=\; \Omega(n \log n)`,
      },
      {
        label: 'Conclude',
        body: r`The worst-case comparison count equals the tree height, which is $\Omega(n \log n)$. Merge sort and heapsort match this, so the bound is tight. $\blacksquare$`,
      },
      {
        label: 'How counting sort escapes',
        body: r`The bound only constrains algorithms whose *only* primitive is comparison. Counting and radix sort read the digits of keys, extracting more than one bit per operation, and run in $O(n)$ for bounded key ranges. Lower bounds always bind a model, never a problem.`,
      },
    ],
    prerequisites: ['pigeonhole', 'induction-sum'],
    softLinks: [
      { to: 'kraft-inequality', why: 'Also a leaf-budget argument on a binary tree; sorting and coding share the same geometry.' },
      { to: 'huffman-optimality', why: 'Both convert "expected depth in a binary tree" into a cost.' },
      { to: 'cantor-diagonal', why: 'Comparing the size of an outcome set against a set of descriptions.' },
    ],
    physical: {
      anchor: 'A balance scale with no weights',
      description:
        'You can only ever learn "left is heavier" or "right is heavier" — one bit per weighing. Identifying the exact ranking of twelve coins takes at least log₂(12!) ≈ 29 weighings no matter how cleverly you plan them.',
    },
    applications: [
      'Justifies O(n log n) as the practical sorting target',
      'Explains when radix/counting sort is worth the memory',
      'Template for information-theoretic lower bounds',
    ],
    visId: 'decisionTree',
  },
  {
    id: 'master-theorem',
    title: 'The Master Theorem for Divide and Conquer',
    category: 'complexity',
    order: 2,
    tagline: 'Weigh the leaves against the root; the heavier level wins.',
    techniques: ['induction', 'counting'],
    difficulty: 3,
    statement:
      r`Let $T(n) = a\,T(n/b) + f(n)$ with $a \ge 1$, $b > 1$, and let $c^* = \log_b a$. If $f(n) = O(n^{c^* - \varepsilon})$ then $T(n) = \Theta(n^{c^*})$. If $f(n) = \Theta(n^{c^*})$ then $T(n) = \Theta(n^{c^*} \log n)$. If $f(n) = \Omega(n^{c^* + \varepsilon})$ and $a f(n/b) \le k f(n)$ for some $k < 1$, then $T(n) = \Theta(f(n))$.`,
    intuition:
      r`Draw the recursion tree. Level $j$ contains $a^j$ subproblems of size $n/b^j$, so its total work is $a^j f(n/b^j)$. That sequence is essentially geometric: either it grows toward the leaves (case 1), stays flat (case 2), or decays from the root (case 3). The answer is the dominant end, plus a $\log_b n$ factor when everything ties.`,
    steps: [
      {
        label: 'Unroll the recurrence',
        body: r`Expanding $T$ down to the base case at depth $L = \log_b n$ gives a sum over levels, plus the cost of the leaves.`,
        display: r`T(n) \;=\; \sum_{j=0}^{L-1} a^{j} f\!\left(\frac{n}{b^{j}}\right) \;+\; a^{L}\,T(1), \qquad L = \log_b n`,
        visNote: 'Each row of the tree is one term of the sum; bar width shows that row’s total work.',
      },
      {
        label: 'Count the leaves',
        body: r`There are $a^{L} = a^{\log_b n} = n^{\log_b a} = n^{c^*}$ leaves, each costing $\Theta(1)$. The exponent $c^*$ is the crossover rate: the leaf level alone costs $\Theta(n^{c^*})$.`,
        display: r`a^{\log_b n} = n^{\log_b a} = n^{c^*}`,
      },
      {
        label: 'Case 1: leaves dominate',
        body: r`If $f(n) = O(n^{c^*-\varepsilon})$ then level $j$ costs $O(a^j (n/b^j)^{c^*-\varepsilon}) = O(n^{c^*-\varepsilon} b^{j\varepsilon})$, a geometric series increasing in $j$ and dominated by its last term. Summing gives $O(n^{c^*})$, and the leaves supply the matching lower bound.`,
      },
      {
        label: 'Case 2: every level ties',
        body: r`If $f(n) = \Theta(n^{c^*})$ then $a^j f(n/b^j) = \Theta(a^j (n/b^j)^{c^*}) = \Theta(n^{c^*})$, the same for every level. With $L = \log_b n$ levels the total is $\Theta(n^{c^*} \log n)$ — this is merge sort, with $a = b = 2$, $c^* = 1$.`,
        display: r`\sum_{j=0}^{\log_b n} \Theta(n^{c^*}) = \Theta\!\left(n^{c^*} \log n\right)`,
      },
      {
        label: 'Case 3: the root dominates',
        body: r`The regularity condition $a f(n/b) \le k f(n)$ with $k<1$ makes the level costs decay geometrically from the root: level $j$ costs at most $k^j f(n)$. Summing the geometric series gives $f(n)/(1-k) = O(f(n))$, and level $0$ gives the lower bound.`,
      },
      {
        label: 'Conclude',
        body: r`In each case the sum is a geometric series whose dominant term is the stated bound; a routine induction on $n$ converts the level-sum estimate into a formal proof of the closed form. $\blacksquare$`,
      },
    ],
    prerequisites: ['induction-sum'],
    softLinks: [
      { to: 'quicksort-expected', why: 'Randomized recursion gives the same balanced-split intuition in expectation.' },
      { to: 'sorting-lower-bound', why: 'Case 2 lands exactly on the n log n lower bound; the two proofs meet.' },
      { to: 'induction-sum', why: 'Closing the level sum is the same telescoping algebra.' },
    ],
    physical: {
      anchor: 'An organization chart, or a river delta',
      description:
        'Work either piles up at the top (one manager doing everything) or spreads out at the bottom (a thousand workers). The theorem is a rule for which end of the hierarchy carries the load, and the tie case is the branching river where every level moves the same volume of water.',
    },
    applications: [
      'Instant running times for merge sort, binary search, Karatsuba, Strassen',
      'Designing parallel divide-and-conquer schedules',
      'Predicting whether to optimize the split or the combine step',
    ],
    visId: 'recursionTree',
  },
  {
    id: 'amortized-array',
    title: 'Doubling Arrays: Amortized O(1) Append',
    category: 'complexity',
    order: 3,
    tagline: 'Each cheap push prepays for a future expensive copy.',
    techniques: ['amortized', 'counting'],
    difficulty: 2,
    statement:
      r`Starting from an empty dynamic array with capacity $1$ that doubles its capacity whenever full, any sequence of $n$ appends costs $O(n)$ total time, i.e. $O(1)$ amortized per append.`,
    intuition:
      r`Resizes are rare and their cost is geometric: copying $1, 2, 4, \dots$ elements sums to less than $2n$. Equivalently, charge every push three tokens — one to write itself, two saved to pay for copying itself and one older element later. The savings account never goes negative, so the average cost is constant.`,
    steps: [
      {
        label: 'Aggregate analysis',
        body: r`A resize happens exactly when the length reaches a power of two, and a resize at capacity $2^k$ copies $2^k$ elements. Over $n$ appends the resize costs sum to a geometric series.`,
        display: r`\sum_{k=0}^{\lfloor \log_2 n \rfloor} 2^{k} \;<\; 2^{\lfloor \log_2 n\rfloor + 1} \;\le\; 2n`,
        visNote: 'The tall spikes are resizes; the running average line stays flat.',
      },
      {
        label: 'Add the cheap work',
        body: r`Each append also does $\Theta(1)$ work to store its own element, contributing $n$. Total cost is at most $n + 2n = 3n$, hence $O(n)$ for the sequence and $O(1)$ amortized each.`,
      },
      {
        label: 'Potential method',
        body: r`For a rigorous per-operation bound define the potential $\Phi = 2 \cdot \text{size} - \text{capacity}$ (which is $\ge 0$ whenever the array is at least half full, an invariant maintained by doubling on full).`,
        display: r`\hat{c}_i = c_i + \Phi_i - \Phi_{i-1}`,
      },
      {
        label: 'Check both cases',
        body: r`Non-resizing append: $c_i = 1$ and $\Phi$ rises by $2$, so $\hat c_i = 3$. Resizing append at size $s$ = capacity: $c_i = s + 1$, while capacity goes $s \to 2s$ so $\Phi$ changes from $2s - s = s$ to $2(s+1) - 2s = 2$, a drop of $s - 2$. Then $\hat c_i = (s+1) + (2 - s) = 3$.`,
        display: r`\hat c_i = 3 \text{ in both cases}`,
      },
      {
        label: 'Conclude',
        body: r`Since $\Phi_0 = 0$ and $\Phi_n \ge 0$, the true total is $\sum c_i \le \sum \hat c_i = 3n = O(n)$. Every append costs $3$ amortized units. $\blacksquare$`,
      },
      {
        label: 'Why doubling and not +1',
        body: r`Growing by a constant $d$ instead resizes every $d$ appends and copies $\Theta(n)$ each time, totalling $\Theta(n^2/d)$ — quadratic. Any growth factor $>1$ gives a geometric series and hence linear total cost; the factor only trades memory slack against copy frequency.`,
      },
    ],
    prerequisites: ['induction-sum', 'master-theorem'],
    softLinks: [
      { to: 'linearity-expectation', why: 'Both replace "worst case per step" with a global average that is easier to bound.' },
      { to: 'markov-inequality', why: 'Amortized bounds and tail bounds are two ways to tame rare expensive events.' },
    ],
    physical: {
      anchor: 'Moving to a bigger apartment',
      description:
        'Each move is expensive and disruptive, but you double the space each time, so you move only a logarithmic number of times in a lifetime. Averaged over all the boxes you ever own, the moving cost per box is a small constant.',
    },
    applications: [
      'std::vector, Python list, Java ArrayList growth policies',
      'Hash table rehashing budgets',
      'Amortized analysis of union-find and splay trees',
    ],
    visId: 'amortized',
  },
  {
    id: 'clique-reduction',
    title: 'Reductions Preserve Hardness: 3-SAT ≤ₚ CLIQUE',
    category: 'complexity',
    order: 4,
    tagline: 'Rewrite one problem as another and hardness travels along the map.',
    techniques: ['construction', 'direct'],
    difficulty: 4,
    statement:
      r`There is a polynomial-time computable map from 3-CNF formulas $\varphi$ with $m$ clauses to graphs $G_\varphi$ such that $\varphi$ is satisfiable if and only if $G_\varphi$ contains a clique of size $m$. Hence CLIQUE is NP-hard.`,
    intuition:
      r`Make one vertex per literal-occurrence, grouped by clause. Join two vertices exactly when they are in different clauses and are not each other’s negation — that is, when they could be true simultaneously. A clique of size $m$ then means "one compatible true literal chosen from every clause", which is precisely a satisfying assignment.`,
    steps: [
      {
        label: 'Build the graph',
        body: r`Given $\varphi = C_1 \wedge \cdots \wedge C_m$ with $C_i = (\ell_{i1} \vee \ell_{i2} \vee \ell_{i3})$, let the vertex set be the $3m$ pairs $(i, j)$ representing occurrence $\ell_{ij}$. Add an edge between $(i,j)$ and $(k,l)$ iff $i \neq k$ and $\ell_{ij} \neq \neg \ell_{kl}$.`,
        display: r`V = \{(i,j)\}, \quad E = \{\, \{(i,j),(k,l)\} : i \neq k,\ \ell_{ij} \neq \neg\ell_{kl} \,\}`,
        visNote: 'Clauses are columns; edges only ever cross columns, never within one.',
      },
      {
        label: 'Polynomial time',
        body: r`The graph has $3m$ vertices and at most $\binom{3m}{2}$ edges, each testable in constant time, so $G_\varphi$ is constructed in $O(m^2)$ time — polynomial in the size of $\varphi$.`,
      },
      {
        label: 'Satisfiable ⟹ clique',
        body: r`Let $\alpha$ satisfy $\varphi$. Each clause has at least one literal true under $\alpha$; pick one such occurrence per clause, giving $m$ vertices in distinct clauses. No two are negations of each other, since $\alpha$ cannot make both $x$ and $\neg x$ true. So all pairs are adjacent: a clique of size $m$.`,
      },
      {
        label: 'Clique ⟹ satisfiable',
        body: r`Let $K$ be a clique of size $m$. Since there are no edges within a clause, $K$ contains exactly one vertex per clause. Its literals are pairwise non-contradictory, so setting each of them true is consistent; extend arbitrarily to all variables. Every clause now has a true literal, so $\varphi$ is satisfied.`,
        visNote: 'Selecting a clique lights up the induced assignment in the truth panel.',
      },
      {
        label: 'Conclude',
        body: r`The map is polynomial and preserves the answer in both directions, so 3-SAT $\le_p$ CLIQUE. Since 3-SAT is NP-complete (Cook–Levin), CLIQUE is NP-hard; membership in NP is witnessed by the clique itself. $\blacksquare$`,
      },
      {
        label: 'What a reduction really transports',
        body: r`A reduction is a *conditional*: if CLIQUE had a polynomial algorithm, so would 3-SAT. It says nothing absolute about either problem’s difficulty. This is why NP-completeness is a web of relative statements anchored to one open question.`,
      },
    ],
    prerequisites: ['sorting-lower-bound'],
    softLinks: [
      { to: 'rice-theorem', why: 'Same proof shape — a computable instance transformation preserving yes/no answers.' },
      { to: 'max-flow-min-cut', why: 'Contrast: a combinatorial problem where structure yields a polynomial algorithm instead.' },
      { to: 'bipartite-odd-cycle', why: '2-colouring is easy while 3-colouring is NP-hard; the reduction boundary sits between them.' },
    ],
    physical: {
      anchor: 'A translation dictionary between two puzzles',
      description:
        'Sudoku solvers and crossword solvers look unrelated until you find a phrasebook that converts any Sudoku into a crossword with the same answer. Then a fast crossword solver instantly solves Sudoku too — and the puzzles are revealed as one puzzle in two costumes.',
    },
    applications: [
      'Proving new problems NP-hard from known ones',
      'Recognizing when to stop searching for an exact polynomial algorithm',
      'SAT solvers as universal engines for encoded problems',
    ],
    visId: 'clique',
  },
];
