import { Link, useParams } from 'react-router-dom';
import { categoryById, neighbours, proofById, proofsInCategory } from '../data';
import { Prose, TeX } from '../components/Math';
import { visualizations } from '../vis/registry';
import { Action, Chip, Chips, Crumbs, Panel, accentStyle } from '../components/ui';

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
    <div className="page proof-page" style={accentStyle(category.color)}>
      <Crumbs>
        <Link to="/">Tracks</Link>
        <span>/</span>
        <Link to={`/track/${category.id}`}>{category.title}</Link>
        <span>/</span>
        <b>step {at + 1}</b>
      </Crumbs>

      <header className="proof-head">
        <h1>{proof.title}</h1>
        <Prose className="proof-tagline" text={proof.tagline} />
        <Chips>
          {proof.techniques.map((t) => (
            <Chip key={t} tone="accent">
              {t}
            </Chip>
          ))}
          <Chip tone="quiet">difficulty {proof.difficulty}/5</Chip>
        </Chips>
      </header>

      <Panel label="Theorem" tone="quote">
        <Prose text={proof.statement} />
        {proof.statementDisplay ? <TeX tex={proof.statementDisplay} block /> : null}
      </Panel>

      <Panel label="Play with it" tone="stage">
        {Vis ? <Vis /> : <p className="missing">No visualization registered for “{proof.visId}”.</p>}
      </Panel>

      <Panel label="The idea">
        <Prose text={proof.intuition} />
      </Panel>

      <Panel label="Proof">
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
      </Panel>

      <Panel label="In the physical world" tone="field">
        <h3>{proof.physical.anchor}</h3>
        <Prose text={proof.physical.description} />
      </Panel>

      <Panel label="Where it shows up">
        <ul className="applications">
          {proof.applications.map((a) => (
            <li key={a}>
              <Prose text={a} />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel label="How it connects">
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
      </Panel>

      <nav className="proof-nav">
        {prev ? (
          <Action to={`/proof/${prev.id}`} tone="ghost">
            ← {prev.title}
          </Action>
        ) : (
          <span />
        )}
        {next ? (
          <Action to={`/proof/${next.id}`} tone="ghost">
            {next.title} →
          </Action>
        ) : (
          <Action to="/atlas" tone="ghost">
            End of the track — open the map
          </Action>
        )}
      </nav>
    </div>
  );
}
