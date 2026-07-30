import { categories, edges, proofs, proofsInCategory } from '../data';
import { Action, Card, Kicker, SectionHeading, accentStyle } from '../components/ui';

export default function Home() {
  const softCount = edges.filter((e) => e.kind === 'soft').length;
  return (
    <div className="page">
      <section className="hero">
        <h1>
          The proofs computer science actually runs on — <em>formally stated, and playable</em>.
        </h1>
        <p>
          {proofs.length} proofs across {categories.length} tracks. Every entry pairs the formal argument,
          step by step, with an interactive visualization you can push on, and names a physical object that
          carries the same structure. Tracks are ordered so each proof only leans on ones you have already
          seen; the map shows how the tracks touch.
        </p>
        <div className="hero-actions">
          <Action to="/track/foundations">Start with foundations</Action>
          <Action to="/atlas" tone="ghost">
            Open the map
          </Action>
        </div>
        <div className="hero-stats">
          <span>
            <b>{proofs.length}</b> proofs
          </span>
          <span>
            <b>{edges.filter((e) => e.kind === 'prerequisite').length}</b> prerequisite edges
          </span>
          <span>
            <b>{softCount}</b> soft links
          </span>
          <span>
            <b>{proofs.length}</b> interactive visuals
          </span>
        </div>
      </section>

      <section>
        <SectionHeading>Roadmaps</SectionHeading>
        <div className="track-grid">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              to={`/track/${cat.id}`}
              tone="ridge"
              className="track-card"
              style={accentStyle(cat.color)}
            >
              <Kicker>{cat.kicker}</Kicker>
              <h3>{cat.title}</h3>
              <p>{cat.blurb}</p>
              <ol className="track-peek">
                {proofsInCategory(cat.id).map((p) => (
                  <li key={p.id}>{p.title}</li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
