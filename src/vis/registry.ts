import type { ComponentType } from 'react';
import { Descent, Diagonal, Pigeonhole, Staircase } from './foundations';
import { Halting, Pumping, Reduction } from './computability';
import { Amortized, Clique, DecisionTree, RecursionTree } from './complexity';
import { BinarySearch, Dijkstra, MaxFlow, MstCut, Quicksort } from './algorithms';
import { Bipartite, Euler, Handshake } from './graphs';
import { Fermat, Gcd, Primes, Rsa } from './numbers';
import { Birthday, Linearity, Markov } from './probability';
import { Huffman, Kraft } from './information';
import { CauchySchwarz, PageRank, Pythagoras } from './geometry';

export const visualizations: Record<string, ComponentType> = {
  staircase: Staircase,
  descent: Descent,
  pigeonhole: Pigeonhole,
  diagonal: Diagonal,
  pumping: Pumping,
  halting: Halting,
  reduction: Reduction,
  decisionTree: DecisionTree,
  recursionTree: RecursionTree,
  amortized: Amortized,
  clique: Clique,
  binarySearch: BinarySearch,
  quicksort: Quicksort,
  dijkstra: Dijkstra,
  mstCut: MstCut,
  maxflow: MaxFlow,
  handshake: Handshake,
  euler: Euler,
  bipartite: Bipartite,
  primes: Primes,
  gcd: Gcd,
  fermat: Fermat,
  rsa: Rsa,
  linearity: Linearity,
  markov: Markov,
  birthday: Birthday,
  kraft: Kraft,
  huffman: Huffman,
  pythagoras: Pythagoras,
  cauchySchwarz: CauchySchwarz,
  pagerank: PageRank,
};
