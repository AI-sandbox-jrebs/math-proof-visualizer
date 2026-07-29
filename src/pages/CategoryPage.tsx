import { Link, useParams } from 'react-router-dom';
import { categories, categoryById, roadmap } from '../data';
import type { CategoryId } from '../types';
import { Prose } from '../components/Math';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = categoryById.get(categoryId as CategoryId);
  if (!category) {
    return (
      <div className="page">
        <p>Unknown track.</p>
        <Link to="/">Back to the tracks</Link>
      </div>
    );
  }
  const steps = roadmap(category.id);
  const index = categories.findIndex((c) => c.id === category.id);
  const nextCategory = categories[index + 1];
  return (
    <div className="page" style={{ '--accent': category.color } as React.CSSProperties}>
      <nav className="crumbs">
        <Link to="/">Tracks</Link>
        <span>/</span>
        <b>{category.title}</b>
      </nav>
      <header className="track-head">
        <span className="track-kicker">{category.kicker}</span>
        <h1>{category.title}</h1>
        <p>{category.blurb}</p>
      </header>

      <ol className="roadmap">
        {steps.map(({ proof, imported }, i) => (
          <li key={proof.id} className="roadmap-step">
            <div className="roadmap-rail">
              <span className="roadmap-dot">{i + 1}</span>
              {i < steps.length - 1 ? <span className="roadmap-line" /> : null}
            </div>
            <Link to={`/proof/${proof.id}`} className="roadmap-card">
              <div className="roadmap-card-head">
                <h3>{proof.title}</h3>
                <span className="difficulty" title={`difficulty ${proof.difficulty}/5`}>
                  {'●'.repeat(proof.difficulty)}
                  <span className="difficulty-dim">{'●'.repeat(5 - proof.difficulty)}</span>
                </span>
              </div>
              <Prose className="roadmap-tagline" text={proof.tagline} />
              <div className="chips">
                {proof.techniques.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
                {imported.map((p) => (
                  <span key={p.id} className="chip chip-import">
                    needs {p.title}
                  </span>
                ))}
              </div>
              <p className="roadmap-physical">
                <b>{proof.physical.anchor}</b> — {proof.physical.description}
              </p>
            </Link>
          </li>
        ))}
      </ol>

      <div className="track-foot">
        {nextCategory ? (
          <Link className="cta cta-ghost" to={`/track/${nextCategory.id}`}>
            Next track: {nextCategory.title} →
          </Link>
        ) : null}
        <Link className="cta cta-ghost" to="/atlas">
          See this track on the map
        </Link>
      </div>
    </div>
  );
}
