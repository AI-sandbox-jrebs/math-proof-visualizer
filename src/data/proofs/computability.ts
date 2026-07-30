import type { Proof } from '../../types';
import { r } from '../raw';

export const computability: Proof[] = [
  {
    id: 'pumping-lemma',
    title: 'No Finite Automaton Counts: the Pumping Lemma',
    category: 'computability',
    order: 1,
    tagline: 'Finite memory must repeat itself, and repetition can be exploited.',
    techniques: ['counting', 'contradiction'],
    difficulty: 3,
    statement:
      r`Let $L$ be recognized by a DFA with $p$ states. Then every $w \in L$ with $|w| \ge p$ factors as $w = xyz$ with $|xy| \le p$, $|y| \ge 1$, and $xy^i z \in L$ for all $i \ge 0$. Consequently $L = \{a^n b^n : n \ge 0\}$ is not regular.`,
    intuition:
      r`A DFA reading $p$ symbols visits $p+1$ states, so by pigeonhole it stands in the same state twice. The stretch of input between those two visits is a loop: the machine cannot tell how many times you ran around it. Any language that *needs* to know the count therefore cannot be recognized.`,
    steps: [
      {
        label: 'Trace the run',
        body: r`Let $M$ be a DFA with state set $Q$, $|Q| = p$, recognizing $L$, and let $w = w_1 w_2 \cdots w_n \in L$ with $n \ge p$. Let $q_0, q_1, \dots, q_n$ be the states visited, where $q_i$ is the state after reading $w_1 \cdots w_i$.`,
      },
      {
        label: 'Pigeonhole on states',
        body: r`The prefix $q_0, \dots, q_p$ lists $p+1$ states drawn from a set of size $p$. By the pigeonhole principle two of them coincide: there are $0 \le j < k \le p$ with $q_j = q_k$.`,
        visNote: 'The repeated state is highlighted; the loop between the two visits is the pumpable block.',
      },
      {
        label: 'Factor the string',
        body: r`Set $x = w_1 \cdots w_j$, $y = w_{j+1} \cdots w_k$, $z = w_{k+1} \cdots w_n$. Then $|y| = k - j \ge 1$ and $|xy| = k \le p$.`,
        display: r`\delta^*(q_0, x) = q_j = q_k = \delta^*(q_j, y)`,
      },
      {
        label: 'Pump it',
        body: r`Because reading $y$ from $q_j$ returns to $q_j$, reading $y$ any number of times also returns to $q_j$. Hence $\delta^*(q_0, x y^i) = q_j$ for all $i \ge 0$, and appending $z$ lands in the same final state as $w$ did — an accepting one. So $x y^i z \in L$ for every $i \ge 0$.`,
      },
      {
        label: 'Apply to a^n b^n',
        body: r`Suppose $L = \{a^n b^n\}$ were regular with pumping length $p$. Take $w = a^p b^p \in L$. Since $|xy| \le p$, the block $y$ consists only of $a$’s, and $|y| \ge 1$. Then $x y^2 z$ has more $a$’s than $b$’s, so $x y^2 z \notin L$ — contradicting the lemma. Hence $L$ is not regular. $\blacksquare$`,
        visNote: 'Pump the loop and watch the a/b counts fall out of balance.',
      },
    ],
    prerequisites: ['pigeonhole'],
    softLinks: [
      { to: 'pigeonhole', why: 'The lemma is pigeonhole applied to the states of a run.' },
      { to: 'halting-problem', why: 'Both bound what a machine can know, one by memory, one by principle.' },
      { to: 'euler-circuit', why: 'Also an argument about revisiting nodes in a walk.' },
    ],
    physical: {
      anchor: 'A model train on a closed loop of track',
      description:
        'Watch the train pass a station and you cannot tell whether it is on lap three or lap thirty — the track has no memory of laps. Balanced parentheses, matched HTML tags and nested brackets all need a counter, which is why regular expressions genuinely cannot parse them.',
    },
    applications: [
      'Why regex cannot match balanced parentheses',
      'Choosing between lexer (regular) and parser (context-free) layers',
      'Proving lower bounds on streaming memory',
    ],
    visId: 'pumping',
  },
  {
    id: 'halting-problem',
    title: 'The Halting Problem Is Undecidable',
    category: 'computability',
    order: 2,
    tagline: 'A program that predicts halting can be turned against itself.',
    techniques: ['diagonalization', 'contradiction'],
    difficulty: 4,
    statement:
      r`There is no total computable function $H$ such that for all programs $M$ and inputs $w$, $H(M, w) = 1$ if $M$ halts on $w$ and $H(M, w) = 0$ otherwise.`,
    intuition:
      r`Programs are just strings, so a halting oracle could be used *inside* another program. Build one that asks the oracle what it will do and then does the opposite. It is Cantor’s diagonal with programs as rows: the contrarian program disagrees with the prediction about itself, so the prediction cannot have been correct.`,
    steps: [
      {
        label: 'Assume a decider exists',
        body: r`Suppose $H$ is a program that, given the source code of a program $M$ and an input $w$, always terminates and correctly reports whether $M$ halts on $w$. Note that source code is data, so $H$ can be called by other programs.`,
      },
      {
        label: 'Build the contrarian',
        body: r`Define a program $D$ that takes one input: the source code of a program $M$. It queries the oracle on $M$ applied to itself, then does the opposite.`,
        display: r`D(M) = \begin{cases} \text{loop forever} & \text{if } H(M, M) = 1 \\ \text{halt} & \text{if } H(M, M) = 0 \end{cases}`,
        visNote: 'The wiring diagram: D feeds M into H and inverts the answer.',
      },
      {
        label: 'Feed D its own code',
        body: r`$D$ is a legitimate program (it is $H$ plus an if-statement and a loop), so it is a legal input to itself. Consider running $D(D)$ and split on what the oracle says.`,
      },
      {
        label: 'Both branches contradict',
        body: r`If $H(D, D) = 1$ then $D$ halts on $D$; but by construction $D(D)$ loops forever. If $H(D, D) = 0$ then $D$ does not halt on $D$; but by construction $D(D)$ halts immediately. Either way $H$ is wrong about the single input $(D, D)$.`,
        display: r`H(D,D) = 1 \Rightarrow D(D) \uparrow \qquad H(D,D) = 0 \Rightarrow D(D) \downarrow`,
        visNote: 'Toggle the oracle’s answer; the trace always ends in a red contradiction.',
      },
      {
        label: 'Conclude',
        body: r`$H$ was assumed correct on all inputs, so no such $H$ exists. Halting is undecidable. $\blacksquare$`,
      },
      {
        label: 'Why it is a diagonal',
        body: r`Tabulate programs against inputs, with the cell $(i,j)$ recording whether program $i$ halts on input $j$. $D$ is built from the diagonal cells $(i,i)$ by flipping each one, so $D$’s row differs from every row — exactly Cantor’s construction.`,
      },
    ],
    prerequisites: ['cantor-diagonal', 'pumping-lemma'],
    softLinks: [
      { to: 'cantor-diagonal', why: 'Identical argument shape: flip the diagonal of a table you assumed was complete.' },
      { to: 'rice-theorem', why: 'Halting is the seed from which every other semantic undecidability grows.' },
      { to: 'sqrt2-irrational', why: 'Both are proofs by contradiction where the assumption manufactures its own refutation.' },
    ],
    physical: {
      anchor: 'A liar’s sentence on a sealed envelope',
      description:
        'Write "the instruction inside this envelope will not be followed" and then hand it to a perfectly obedient machine. Self-reference plus negation breaks the machine, not the language. The same loop appears in a barber who shaves exactly those who do not shave themselves.',
    },
    applications: [
      'No perfect infinite-loop detector in a compiler',
      'Static analyzers must be conservative or unsound',
      'Undecidability of program equivalence and full verification',
    ],
    visId: 'halting',
  },
  {
    id: 'rice-theorem',
    title: 'Rice’s Theorem: Every Interesting Property Is Undecidable',
    category: 'computability',
    order: 3,
    tagline: 'Ask anything nontrivial about what a program does and you inherit halting.',
    techniques: ['contradiction', 'construction'],
    difficulty: 5,
    statement:
      r`Let $P$ be a set of partial computable functions that is nontrivial (some computable function is in $P$ and some is not). Then the language $L_P = \{\langle M \rangle : \varphi_M \in P\}$ is undecidable, where $\varphi_M$ is the function computed by $M$.`,
    intuition:
      r`Any decider for a behavioural property can be tricked. Wrap the question "does $M$ halt on $w$?" inside a program whose *behaviour* switches between an in-$P$ function and an out-of-$P$ function depending on whether $M$ halts. Deciding the property would then decide halting.`,
    steps: [
      {
        label: 'Normalize the property',
        body: r`Assume without loss of generality that the everywhere-undefined function $\bot$ is not in $P$ (otherwise run the whole argument on the complement, which is also nontrivial and equally undecidable). By nontriviality pick a computable $g \in P$, computed by some machine $G$.`,
      },
      {
        label: 'Build the reduction',
        body: r`Given a machine $M$ and input $w$, construct the machine $N_{M,w}$ that on input $x$ first simulates $M$ on $w$, and only if that simulation halts goes on to run $G$ on $x$ and return its answer.`,
        display: r`N_{M,w}(x) : \; \text{simulate } M(w); \; \text{then output } G(x)`,
        visNote: 'The gate in the middle only opens if M(w) halts.',
      },
      {
        label: 'Behaviour splits cleanly',
        body: r`If $M$ halts on $w$, the first phase always finishes, so $\varphi_{N_{M,w}} = g \in P$. If $M$ does not halt on $w$, the first phase never finishes for any $x$, so $\varphi_{N_{M,w}} = \bot \notin P$.`,
        display: r`M \text{ halts on } w \iff \varphi_{N_{M,w}} \in P \iff \langle N_{M,w} \rangle \in L_P`,
      },
      {
        label: 'Transfer undecidability',
        body: r`The map $(M, w) \mapsto \langle N_{M,w} \rangle$ is computable — it is source-code surgery, no simulation required. So a decider for $L_P$ would yield a decider for halting by composing the two.`,
      },
      {
        label: 'Conclude',
        body: r`Halting is undecidable, so no decider for $L_P$ exists. Every nontrivial property of program *behaviour* is undecidable. $\blacksquare$`,
      },
      {
        label: 'What escapes the theorem',
        body: r`Rice constrains properties of the *function computed*, not of the *text*. "Contains a while loop", "is under 100 lines", "type-checks" are syntactic and perfectly decidable — which is precisely why real tooling analyses syntax and approximates semantics.`,
      },
    ],
    prerequisites: ['halting-problem'],
    softLinks: [
      { to: 'clique-reduction', why: 'Same technique at a different scale: transform instances, preserve answers.' },
      { to: 'halting-problem', why: 'Every reduction here bottoms out in the halting contradiction.' },
    ],
    physical: {
      anchor: 'A sealed appliance you may not open',
      description:
        'You are allowed to read the wiring diagram but never to plug the device in and wait forever. Questions about what it *does* — will it ever overheat, will it ever output zero — cannot be settled from the diagram alone, which is why safety engineering relies on restricted designs rather than universal inspection.',
    },
    applications: [
      'Why sound static analysis must over-approximate',
      'Dead code elimination and constant folding are necessarily incomplete',
      'Motivates type systems: decidable syntactic proxies for semantic properties',
    ],
    visId: 'reduction',
  },
];
