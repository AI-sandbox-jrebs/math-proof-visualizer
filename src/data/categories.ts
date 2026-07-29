import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'foundations',
    title: 'Foundations & Proof Craft',
    kicker: 'how arguments work',
    blurb:
      'The five moves every later proof reuses: induction, contradiction, counting, the pigeonhole squeeze, and self-reference by diagonal.',
    color: '#7c9cff',
    order: 1,
  },
  {
    id: 'computability',
    title: 'Computability',
    kicker: 'limits of machines',
    blurb:
      'Diagonalization escapes the page and becomes a statement about programs: some questions no machine can answer, and some languages no finite memory can recognize.',
    color: '#ff8fa3',
    order: 2,
  },
  {
    id: 'complexity',
    title: 'Complexity & Cost',
    kicker: 'counting the work',
    blurb:
      'Lower bounds from information, upper bounds from recursion trees, and the accounting trick that makes an expensive step look cheap.',
    color: '#ffc46b',
    order: 3,
  },
  {
    id: 'algorithms',
    title: 'Algorithm Correctness',
    kicker: 'why the loop is right',
    blurb:
      'Invariants, greedy exchange arguments and duality: the three ways we convince ourselves a program computes what it claims.',
    color: '#6fe3c4',
    order: 4,
  },
  {
    id: 'graphs',
    title: 'Graphs',
    kicker: 'structure of connection',
    blurb:
      'Degree parity, traversability, and colourability — local counting facts that force global structure on any network.',
    color: '#9be36f',
    order: 5,
  },
  {
    id: 'numbers',
    title: 'Numbers & Cryptography',
    kicker: 'arithmetic with secrets',
    blurb:
      'From the infinitude of primes to Euclid’s algorithm, Fermat’s little theorem and the identity that makes RSA decrypt.',
    color: '#c79bff',
    order: 6,
  },
  {
    id: 'probability',
    title: 'Probability & Randomness',
    kicker: 'taming the average',
    blurb:
      'Linearity, tail bounds and collision counting: the tools behind hash tables, load balancing and randomized algorithms.',
    color: '#8fd8ff',
    order: 7,
  },
  {
    id: 'information',
    title: 'Information & Coding',
    kicker: 'the price of a symbol',
    blurb:
      'Prefix codes live in a budget, and greedy merging spends that budget optimally. Compression as geometry on a binary tree.',
    color: '#ffa86b',
    order: 8,
  },
  {
    id: 'geometry',
    title: 'Geometry & Linear Algebra',
    kicker: 'shape of computation',
    blurb:
      'Rearrangement proofs, the inequality behind every notion of angle, and the eigenvector that ranks the web.',
    color: '#ff9bd0',
    order: 9,
  },
];

export const categoryById = new Map(categories.map((c) => [c.id, c]));
