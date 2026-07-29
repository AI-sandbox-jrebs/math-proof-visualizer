import type { Proof } from '../../types';
import { r } from '../raw';

export const foundations: Proof[] = [
  {
    id: 'induction-sum',
    title: 'Induction and the Gauss Sum',
    category: 'foundations',
    order: 1,
    tagline: 'One domino knocks over infinitely many.',
    techniques: ['induction'],
    difficulty: 1,
    statement:
      r`For every integer $n \ge 1$, the sum of the first $n$ positive integers equals $n(n+1)/2$.`,
    statementDisplay: r`\sum_{k=1}^{n} k \;=\; \frac{n(n+1)}{2}`,
    intuition:
      r`Two copies of the staircase $1,2,\dots,n$ interlock into an $n \times (n+1)$ rectangle. The staircase is therefore exactly half a rectangle. Induction is the machinery that turns "look at the picture" into a claim about *every* $n$ at once: verify the smallest case, then show each case manufactures the next.`,
    steps: [
      {
        label: 'Set up the predicate',
        body: r`Let $P(n)$ be the statement $\sum_{k=1}^{n} k = n(n+1)/2$. We prove $P(n)$ holds for all $n \ge 1$ by induction on $n$.`,
      },
      {
        label: 'Base case',
        body: r`For $n = 1$ the left side is $1$ and the right side is $1 \cdot 2 / 2 = 1$, so $P(1)$ holds.`,
        visNote: 'The single block: one row, area 1, half of a 1×2 rectangle.',
      },
      {
        label: 'Inductive hypothesis',
        body: r`Fix an arbitrary $n \ge 1$ and assume $P(n)$: that is, assume $\sum_{k=1}^{n} k = n(n+1)/2$. Nothing about this $n$ is special, which is what lets the conclusion be universal.`,
      },
      {
        label: 'Inductive step',
        body: r`Add the next term $n+1$ to both sides and simplify. The algebra is the whole content of the step: the hypothesis is used exactly once, to replace the sum up to $n$.`,
        display: r`\sum_{k=1}^{n+1} k = \left(\sum_{k=1}^{n} k\right) + (n+1) \overset{P(n)}{=} \frac{n(n+1)}{2} + (n+1) = \frac{n(n+1) + 2(n+1)}{2} = \frac{(n+1)(n+2)}{2}`,
        visNote: 'Adding a new bottom row extends the rectangle from n×(n+1) to (n+1)×(n+2).',
      },
      {
        label: 'Conclude',
        body: r`The final expression is exactly $P(n+1)$. Since $P(1)$ holds and $P(n) \Rightarrow P(n+1)$ for every $n$, the induction principle gives $P(n)$ for all $n \ge 1$. $\blacksquare$`,
      },
    ],
    prerequisites: [],
    softLinks: [
      { to: 'master-theorem', why: 'Recursion trees are induction on the depth of a recursive call.' },
      { to: 'binary-search-invariant', why: 'A loop invariant is induction where the index is the iteration counter.' },
      { to: 'handshake-lemma', why: 'The same "count one object two ways" move appears in the degree sum.' },
    ],
    physical: {
      anchor: 'A line of dominoes',
      description:
        'The base case is the finger that tips the first tile; the inductive step is the guarantee that every tile is close enough to reach the next. Neither alone knocks down the line — you need both, and then the line can be infinitely long.',
    },
    applications: [
      'Proving loop and recursion correctness',
      'Closed forms for running-time recurrences',
      'Structural induction over trees, lists and grammars',
    ],
    visId: 'staircase',
  },
  {
    id: 'sqrt2-irrational',
    title: 'The Square Root of Two Is Irrational',
    category: 'foundations',
    order: 2,
    tagline: 'No fraction squares to two, and the reason is parity.',
    techniques: ['contradiction'],
    difficulty: 2,
    statement: r`There is no rational number $q$ with $q^2 = 2$. Equivalently, $\sqrt{2} \notin \mathbb{Q}$.`,
    intuition:
      r`Suppose $\sqrt{2}$ were a fraction. Then it has a *smallest* denominator. But squaring forces both numerator and denominator to be even, so we can halve both and get a smaller one. An infinite descent inside the positive integers is impossible, and that impossibility is the proof.`,
    steps: [
      {
        label: 'Assume the negation',
        body: r`Suppose for contradiction that $\sqrt{2} = p/q$ with $p, q \in \mathbb{Z}$, $q \neq 0$, and the fraction in lowest terms, i.e. $\gcd(p,q) = 1$.`,
      },
      {
        label: 'Clear the denominator',
        body: r`Squaring and multiplying by $q^2$ gives an equation entirely in integers.`,
        display: r`p^2 = 2q^2`,
      },
      {
        label: 'The numerator is even',
        body: r`$p^2$ is twice an integer, so $p^2$ is even. If $p$ were odd, $p = 2m+1$ would give $p^2 = 4m^2 + 4m + 1$, which is odd. Hence $p$ is even: write $p = 2a$.`,
        visNote: 'Watch the parity badge on p flip to "even".',
      },
      {
        label: 'So is the denominator',
        body: r`Substituting $p = 2a$ gives $4a^2 = 2q^2$, hence $q^2 = 2a^2$. By the identical parity argument, $q$ is even too.`,
        display: r`4a^2 = 2q^2 \;\Longrightarrow\; q^2 = 2a^2 \;\Longrightarrow\; 2 \mid q`,
      },
      {
        label: 'Contradiction',
        body: r`Both $p$ and $q$ are even, so $2 \mid \gcd(p,q)$, contradicting $\gcd(p,q) = 1$. The assumption is untenable, so no such rational exists. $\blacksquare$`,
      },
      {
        label: 'The descent view',
        body: r`Without assuming lowest terms, the same two divisions produce a strictly smaller pair $(p/2, q/2)$ with the same ratio. Repeating forever contradicts the well-ordering of $\mathbb{N}$ — the same engine as induction, run downward.`,
        visNote: 'Each click of "reduce" halves both integers; the descent never terminates.',
      },
    ],
    prerequisites: ['induction-sum'],
    softLinks: [
      { to: 'euclid-infinite-primes', why: 'Also a contradiction that ends by manufacturing an impossible divisor.' },
      { to: 'cantor-diagonal', why: 'Both show a set we can name is strictly poorer than the set we want to measure.' },
      { to: 'euclid-gcd', why: 'Lowest terms is exactly what Euclid’s algorithm computes.' },
    ],
    physical: {
      anchor: 'A square floor tile and its diagonal',
      description:
        'Tile a floor with unit squares and stretch a string across one tile’s diagonal. No matter how finely you subdivide the tiles, no whole number of subdivisions ever measures both the side and the diagonal. Incommensurability is a physical statement about rulers, not just about numbers.',
    },
    applications: [
      'Floating point can never represent √2 exactly',
      'Exact arithmetic libraries must keep radicals symbolic',
      'Motivates algebraic vs. transcendental number representations',
    ],
    visId: 'descent',
  },
  {
    id: 'pigeonhole',
    title: 'The Pigeonhole Principle',
    category: 'foundations',
    order: 3,
    tagline: 'More items than boxes forces a shared box.',
    techniques: ['counting', 'contradiction'],
    difficulty: 1,
    statement:
      r`If $f : A \to B$ is a function between finite sets with $|A| > |B|$, then $f$ is not injective: there exist distinct $x, y \in A$ with $f(x) = f(y)$.`,
    statementDisplay: r`|A| > |B| \;\Longrightarrow\; \exists\, x \neq y \in A : f(x) = f(y)`,
    intuition:
      r`If every box held at most one item, the items could be counted by the boxes, so there could be at most $|B|$ of them. There are more, so some box holds at least two. The principle is trivial and yet it is the only tool that proves many otherwise hard statements.`,
    steps: [
      {
        label: 'Assume injectivity',
        body: r`Suppose for contradiction that $f$ is injective, so distinct elements of $A$ have distinct images.`,
      },
      {
        label: 'Count the images',
        body: r`Injectivity means $|f(A)| = |A|$. But $f(A) \subseteq B$, and a subset of a finite set is no larger than the set, so $|f(A)| \le |B|$.`,
        display: r`|A| = |f(A)| \le |B|`,
      },
      {
        label: 'Contradiction',
        body: r`This contradicts $|A| > |B|$. Hence $f$ is not injective. $\blacksquare$`,
      },
      {
        label: 'Generalized form',
        body: r`The same counting gives the stronger statement: some box receives at least $\lceil |A|/|B| \rceil$ items. If every box had fewer, the total would be at most $|B|(\lceil |A|/|B| \rceil - 1) < |A|$.`,
        display: r`\max_{b \in B} |f^{-1}(b)| \;\ge\; \left\lceil \frac{|A|}{|B|} \right\rceil`,
        visNote: 'Raise the item count and watch the guaranteed maximum load rise in steps.',
      },
    ],
    prerequisites: [],
    softLinks: [
      { to: 'birthday-collision', why: 'Pigeonhole gives certainty at n > m; the birthday bound gives likelihood far earlier.' },
      { to: 'pumping-lemma', why: 'A finite automaton has finitely many states, so a long run must revisit one.' },
      { to: 'sorting-lower-bound', why: 'Both are counting arguments: too many outcomes for too few slots.' },
      { to: 'kraft-inequality', why: 'A prefix code is a pigeonhole budget on the leaves of a binary tree.' },
    ],
    physical: {
      anchor: 'Hanging coats on too few hooks',
      description:
        'Twenty coats, nineteen hooks: someone’s coat is doubled up, and you know it before entering the room. Compression, hashing and lossless storage all bump into this same coat-rack.',
    },
    applications: [
      'Hash collisions are unavoidable',
      'No lossless compressor shrinks every input',
      'Cycle detection in finite state spaces',
    ],
    visId: 'pigeonhole',
  },
  {
    id: 'cantor-diagonal',
    title: 'Cantor’s Diagonal Argument',
    category: 'foundations',
    order: 4,
    tagline: 'Any list of infinite sequences misses one you can build from its own diagonal.',
    techniques: ['diagonalization', 'contradiction', 'construction'],
    difficulty: 3,
    statement:
      r`The set $\{0,1\}^{\mathbb{N}}$ of infinite binary sequences is uncountable: for every function $F : \mathbb{N} \to \{0,1\}^{\mathbb{N}}$ there exists a sequence $d$ not in the image of $F$.`,
    intuition:
      r`Imagine the list of sequences as an infinite table, one row per index. Read down the diagonal and flip every bit. The result differs from row $n$ in position $n$, for every $n$ — so it cannot be any row. The table was assumed to contain everything, and it does not.`,
    steps: [
      {
        label: 'Assume an enumeration',
        body: r`Let $F : \mathbb{N} \to \{0,1\}^{\mathbb{N}}$ be arbitrary. Write $s_n = F(n)$ and let $s_n(k)$ denote the $k$-th bit of the $n$-th sequence. Arrange these as an infinite table with rows $s_0, s_1, s_2, \dots$`,
      },
      {
        label: 'Build the diagonal',
        body: r`Define a new sequence $d$ by flipping the diagonal entries.`,
        display: r`d(n) \;=\; 1 - s_n(n) \qquad \text{for every } n \in \mathbb{N}`,
        visNote: 'The highlighted cells are the diagonal; the strip below is d.',
      },
      {
        label: 'It differs from every row',
        body: r`Fix any $n$. By construction $d(n) \neq s_n(n)$, so $d \neq s_n$ — the two sequences disagree in position $n$. This holds for every $n$ simultaneously.`,
      },
      {
        label: 'Conclude',
        body: r`Therefore $d$ is not in the image of $F$, so no $F$ is surjective and $\{0,1\}^{\mathbb{N}}$ is not countable. The same argument, applied to binary expansions, shows $\mathbb{R}$ is uncountable. $\blacksquare$`,
      },
      {
        label: 'Why it generalizes',
        body: r`Nothing used the structure of bits, only that each row can be *disagreed with* at a chosen position. Replace "row $n$" by "program $n$" and "flip" by "do the opposite" and the same paragraph proves the halting problem undecidable.`,
      },
    ],
    prerequisites: ['pigeonhole', 'sqrt2-irrational'],
    softLinks: [
      { to: 'halting-problem', why: 'Literally the same argument with programs as rows.' },
      { to: 'sorting-lower-bound', why: 'Both compare the size of a set of outcomes against a set of descriptions.' },
    ],
    physical: {
      anchor: 'A hotel with a guest list you can always outgrow',
      description:
        'Every room is numbered, every guest is listed, and yet you can always describe a guest who differs from the occupant of room 1 in their first initial, from room 2 in their second, and so on. Some collections are too big to be catalogued, no matter how long the catalogue is.',
    },
    applications: [
      'Existence of uncomputable functions',
      'Undecidability of halting, equivalence and type checking limits',
      'Separation results in complexity theory',
    ],
    visId: 'diagonal',
  },
];
