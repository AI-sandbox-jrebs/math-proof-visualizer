import { Link, useParams } from 'react-router-dom';
import { categoryById, neighbours, proofById, proofsInCategory } from '../data';
import { Prose, TeX } from '../components/Math';
import { visualizations } from '../vis/registry';

export default function ProofPage() {
  const { proofId } = useParams();
  const proof = proofId ? proofById.get(proofId) : undefined;
  if (!proof) {
    return (
      <div className="page">
        <p>Unknown proof.</p>
        <Link to="/">Back to the tracks</Link>
      </div>
    );
  }
  const category = categoryById.get(proof.category)!;
  const siblings = proofsInCategory(proof.category);
  const at = siblings.findIndex((p) => p.id === proof.id);
  const prev = siblings[at - 1];
  const next = siblings[at + 1];
  const links = neighbours(proof.id);
  const Vis = visualizations[proof.visId];
  return (
    <div className="page proof-page" style={{ '--accent': category.color } as React.CSSProperties}>
      <nav className="crumbs">
        <Link to="/">Tracks</Link>
        <span>/</span>
        <Link to={`/track/${category.id}`}>{category.title}</Link>
        <span>/</span>
        <b>step {at + 1}</b>
      </nav>

      <header className="proof-head">
        <h1>{proof.title}</h1>
        <Prose className="proof-tagline" text={proof.tagline} />
        <div className="chips">
          {proof.techniques.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
          <span className="chip chip-dim">difficulty {proof.difficulty}/5</span>
        </div>
      </header>

      <section className="panel panel-statement">
        <h2>Theorem</h2>
        <Prose text={proof.statement} />
        {proof.statementDisplay ? <TeX tex={proof.statementDisplay} block /> : null}
      </section>

      <section className="panel panel-vis">
        <h2>Play with it</h2>
        {Vis ? <Vis /> : <p className="missing">No visualization registered for “{proof.visId}”.</p>}
      </section>

      <section className="panel">
        <h2>The idea</h2>
        <Prose text={proof.intuition} />
      </section>

      <section className="panel">
        <h2>Proof</h2>
        <ol className="steps">
          {proof.steps.map((step, i) => (
            <li key={i}>
              <h3>{step.label}</h3>
              <Prose text={step.body} />
              {step.display ? <TeX tex={step.display} block /> : null}
              {step.visNote ? <p className="step-visnote">In the visual: {step.visNote}</p> : null}
            </li>
          ))}
        </ol>
        <p className="qed">∎</p>
      </section>

      <section className="panel panel-physical">
        <h2>In the physical world</h2>
        <h3>{proof.physical.anchor}</h3>
        <Prose text={proof.physical.description} />
      </section>

      <section className="panel">
        <h2>Where it shows up</h2>
        <ul className="applications">
          {proof.applications.map((a) => (
            <li key={a}>
              <Prose text={a} />
            </li>
          ))}
        </ul>
      </section>

      <section className="panel panel-links">
        <h2>How it connects</h2>
        <div className="link-cols">
          <div>
            <h3>Builds on</h3>
            {links.prerequisites.length ? (
              <ul>
                {links.prerequisites.map((p) => (
                  <li key={p.id}>
                    <Link to={`/proof/${p.id}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Nothing — this one starts from scratch.</p>
            )}
          </div>
          <div>
            <h3>Unlocks</h3>
            {links.unlocks.length ? (
              <ul>
                {links.unlocks.map((p) => (
                  <li key={p.id}>
                    <Link to={`/proof/${p.id}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">A leaf of the atlas, for now.</p>
            )}
          </div>
          <div>
            <h3>Soft links</h3>
            {links.related.length ? (
              <ul>
                {links.related.map(({ proof: p, why }) => (
                  <li key={p.id}>
                    <Link to={`/proof/${p.id}`}>{p.title}</Link>
                    <Prose className="why" text={why} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No cross-links recorded.</p>
            )}
          </div>
        </div>
      </section>

      <nav className="proof-nav">
        {prev ? (
          <Link className="cta cta-ghost" to={`/proof/${prev.id}`}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="cta cta-ghost" to={`/proof/${next.id}`}>
            {next.title} →
          </Link>
        ) : (
          <Link className="cta cta-ghost" to="/atlas">
            End of the track — open the map
          </Link>
        )}
      </nav>
    </div>
  );
}
