import type { Proof } from '../../types';
import { r } from '../raw';

export const probability: Proof[] = [
  {
    id: 'linearity-expectation',
    title: 'Linearity of Expectation',
    category: 'probability',
    order: 1,
    tagline: 'Averages add even when the events are hopelessly entangled.',
    techniques: ['probabilistic', 'counting', 'direct'],
    difficulty: 2,
    statement:
      r`For random variables $X_1, \dots, X_n$ on a common probability space with finite expectations, and constants $c_1, \dots, c_n$, $\mathbb{E}\left[\sum_i c_i X_i\right] = \sum_i c_i \mathbb{E}[X_i]$ — with no independence assumption.`,
    statementDisplay: r`\mathbb{E}\!\left[\sum_{i=1}^{n} c_i X_i\right] = \sum_{i=1}^{n} c_i\, \mathbb{E}[X_i]`,
    intuition:
      r`Expectation is a weighted sum over outcomes, and sums can be reordered. Because the reordering never asks how the variables relate, dependence is irrelevant. That is what makes the tool so strong: hard global quantities become sums of trivial local probabilities.`,
    steps: [
      {
        label: 'Definition',
        body: r`For a discrete space $\Omega$ with probabilities $\Pr[\omega]$, expectation is a sum over outcomes weighted by probability.`,
        display: r`\mathbb{E}[X] = \sum_{\omega \in \Omega} \Pr[\omega]\, X(\omega)`,
      },
      {
        label: 'Swap the order of summation',
        body: r`Apply the definition to $Y = \sum_i c_i X_i$ and exchange the two finite sums — legitimate for finite sums, and for infinite ones under absolute convergence.`,
        display: r`\mathbb{E}[Y] = \sum_{\omega} \Pr[\omega] \sum_{i} c_i X_i(\omega) = \sum_{i} c_i \sum_{\omega} \Pr[\omega] X_i(\omega) = \sum_i c_i \mathbb{E}[X_i]`,
      },
      {
        label: 'Note what is absent',
        body: r`Nowhere did we factor a joint probability, so no independence was needed. By contrast $\mathbb{E}[XY] = \mathbb{E}[X]\mathbb{E}[Y]$ *does* require independence, and variance only adds for uncorrelated variables. $\blacksquare$`,
      },
      {
        label: 'Indicator technique',
        body: r`For an event $A$, the indicator $\mathbf{1}_A$ has $\mathbb{E}[\mathbf{1}_A] = \Pr[A]$. So to count occurrences, write the count as a sum of indicators and add up probabilities.`,
        display: r`\mathbb{E}\!\left[\#\text{events}\right] = \sum_{i} \Pr[A_i]`,
        visNote: 'Each row is one indicator; the running total is the count.',
      },
      {
        label: 'Worked example: fixed points',
        body: r`In a uniformly random permutation of $n$ items, let $X_i$ indicate that item $i$ stays put. Then $\Pr[X_i = 1] = 1/n$, and although the $X_i$ are dependent, the expected number of fixed points is exactly $1$ for every $n$.`,
        display: r`\mathbb{E}[X] = \sum_{i=1}^{n} \frac{1}{n} = 1`,
        visNote: 'Shuffle repeatedly; the empirical mean converges to 1.',
      },
      {
        label: 'Worked example: coupon collector',
        body: r`Let $T_i$ be the extra draws needed to go from $i-1$ to $i$ distinct coupons; $T_i$ is geometric with success probability $(n-i+1)/n$, so $\mathbb{E}[T_i] = n/(n-i+1)$. Summing gives the harmonic number.`,
        display: r`\mathbb{E}[T] = \sum_{i=1}^{n} \frac{n}{n-i+1} = n H_n \approx n \ln n`,
      },
    ],
    prerequisites: [],
    softLinks: [
      { to: 'quicksort-expected', why: 'Indicator-sum analysis of pairwise comparisons is the flagship use.' },
      { to: 'birthday-collision', why: 'Expected collision counts come straight from summing pair indicators.' },
      { to: 'amortized-array', why: 'Both trade per-step worst case for a global average.' },
      { to: 'handshake-lemma', why: 'Double counting and linearity are the same reordering trick.' },
    ],
    physical: {
      anchor: 'Weighing a shopping basket',
      description:
        'The basket’s weight is the sum of item weights no matter how the items lean on each other or how correlated your buying habits are. Expectation behaves like mass: it is additive even when the objects are tangled.',
    },
    applications: [
      'Analysis of randomized algorithms and hashing load',
      'Expected cost models for caching and load balancing',
      'Probabilistic method proofs of existence',
    ],
    visId: 'linearity',
  },
  {
    id: 'markov-inequality',
    title: 'Markov’s Inequality',
    category: 'probability',
    order: 2,
    tagline: 'A non-negative variable can rarely be far above its mean.',
    techniques: ['probabilistic', 'direct'],
    difficulty: 2,
    statement:
      r`Let $X \ge 0$ be a random variable with finite mean and let $t > 0$. Then $\Pr[X \ge t] \le \mathbb{E}[X]/t$.`,
    statementDisplay: r`\Pr[X \ge t] \;\le\; \frac{\mathbb{E}[X]}{t}`,
    intuition:
      r`Mass sitting at or above $t$ contributes at least $t$ each to the average. If too much probability sat up there, the mean would exceed $\mathbb{E}[X]$. Since $X$ cannot go negative, nothing can compensate — which is exactly why non-negativity is required.`,
    steps: [
      {
        label: 'Bound X below by a step',
        body: r`For every outcome, $X \ge t \cdot \mathbf{1}_{\{X \ge t\}}$: when the indicator is $1$ we have $X \ge t$, and when it is $0$ the right side is $0 \le X$ by non-negativity.`,
        display: r`X \;\ge\; t \cdot \mathbf{1}_{\{X \ge t\}}`,
        visNote: 'The dashed step function sits underneath the distribution everywhere.',
      },
      {
        label: 'Take expectations',
        body: r`Expectation is monotone, and $\mathbb{E}[\mathbf{1}_A] = \Pr[A]$, so applying $\mathbb{E}$ to both sides gives the result after dividing by $t > 0$.`,
        display: r`\mathbb{E}[X] \ge t\,\mathbb{E}[\mathbf{1}_{\{X\ge t\}}] = t \Pr[X \ge t]`,
      },
      {
        label: 'Conclude',
        body: r`Dividing by $t$ yields $\Pr[X \ge t] \le \mathbb{E}[X]/t$. $\blacksquare$`,
      },
      {
        label: 'Tightness',
        body: r`The bound is achieved: let $X = t$ with probability $p$ and $0$ otherwise. Then $\mathbb{E}[X] = pt$ and $\Pr[X \ge t] = p = \mathbb{E}[X]/t$. So Markov cannot be improved without extra assumptions.`,
        visNote: 'Switch to the two-point distribution to see the bound met exactly.',
      },
      {
        label: 'Bootstrapping to Chebyshev',
        body: r`Apply Markov to the non-negative variable $(X - \mu)^2$ with threshold $k^2\sigma^2$. Squaring converts a one-sided mean bound into a two-sided concentration bound.`,
        display: r`\Pr[|X - \mu| \ge k\sigma] = \Pr[(X-\mu)^2 \ge k^2\sigma^2] \le \frac{\sigma^2}{k^2\sigma^2} = \frac{1}{k^2}`,
      },
      {
        label: 'And to Chernoff',
        body: r`Apply Markov to $e^{\lambda X}$ instead, then optimize over $\lambda$. Because the exponential punishes large deviations so heavily, the resulting bound decays exponentially rather than polynomially — the entire theory of tail bounds is Markov composed with a clever non-negative transform.`,
        display: r`\Pr[X \ge t] \le \min_{\lambda > 0} e^{-\lambda t}\, \mathbb{E}[e^{\lambda X}]`,
      },
    ],
    prerequisites: ['linearity-expectation'],
    softLinks: [
      { to: 'amortized-array', why: 'Both bound rare expensive behaviour using an average.' },
      { to: 'quicksort-expected', why: 'Turns an expected-time bound into a high-probability guarantee.' },
      { to: 'cauchy-schwarz', why: 'Both are inequalities obtained from a pointwise non-negative comparison.' },
    ],
    physical: {
      anchor: 'A seesaw that cannot dip below the ground',
      description:
        'Pile weight far out on one arm and the fulcrum reading shoots up. If the average reading is small, only a little weight can be sitting far out. Non-negativity is the ground: nothing can hang below to cancel the far-out mass.',
    },
    applications: [
      'Converting expected running times into probabilistic guarantees',
      'Load-balancing and queueing tail estimates',
      'Base case for Chebyshev, Chernoff and Hoeffding bounds',
    ],
    visId: 'markov',
  },
  {
    id: 'birthday-collision',
    title: 'The Birthday Bound',
    category: 'probability',
    order: 3,
    tagline: 'Collisions arrive at √m, not m — hashing’s most consequential surprise.',
    techniques: ['counting', 'probabilistic'],
    difficulty: 3,
    statement:
      r`Throw $n$ items independently and uniformly into $m$ bins. Then the probability that all land in distinct bins satisfies $\Pr[\text{no collision}] \le e^{-n(n-1)/(2m)}$, so a collision is more likely than not once $n \gtrsim 1.18\sqrt{m}$.`,
    statementDisplay: r`\Pr[\text{no collision}] = \prod_{i=0}^{n-1}\left(1 - \frac{i}{m}\right) \le \exp\!\left(-\frac{n(n-1)}{2m}\right)`,
    intuition:
      r`There are $\binom{n}{2}$ pairs, each colliding with probability $1/m$, so the expected number of collisions is about $n^2/2m$ — which reaches $1$ when $n \approx \sqrt{m}$. Intuition fails because we instinctively count items rather than pairs, and pairs grow quadratically.`,
    steps: [
      {
        label: 'Exact product formula',
        body: r`Insert items one at a time. Given the first $i$ items occupy $i$ distinct bins, the next avoids them with probability $(m-i)/m$. Multiplying the conditional probabilities gives the exact answer.`,
        display: r`\Pr[\text{no collision}] = \prod_{i=0}^{n-1} \frac{m-i}{m} = \prod_{i=0}^{n-1}\left(1 - \frac{i}{m}\right)`,
        visNote: 'The blue curve is this exact product; drag n along it.',
      },
      {
        label: 'Bound each factor',
        body: r`Use $1 - x \le e^{-x}$, valid for all real $x$ (the exponential is convex and $e^{-x}$ has tangent $1-x$ at $x = 0$).`,
        display: r`\prod_{i=0}^{n-1}\left(1 - \frac{i}{m}\right) \le \prod_{i=0}^{n-1} e^{-i/m} = \exp\!\left(-\frac{1}{m}\sum_{i=0}^{n-1} i\right)`,
      },
      {
        label: 'Sum the exponents',
        body: r`The Gauss sum gives $\sum_{i=0}^{n-1} i = n(n-1)/2$, so the no-collision probability is at most $\exp(-n(n-1)/(2m))$.`,
        display: r`\Pr[\text{no collision}] \le \exp\!\left(-\frac{n(n-1)}{2m}\right)`,
      },
      {
        label: 'Solve for the threshold',
        body: r`Setting the bound to $1/2$ and solving $n(n-1)/(2m) = \ln 2$ gives $n \approx \sqrt{2 \ln 2}\,\sqrt{m} \approx 1.177\sqrt{m}$. For $m = 365$ this is $23$ people; for a 128-bit hash it is about $2^{64}$ inputs.`,
        display: r`n^\ast \approx 1.177\sqrt{m}`,
      },
      {
        label: 'The pair-counting view',
        body: r`Let $X$ count colliding pairs. By linearity, $\mathbb{E}[X] = \binom{n}{2}/m$, which crosses $1$ at $n \approx \sqrt{2m}$ — the same $\sqrt{m}$ scaling, obtained without any product. Markov then bounds the probability of *many* collisions.`,
        display: r`\mathbb{E}[X] = \binom{n}{2}\frac{1}{m} = \frac{n(n-1)}{2m}`,
      },
      {
        label: 'Consequences for hashing',
        body: r`A $b$-bit hash gives only $b/2$ bits of collision resistance, so 128-bit digests are borderline and 256-bit is the norm. Meanwhile pigeonhole guarantees collisions only at $n > m$ — the gap between $\sqrt m$ and $m$ is the entire content of the birthday phenomenon. $\blacksquare$`,
      },
    ],
    prerequisites: ['linearity-expectation', 'pigeonhole'],
    softLinks: [
      { to: 'pigeonhole', why: 'Certainty at n > m versus likelihood at n ≈ √m.' },
      { to: 'induction-sum', why: 'The Gauss sum appears verbatim in the exponent.' },
      { to: 'rsa-correctness', why: 'Birthday attacks set the required digest and key sizes in practice.' },
    ],
    physical: {
      anchor: 'A party of 23 people',
      description:
        'Nobody expects a shared birthday in a small room, because we imagine comparing ourselves to everyone else rather than counting all 253 pairs. The same misjudgement makes people underestimate how quickly random IDs, session tokens and short hashes start repeating.',
    },
    applications: [
      'Hash collision resistance and digest sizing',
      'UUID and session-token collision risk',
      'Meet-in-the-middle and birthday attacks on ciphers',
    ],
    visId: 'birthday',
  },
];
