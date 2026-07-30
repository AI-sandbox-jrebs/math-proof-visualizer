import type { Proof } from '../../types';
import { r } from '../raw';

export const numbers: Proof[] = [
  {
    id: 'euclid-infinite-primes',
    title: 'There Are Infinitely Many Primes',
    category: 'numbers',
    order: 1,
    tagline: 'Multiply your list, add one, and something new must divide it.',
    techniques: ['contradiction', 'construction'],
    difficulty: 2,
    statement: r`The set of prime numbers is infinite.`,
    intuition:
      r`Given any finite list of primes, build $N$ = (their product) $+ 1$. Every prime on the list leaves remainder $1$ when dividing $N$, so none of them divides it. But $N > 1$ has some prime factor — necessarily one you had not listed. No finite list can be complete.`,
    steps: [
      {
        label: 'Assume finiteness',
        body: r`Suppose the primes are exactly $p_1, p_2, \dots, p_k$ for some finite $k$.`,
      },
      {
        label: 'Construct N',
        body: r`Define $N$ as one more than the product of all of them. Note $N \ge 3$, so $N > 1$.`,
        display: r`N = p_1 p_2 \cdots p_k + 1`,
        visNote: 'Toggle primes into the list and watch N and its factorization update.',
      },
      {
        label: 'N has a prime factor',
        body: r`Every integer greater than $1$ has a prime divisor: its smallest divisor exceeding $1$ must be prime, since a composite divisor would contain a smaller one. Let $q$ be a prime dividing $N$.`,
      },
      {
        label: 'q is not on the list',
        body: r`If $q = p_i$ for some $i$, then $q$ divides both $N$ and $p_1 \cdots p_k$, hence divides their difference $1$ — impossible for a prime. So $q \notin \{p_1, \dots, p_k\}$.`,
        display: r`q \mid N \text{ and } q \mid \prod_i p_i \;\Longrightarrow\; q \mid 1`,
      },
      {
        label: 'Conclude',
        body: r`The list was assumed to contain every prime, yet $q$ is a prime outside it — a contradiction. Hence there are infinitely many primes. $\blacksquare$`,
      },
      {
        label: 'A common misreading',
        body: r`$N$ itself need not be prime: $2 \cdot 3 \cdot 5 \cdot 7 \cdot 11 \cdot 13 + 1 = 30031 = 59 \cdot 509$. The argument only claims $N$’s prime factors are new, which is all it needs.`,
        visNote: 'The 30031 example is preloaded as a button.',
      },
    ],
    prerequisites: ['sqrt2-irrational'],
    softLinks: [
      { to: 'rsa-correctness', why: 'Cryptography needs an inexhaustible supply of large primes.' },
      { to: 'cantor-diagonal', why: 'Both build an object outside any purported complete list.' },
      { to: 'halting-problem', why: 'The "diagonal escape" pattern: assume a catalogue, construct the exception.' },
    ],
    physical: {
      anchor: 'Indivisible building blocks',
      description:
        'Primes are the atoms of multiplication, and the supply never runs out. That inexhaustibility is what lets us keep choosing fresh 2048-bit primes for keys without ever colliding with someone else’s.',
    },
    applications: [
      'Key generation feasibility for RSA and Diffie–Hellman',
      'Hash function design over prime moduli',
      'Distribution estimates behind primality-testing cost',
    ],
    visId: 'primes',
  },
  {
    id: 'euclid-gcd',
    title: 'Euclid’s Algorithm and Bézout’s Identity',
    category: 'numbers',
    order: 2,
    tagline: 'The gcd is the smallest positive combination you can build.',
    techniques: ['invariant', 'induction', 'construction'],
    difficulty: 3,
    statement:
      r`For integers $a, b$ not both zero, the recursion $\gcd(a,b) = \gcd(b, a \bmod b)$ terminates at $\gcd(d, 0) = d$ with $d = \gcd(a,b)$. Moreover there exist integers $x, y$ with $ax + by = \gcd(a,b)$.`,
    statementDisplay: r`\gcd(a,b) = \min\{\, ax + by > 0 : x,y \in \mathbb{Z} \,\}`,
    intuition:
      r`Subtracting one number from another never changes their common divisors, so replacing $(a,b)$ by $(b, a \bmod b)$ preserves the answer while shrinking the numbers — that is both correctness and termination. Running the substitutions backwards expresses the gcd as a combination of the originals, which is where modular inverses come from.`,
    steps: [
      {
        label: 'The key invariant',
        body: r`If $d \mid a$ and $d \mid b$ then $d \mid a - qb$ for any integer $q$; conversely if $d \mid b$ and $d \mid a - qb$ then $d \mid a$. So the pairs $(a,b)$ and $(b, a - qb)$ have exactly the same set of common divisors, hence the same gcd.`,
        display: r`\gcd(a,b) = \gcd(b,\, a \bmod b)`,
        visNote: 'The rectangle is repeatedly tiled by the largest square that fits.',
      },
      {
        label: 'Termination',
        body: r`With $b > 0$, $a \bmod b$ lies in $[0, b)$, so the second argument strictly decreases and stays non-negative. By well-ordering it reaches $0$ after finitely many steps, where $\gcd(d, 0) = d$ since every integer divides $0$.`,
      },
      {
        label: 'Correctness',
        body: r`By induction on the (strictly decreasing) second argument, each recursive call returns the gcd of its arguments, which by the invariant equals $\gcd(a,b)$. $\blacksquare$ (for the algorithm)`,
      },
      {
        label: 'Bézout via least positive combination',
        body: r`Let $S = \{ax + by : x,y \in \mathbb{Z}\} \cap \mathbb{Z}_{>0}$, nonempty since $a^2 + b^2 \in S$. Let $d = ax_0 + by_0$ be its least element. Dividing, $a = qd + r$ with $0 \le r < d$, and $r = a - qd = a(1 - qx_0) + b(-qy_0)$ is also a combination. If $r > 0$ it would be a smaller positive element of $S$, so $r = 0$ and $d \mid a$; similarly $d \mid b$.`,
        display: r`d = a x_0 + b y_0, \qquad d \mid a, \; d \mid b`,
      },
      {
        label: 'It is the greatest',
        body: r`Any common divisor $e$ of $a$ and $b$ divides $ax_0 + by_0 = d$, hence $e \le d$. So $d = \gcd(a,b)$ and Bézout’s identity holds. $\blacksquare$`,
      },
      {
        label: 'Modular inverses',
        body: r`If $\gcd(a,n) = 1$ then $ax + ny = 1$, so $ax \equiv 1 \pmod n$: the extended algorithm *computes* inverses, which is exactly the step that produces an RSA private exponent.`,
        visNote: 'Run the extended table to read off x and y.',
      },
    ],
    prerequisites: ['euclid-infinite-primes', 'binary-search-invariant'],
    softLinks: [
      { to: 'rsa-correctness', why: 'The private exponent is a Bézout coefficient.' },
      { to: 'sqrt2-irrational', why: 'Lowest terms is the gcd being 1.' },
      { to: 'binary-search-invariant', why: 'Both loops are proved by a decreasing non-negative measure.' },
    ],
    physical: {
      anchor: 'Tiling a rectangle with the largest possible square',
      description:
        'Take a 42×30 sheet, cut off the biggest squares you can, and repeat on the leftover strip. The size of the final square that tiles the last strip exactly is the gcd — a geometry of remainders that you can carry out with scissors.',
    },
    applications: [
      'Modular inverses for RSA, ECC and hashing',
      'Reducing fractions and rational arithmetic',
      'Solving linear Diophantine equations and CRT reconstruction',
    ],
    visId: 'gcd',
  },
  {
    id: 'fermat-little',
    title: 'Fermat’s Little Theorem',
    category: 'numbers',
    order: 3,
    tagline: 'Multiplying by a shuffles the nonzero residues, and the product tells you why.',
    techniques: ['counting', 'construction'],
    difficulty: 3,
    statement:
      r`Let $p$ be prime and $a$ an integer with $p \nmid a$. Then $a^{p-1} \equiv 1 \pmod p$. Equivalently, $a^{p} \equiv a \pmod p$ for every integer $a$.`,
    intuition:
      r`Multiplication by $a$ is a bijection on the nonzero residues mod $p$ — it just permutes them. So the product of all nonzero residues is unchanged, except that the rearranged version has picked up a factor $a^{p-1}$. Cancel the common product and $a^{p-1} \equiv 1$ falls out.`,
    steps: [
      {
        label: 'Multiplication by a is injective',
        body: r`Work in $\mathbb{Z}_p$. If $ai \equiv aj \pmod p$ then $p \mid a(i-j)$; since $p$ is prime and $p \nmid a$, Euclid’s lemma gives $p \mid i - j$. So on $\{1, \dots, p-1\}$ the map $i \mapsto ai \bmod p$ is injective.`,
        visNote: 'Arrows show where each residue is sent; nothing collides.',
      },
      {
        label: 'And surjective',
        body: r`An injective map from a finite set to itself is a bijection (pigeonhole again). Also $ai \not\equiv 0$, so images stay inside $\{1,\dots,p-1\}$. Hence $\{a \cdot 1, a\cdot 2, \dots, a(p-1)\}$ is a permutation of $\{1, 2, \dots, p-1\}$ modulo $p$.`,
      },
      {
        label: 'Multiply everything',
        body: r`Taking the product of all elements on both sides of that equality of sets:`,
        display: r`\prod_{i=1}^{p-1} (a i) \;\equiv\; \prod_{i=1}^{p-1} i \pmod p \quad\Longrightarrow\quad a^{p-1} (p-1)! \;\equiv\; (p-1)! \pmod p`,
      },
      {
        label: 'Cancel the factorial',
        body: r`Each factor of $(p-1)!$ is in $\{1,\dots,p-1\}$, so $p \nmid (p-1)!$ and $(p-1)!$ is invertible mod $p$ (by Bézout). Cancelling gives $a^{p-1} \equiv 1 \pmod p$.`,
        display: r`a^{p-1} \equiv 1 \pmod p`,
      },
      {
        label: 'The second form',
        body: r`Multiplying by $a$ gives $a^p \equiv a \pmod p$ when $p \nmid a$; and if $p \mid a$ both sides are $0$. So $a^p \equiv a$ holds for all integers $a$. $\blacksquare$`,
      },
      {
        label: 'Primality testing, and its limits',
        body: r`The contrapositive gives a fast compositeness test: if $a^{n-1} \not\equiv 1 \pmod n$ then $n$ is composite. The converse fails — Carmichael numbers like $561$ fool every base coprime to them — which is why Miller–Rabin adds a square-root condition.`,
        visNote: 'Try n = 561 in the tester to see a Fermat liar.',
      },
    ],
    prerequisites: ['euclid-gcd', 'pigeonhole'],
    softLinks: [
      { to: 'rsa-correctness', why: 'Supplies the exponent identity that makes decryption invert encryption.' },
      { to: 'pigeonhole', why: 'Injective self-map of a finite set is surjective — pigeonhole in disguise.' },
      { to: 'perron-pagerank', why: 'Both study a map that permutes/mixes a finite state space.' },
    ],
    physical: {
      anchor: 'A clock with p−1 hours and a stepping hand',
      description:
        'Step around a circular dial by a fixed stride and you visit every position exactly once before returning — think of a bicycle gear or a music circle of fifths. Fermat’s theorem is the statement that the cycle always closes after a predictable number of steps.',
    },
    applications: [
      'Fermat and Miller–Rabin primality tests',
      'Fast modular inverses via a^(p−2)',
      'Correctness of RSA and many hash constructions',
    ],
    visId: 'fermat',
  },
  {
    id: 'rsa-correctness',
    title: 'RSA Decryption Really Inverts Encryption',
    category: 'numbers',
    order: 4,
    tagline: 'Two exponents that multiply to 1 mod φ(n) undo each other.',
    techniques: ['direct', 'construction'],
    difficulty: 4,
    statement:
      r`Let $n = pq$ for distinct primes $p, q$, let $\varphi(n) = (p-1)(q-1)$, and let $e, d$ satisfy $ed \equiv 1 \pmod{\varphi(n)}$. Then for every $m \in \{0, 1, \dots, n-1\}$, $(m^{e})^{d} \equiv m \pmod n$.`,
    statementDisplay: r`m^{ed} \equiv m \pmod{n} \quad \text{whenever } ed \equiv 1 \pmod{(p-1)(q-1)}`,
    intuition:
      r`Write $ed = 1 + k\varphi(n)$. Modulo $p$, Fermat’s little theorem collapses $m^{k(p-1)(q-1)}$ to $1$, leaving $m$; the same happens modulo $q$. Two congruences that agree modulo both primes agree modulo their product, so the round trip returns the message — including the awkward cases where $m$ shares a factor with $n$.`,
    steps: [
      {
        label: 'Rewrite the exponent',
        body: r`From $ed \equiv 1 \pmod{\varphi(n)}$ there is an integer $k \ge 0$ with $ed = 1 + k(p-1)(q-1)$.`,
        display: r`m^{ed} = m^{1 + k(p-1)(q-1)} = m \cdot \left(m^{(p-1)}\right)^{k(q-1)}`,
      },
      {
        label: 'Work modulo p',
        body: r`If $p \nmid m$, Fermat gives $m^{p-1} \equiv 1 \pmod p$, so $m^{ed} \equiv m \cdot 1^{k(q-1)} \equiv m \pmod p$. If $p \mid m$ then both $m^{ed}$ and $m$ are $\equiv 0 \pmod p$. Either way the congruence holds.`,
        display: r`m^{ed} \equiv m \pmod p`,
        visNote: 'The two residue tracks (mod p and mod q) are shown separately.',
      },
      {
        label: 'Work modulo q',
        body: r`Symmetrically, using $m^{q-1} \equiv 1 \pmod q$ when $q \nmid m$, we get $m^{ed} \equiv m \pmod q$.`,
      },
      {
        label: 'Glue with CRT',
        body: r`So $p$ and $q$ both divide $m^{ed} - m$. As $p \neq q$ are primes, their product divides it too — equivalently, the Chinese Remainder Theorem says the map $x \mapsto (x \bmod p,\; x \bmod q)$ is injective on $\mathbb{Z}_n$.`,
        display: r`p \mid (m^{ed} - m), \; q \mid (m^{ed} - m) \;\Longrightarrow\; n = pq \mid (m^{ed} - m)`,
      },
      {
        label: 'Conclude',
        body: r`Hence $m^{ed} \equiv m \pmod n$ for all $m$, so $D(E(m)) = m$: RSA is a valid cryptosystem. $\blacksquare$`,
      },
      {
        label: 'Correctness is not security',
        body: r`This proof says decryption works; it says nothing about secrecy. Security rests on the *unproven* assumption that recovering $m$ from $m^e \bmod n$ (or factoring $n$) is infeasible. Textbook RSA is also deterministic and malleable, which is why real deployments use OAEP padding.`,
      },
    ],
    prerequisites: ['fermat-little', 'euclid-gcd'],
    softLinks: [
      { to: 'euclid-gcd', why: 'The extended algorithm computes d from e.' },
      { to: 'clique-reduction', why: 'Security depends on hardness assumptions, the same currency as NP-hardness.' },
      { to: 'euclid-infinite-primes', why: 'Guarantees fresh primes for key generation.' },
    ],
    physical: {
      anchor: 'A padlock anyone can snap shut',
      description:
        'Hand out open padlocks freely; only you keep the key. Encryption is closing the lock, and the proof above is the guarantee that your key actually opens every lock you handed out, not merely most of them.',
    },
    applications: [
      'TLS certificates and signatures',
      'SSH and PGP key exchange',
      'Blind signatures and secure e-voting protocols',
    ],
    visId: 'rsa',
  },
];
