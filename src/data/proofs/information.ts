import type { Proof } from '../../types';
import { r } from '../raw';

export const information: Proof[] = [
  {
    id: 'kraft-inequality',
    title: 'Kraft’s Inequality: the Budget of a Prefix Code',
    category: 'information',
    order: 1,
    tagline: 'Short codewords are expensive because they swallow whole subtrees.',
    techniques: ['counting', 'construction'],
    difficulty: 3,
    statement:
      r`Lengths $\ell_1, \dots, \ell_n$ are realizable by a binary prefix-free code if and only if $\sum_{i=1}^n 2^{-\ell_i} \le 1$.`,
    statementDisplay: r`\sum_{i=1}^{n} 2^{-\ell_i} \;\le\; 1`,
    intuition:
      r`Think of codewords as nodes in an infinite binary tree. Choosing a codeword of length $\ell$ forbids every descendant of that node — a fraction $2^{-\ell}$ of all infinite paths. Prefix-freeness means the forbidden regions are disjoint, and disjoint pieces of a whole cannot exceed the whole.`,
    steps: [
      {
        label: 'Codewords as intervals',
        body: r`Map a codeword $c$ of length $\ell$ to the set of infinite binary strings starting with $c$ — equivalently, the dyadic interval $[0.c,\, 0.c + 2^{-\ell})$ inside $[0,1)$. Its length is exactly $2^{-\ell}$.`,
        visNote: 'The unit bar shows each codeword claiming its dyadic interval.',
      },
      {
        label: 'Prefix-free means disjoint',
        body: r`Two intervals overlap iff one codeword is a prefix of the other. So a prefix-free code corresponds to pairwise disjoint intervals inside $[0,1)$.`,
      },
      {
        label: 'Necessity',
        body: r`Disjoint subintervals of $[0,1)$ have total length at most $1$, giving the inequality.`,
        display: r`\sum_{i=1}^{n} 2^{-\ell_i} = \sum_i |I_i| \le \left|[0,1)\right| = 1`,
      },
      {
        label: 'Sufficiency: greedy packing',
        body: r`Conversely, given lengths with $\sum_i 2^{-\ell_i} \le 1$, sort them increasingly and assign each codeword the interval starting at the cumulative sum of previous widths. Since every partial sum stays below $1$ and each start point is a multiple of $2^{-\ell_i}$ (as earlier widths are coarser multiples), each interval is a legal dyadic block and they are disjoint by construction.`,
        display: r`c_i \text{ starts at } \sum_{j<i} 2^{-\ell_j}`,
        visNote: 'Watch the greedy packer fill the bar left to right without overlap.',
      },
      {
        label: 'Conclude',
        body: r`Both directions hold, so Kraft’s inequality exactly characterizes prefix-code lengths. $\blacksquare$`,
      },
      {
        label: 'The entropy bound in one line',
        body: r`Kraft plus Gibbs’ inequality gives $\mathbb{E}[\ell] \ge H(p)$ for any prefix code on a source with distribution $p$, and choosing $\ell_i = \lceil \log_2 (1/p_i) \rceil$ (legal by Kraft) achieves $\mathbb{E}[\ell] < H(p) + 1$. Compression is thus pinned between $H$ and $H+1$ bits per symbol.`,
        display: r`H(p) \;\le\; \mathbb{E}[\ell] \;<\; H(p) + 1`,
      },
    ],
    prerequisites: ['pigeonhole', 'sorting-lower-bound'],
    softLinks: [
      { to: 'huffman-optimality', why: 'Kraft supplies the feasible set that Huffman optimizes over.' },
      { to: 'sorting-lower-bound', why: 'Both are leaf-counting arguments on binary trees.' },
      { to: 'pigeonhole', why: 'A finite budget shared among too many claimants.' },
    ],
    physical: {
      anchor: 'Reserving airtime on a shared frequency',
      description:
        'A short, easily-recognized call sign occupies a big slice of the shared spectrum of possible transmissions; hand out too many short ones and messages become ambiguous. Morse code makes E a single dot precisely because that expensive slice buys the most savings.',
    },
    applications: [
      'Designing prefix codes (Huffman, Shannon–Fano, UTF-8)',
      'Proving compression lower bounds',
      'Kolmogorov complexity and universal coding',
    ],
    visId: 'kraft',
  },
  {
    id: 'huffman-optimality',
    title: 'Huffman Coding Is Optimal',
    category: 'information',
    order: 2,
    tagline: 'The two rarest symbols can always be siblings at the bottom.',
    techniques: ['exchange', 'induction', 'construction'],
    difficulty: 4,
    statement:
      r`For any symbol distribution $p_1, \dots, p_n$, the Huffman tree — built by repeatedly merging the two least likely symbols — minimizes the expected codeword length $\sum_i p_i \ell_i$ among all prefix codes.`,
    intuition:
      r`Two structural facts do all the work. In any optimal tree, rarer symbols are never shallower than commoner ones (otherwise swap them and the cost drops). And an optimal tree has no half-empty internal node, so the deepest level contains a sibling pair — which we may as well take to be the two rarest symbols. Merging them reduces the problem by one symbol, and induction finishes.`,
    steps: [
      {
        label: 'Cost of a tree',
        body: r`A prefix code is a binary tree with symbols at leaves; $\ell_i$ is the depth of symbol $i$. The objective is the expected code length.`,
        display: r`C(T) = \sum_{i=1}^{n} p_i \ell_i`,
      },
      {
        label: 'Lemma 1: exchange argument',
        body: r`Let $T$ be optimal and suppose $p_i < p_j$ while $\ell_i < \ell_j$. Swapping the two leaves changes the cost by $(p_i - p_j)(\ell_j - \ell_i) < 0$, contradicting optimality. Hence higher probability never sits deeper.`,
        display: r`\Delta C = (p_i - p_j)(\ell_j - \ell_i) < 0`,
        visNote: 'Swap two leaves manually and watch the cost readout change.',
      },
      {
        label: 'Lemma 2: the deepest leaves are siblings',
        body: r`In an optimal tree every internal node has two children (a node with one child could be contracted, lowering cost). So a deepest leaf has a sibling, which is also a deepest leaf. Combined with Lemma 1, the two smallest probabilities may be assumed to be that sibling pair.`,
      },
      {
        label: 'Merging step',
        body: r`Let $x, y$ be the two rarest symbols and let $T'$ be a tree over the alphabet where $x, y$ are replaced by a single symbol $z$ with $p_z = p_x + p_y$. Splitting $z$ into two children in $T'$ yields a tree $T$ over the original alphabet, and the costs differ by a constant independent of the tree shape.`,
        display: r`C(T) = C(T') + p_x + p_y`,
        visNote: 'The merge animation replaces two nodes by their sum.',
      },
      {
        label: 'Induction',
        body: r`Suppose Huffman is optimal for $n-1$ symbols. If $T$ (with $x,y$ siblings at maximum depth) were beaten by some $T^*$, then by Lemmas 1–2 we may assume $T^*$ also has $x, y$ as deepest siblings; contracting them gives a tree over $n-1$ symbols with cost $C(T^*) - p_x - p_y < C(T) - p_x - p_y = C(T')$, contradicting optimality of $T'$ from the inductive hypothesis.`,
      },
      {
        label: 'Base case and conclusion',
        body: r`For $n = 2$ any code assigning the two symbols distinct single bits is optimal, which is exactly what Huffman produces. By induction Huffman is optimal for all $n$. $\blacksquare$`,
      },
      {
        label: 'How close to entropy?',
        body: r`Optimality is among *symbol-by-symbol* prefix codes, where $H(p) \le C \le H(p) + 1$. The overhead comes from rounding lengths to integers; coding blocks of symbols, or using arithmetic coding, drives the rate to $H(p)$.`,
      },
    ],
    prerequisites: ['kraft-inequality'],
    softLinks: [
      { to: 'mst-cut-property', why: 'Both greedies are proved by exchanging elements inside a hypothetical optimum.' },
      { to: 'kraft-inequality', why: 'Defines the space of admissible length vectors.' },
      { to: 'sorting-lower-bound', why: 'Expected depth in a binary tree is the shared cost model.' },
    ],
    physical: {
      anchor: 'A well-worn keyboard, or shelving a kitchen',
      description:
        'Things you reach for constantly go at eye level; the fondue set goes on the top shelf. Huffman is the provably optimal shelving policy when the only cost is how far you reach and how often you reach there.',
    },
    applications: [
      'DEFLATE/gzip, JPEG and MP3 entropy coding stages',
      'Optimal decision trees for weighted queries',
      'Building bandwidth-efficient message encodings',
    ],
    visId: 'huffman',
  },
];
