import type { Proof } from '../../types';
import { r } from '../raw';

export const geometry: Proof[] = [
  {
    id: 'pythagoras-rearrangement',
    title: 'Pythagoras by Rearrangement',
    category: 'geometry',
    order: 1,
    tagline: 'Two tilings of the same square, four triangles moved.',
    techniques: ['construction', 'direct'],
    difficulty: 1,
    statement:
      r`In a right triangle with legs $a, b$ and hypotenuse $c$, $a^2 + b^2 = c^2$.`,
    statementDisplay: r`a^2 + b^2 = c^2`,
    intuition:
      r`Take a square of side $a+b$ and place four copies of the triangle inside it in two different ways. In the first arrangement the uncovered region is two squares of areas $a^2$ and $b^2$; in the second it is one tilted square of area $c^2$. Same container, same four triangles, so the leftovers match.`,
    steps: [
      {
        label: 'The container',
        body: r`Consider a square of side $a + b$, so its area is $(a+b)^2$. All arrangements below place four congruent copies of the right triangle (legs $a$, $b$, hypotenuse $c$) inside it without overlap.`,
        display: r`(a+b)^2 = a^2 + 2ab + b^2`,
        visNote: 'Drag the slider to slide the four triangles between the two arrangements.',
      },
      {
        label: 'Arrangement A',
        body: r`Pack the four triangles into two corner rectangles, leaving an $a \times a$ square and a $b \times b$ square uncovered. The four triangles have total area $4 \cdot \tfrac12 ab = 2ab$.`,
        display: r`(a+b)^2 = 2ab + a^2 + b^2`,
      },
      {
        label: 'Arrangement B',
        body: r`Now place one triangle in each corner with legs along the sides, rotated by $90°$ successively. The uncovered middle region is a quadrilateral with all four sides equal to $c$.`,
      },
      {
        label: 'The middle really is a square',
        body: r`At each side of the container, the two acute angles of adjacent triangles, $\alpha$ and $\beta$, meet the middle quadrilateral. Since $\alpha + \beta = 90°$ in a right triangle, the remaining angle is $180° - 90° = 90°$. So all four angles are right and the middle is a square of side $c$, area $c^2$.`,
        display: r`\alpha + \beta = 90° \;\Longrightarrow\; \text{middle angle} = 90°`,
      },
      {
        label: 'Equate the two counts',
        body: r`Both arrangements fill the same container with the same four triangles, so the uncovered areas are equal.`,
        display: r`2ab + c^2 = (a+b)^2 = 2ab + a^2 + b^2 \;\Longrightarrow\; c^2 = a^2 + b^2`,
      },
      {
        label: 'Conclude',
        body: r`Cancelling $2ab$ gives $a^2 + b^2 = c^2$. $\blacksquare$`,
      },
      {
        label: 'Why this matters computationally',
        body: r`The identity *defines* Euclidean distance, and hence every $\ell_2$ norm, least-squares objective and nearest-neighbour search. Changing the exponent gives other metrics ($\ell_1$, $\ell_\infty$) with genuinely different geometry — Pythagoras is a choice, not a necessity.`,
      },
    ],
    prerequisites: [],
    softLinks: [
      { to: 'cauchy-schwarz', why: 'Cauchy–Schwarz is what makes "angle" and hence Pythagoras meaningful in n dimensions.' },
      { to: 'handshake-lemma', why: 'Both are proofs by counting the same object two ways.' },
    ],
    physical: {
      anchor: 'A carpenter’s 3-4-5 triangle',
      description:
        'Measure three units along one wall, four along the other, and if the diagonal is exactly five the corner is square. Builders have used this since antiquity — the theorem is a physical tool for manufacturing right angles, not just a fact about them.',
    },
    applications: [
      'Euclidean distance in every ML and graphics pipeline',
      'Collision detection and spatial indexing',
      'Norms, error metrics and least squares',
    ],
    visId: 'pythagoras',
  },
  {
    id: 'cauchy-schwarz',
    title: 'The Cauchy–Schwarz Inequality',
    category: 'geometry',
    order: 2,
    tagline: 'A dot product never beats the product of lengths — because a square is never negative.',
    techniques: ['direct', 'construction'],
    difficulty: 3,
    statement:
      r`For vectors $u, v$ in a real inner product space, $|\langle u, v\rangle| \le \|u\|\,\|v\|$, with equality iff $u$ and $v$ are linearly dependent.`,
    statementDisplay: r`\left|\sum_{i=1}^n u_i v_i\right| \;\le\; \sqrt{\sum_i u_i^2}\,\sqrt{\sum_i v_i^2}`,
    intuition:
      r`Project $u$ onto $v$ and look at the leftover component. Its squared length cannot be negative, and expanding that single statement *is* the inequality. Equality means nothing was left over — the vectors were parallel all along.`,
    steps: [
      {
        label: 'Handle the trivial case',
        body: r`If $v = 0$ both sides are $0$ and the vectors are dependent, so assume $v \neq 0$ and set $t^\ast = \langle u, v\rangle / \|v\|^2$, the coefficient of the projection of $u$ onto $v$.`,
      },
      {
        label: 'Look at the residual',
        body: r`Let $w = u - t^\ast v$ be the component of $u$ orthogonal to $v$. Non-negativity of the squared norm is the only fact used in the whole proof.`,
        display: r`0 \le \|w\|^2 = \langle u - t^\ast v,\; u - t^\ast v\rangle`,
        visNote: 'Drag either vector; the residual w and the two sides of the inequality update live.',
      },
      {
        label: 'Expand',
        body: r`Bilinearity and symmetry of the inner product give a cancellation: the cross terms combine into a single subtraction.`,
        display: r`0 \le \|u\|^2 - 2t^\ast\langle u,v\rangle + (t^\ast)^2\|v\|^2 = \|u\|^2 - \frac{\langle u, v\rangle^2}{\|v\|^2}`,
      },
      {
        label: 'Rearrange',
        body: r`Multiplying by $\|v\|^2 > 0$ and taking square roots gives the inequality.`,
        display: r`\langle u, v\rangle^2 \le \|u\|^2\|v\|^2 \;\Longrightarrow\; |\langle u,v\rangle| \le \|u\|\|v\|`,
      },
      {
        label: 'Equality case',
        body: r`Equality holds exactly when $\|w\|^2 = 0$, i.e. $u = t^\ast v$ — precisely linear dependence. $\blacksquare$`,
      },
      {
        label: 'Consequences',
        body: r`Cauchy–Schwarz licenses defining $\cos\theta = \langle u,v\rangle/(\|u\|\|v\|)$, since the quotient lies in $[-1,1]$; it yields the triangle inequality $\|u+v\| \le \|u\| + \|v\|$ by expanding $\|u+v\|^2$; and it bounds correlation coefficients by $1$.`,
        display: r`\|u+v\|^2 = \|u\|^2 + 2\langle u,v\rangle + \|v\|^2 \le (\|u\| + \|v\|)^2`,
      },
    ],
    prerequisites: ['pythagoras-rearrangement'],
    softLinks: [
      { to: 'markov-inequality', why: 'Both derive a global inequality from a pointwise non-negativity.' },
      { to: 'perron-pagerank', why: 'Norms and inner products are the language of convergence proofs.' },
      { to: 'birthday-collision', why: 'Correlation bounds constrain how much randomness can be shared.' },
    ],
    physical: {
      anchor: 'A shadow is never longer than the pole',
      description:
        'Shine light straight down on a leaning pole: the shadow it casts on the ground is at most as long as the pole itself, and equal only when the pole lies flat. Cosine similarity in a search engine is the same shadow, measured in a space of word counts.',
    },
    applications: [
      'Cosine similarity in search and embeddings',
      'Bounding correlation and variance in statistics',
      'Convergence proofs for gradient methods',
    ],
    visId: 'cauchySchwarz',
  },
  {
    id: 'perron-pagerank',
    title: 'Why PageRank Converges',
    category: 'geometry',
    order: 3,
    tagline: 'Damping contracts distances, so the random surfer forgets where it started.',
    techniques: ['invariant', 'direct', 'construction'],
    difficulty: 4,
    statement:
      r`Let $P$ be a column-stochastic matrix on $n$ states, $\alpha \in (0,1)$, and $M = \alpha P + (1-\alpha)\frac{1}{n}\mathbf{1}\mathbf{1}^{\top}$. Then $M$ has a unique probability-vector fixed point $\pi$, and for any starting distribution $x_0$ the iteration $x_{k+1} = M x_k$ satisfies $\|x_k - \pi\|_1 \le 2\alpha^{k}$.`,
    statementDisplay: r`\pi = M\pi, \qquad \|x_k - \pi\|_1 \le 2\alpha^k \xrightarrow[k\to\infty]{} 0`,
    intuition:
      r`With probability $1-\alpha$ the surfer teleports to a uniformly random page, erasing all memory of where it was. So after $k$ steps the chance that *no* teleport has happened is $\alpha^k$, and only that vanishing fraction of the distribution can still remember the start. Convergence is a memory-loss argument, and $\alpha$ is the forgetting rate.`,
    steps: [
      {
        label: 'M maps distributions to distributions',
        body: r`If $x \ge 0$ with $\mathbf{1}^\top x = 1$, then $Px \ge 0$ has column sums preserved, and the teleport term contributes the uniform vector. So $Mx$ is again a probability vector, and the simplex $\Delta$ is invariant.`,
        display: r`\mathbf{1}^\top M x = \alpha \mathbf{1}^\top P x + (1-\alpha)\mathbf{1}^\top \tfrac{1}{n}\mathbf{1} = \alpha + (1-\alpha) = 1`,
      },
      {
        label: 'Difference vectors lose the teleport term',
        body: r`Take $x, y \in \Delta$ and let $\delta = x - y$, so $\mathbf{1}^\top \delta = 0$. The rank-one teleport term annihilates $\delta$ because it only depends on the total mass.`,
        display: r`M x - M y = \alpha P\delta + (1-\alpha)\tfrac1n \mathbf{1}(\mathbf{1}^\top \delta) = \alpha P \delta`,
        visNote: 'The right panel plots the L1 gap; note the perfectly geometric decay.',
      },
      {
        label: 'P is an L¹ contraction (non-expansive)',
        body: r`For column-stochastic $P$, $\|P\delta\|_1 = \sum_i |\sum_j P_{ij}\delta_j| \le \sum_j |\delta_j| \sum_i P_{ij} = \|\delta\|_1$ by the triangle inequality and unit column sums.`,
        display: r`\|Mx - My\|_1 = \alpha\|P\delta\|_1 \le \alpha \|x - y\|_1`,
      },
      {
        label: 'Banach fixed point',
        body: r`So $M$ is a contraction with modulus $\alpha < 1$ on the complete metric space $(\Delta, \|\cdot\|_1)$. By the contraction mapping theorem there is exactly one $\pi \in \Delta$ with $M\pi = \pi$, and iterates converge to it from anywhere.`,
      },
      {
        label: 'Rate',
        body: r`Applying the contraction $k$ times to $x_0$ and $\pi$, and using $\|x_0 - \pi\|_1 \le 2$ for probability vectors, gives the stated bound. With $\alpha = 0.85$, the error drops below $10^{-6}$ in about $90$ iterations regardless of graph size.`,
        display: r`\|x_k - \pi\|_1 \le \alpha^k \|x_0 - \pi\|_1 \le 2\alpha^k`,
      },
      {
        label: 'Conclude',
        body: r`PageRank is well defined (unique $\pi$) and computable by power iteration with a graph-independent convergence rate. $\blacksquare$`,
      },
      {
        label: 'What damping repairs',
        body: r`Without teleportation ($\alpha = 1$), dangling nodes leak mass and disconnected components each keep their own stationary vector, so no unique answer exists. The damping factor is not a heuristic knob: it is what makes the problem well posed.`,
        visNote: 'Set α = 1 with a rank sink to watch mass drain away.',
      },
    ],
    prerequisites: ['cauchy-schwarz', 'linearity-expectation'],
    softLinks: [
      { to: 'fermat-little', why: 'Both study iteration of a fixed map on a finite state space.' },
      { to: 'markov-inequality', why: 'Same Markov-chain setting; one bounds tails, one bounds mixing.' },
      { to: 'dijkstra-correctness', why: 'Both propagate information across a graph until it stabilizes.' },
    ],
    physical: {
      anchor: 'Dye diffusing in a network of connected tanks',
      description:
        'Pour dye anywhere in a plumbing network with a small pump that continuously redistributes a fraction of all water uniformly. Eventually the concentration pattern is the same regardless of where you poured — that steady state is the ranking, and the pump is the damping factor.',
    },
    applications: [
      'PageRank and graph centrality measures',
      'Markov chain Monte Carlo mixing-time analysis',
      'Recommendation via random walks with restart',
    ],
    visId: 'pagerank',
  },
];
