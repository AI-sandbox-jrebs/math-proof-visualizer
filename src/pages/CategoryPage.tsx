import { Link, useParams } from 'react-router';
import { categories, categoryById, roadmap } from '../data';
import type { CategoryId } from '../types';
import { Prose } from '../components/Math';
import {
  Action,
  Card,
  Chip,
  Chips,
  Crumbs,
  Difficulty,
  FieldNote,
  Kicker,
  Rung,
  accentStyle,
} from '../components/ui';

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
    <div className="page" style={accentStyle(category.color)}>
      <Crumbs>
        <Link to="/">Tracks</Link>
        <span>/</span>
        <b>{category.title}</b>
      </Crumbs>
      <header className="track-head">
        <Kicker>{category.kicker}</Kicker>
        <h1>{category.title}</h1>
        <p>{category.blurb}</p>
      </header>

      <ol className="roadmap">
        {steps.map(({ proof, imported }, i) => (
          <Rung key={proof.id} index={i + 1} last={i === steps.length - 1}>
            <Card to={`/proof/${proof.id}`}>
              <div className="rung-head">
                <h3>{proof.title}</h3>
                <Difficulty level={proof.difficulty} />
              </div>
              <Prose className="rung-tagline" text={proof.tagline} />
              <Chips>
                {proof.techniques.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
                {imported.map((p) => (
                  <Chip key={p.id} tone="accent">
                    needs {p.title}
                  </Chip>
                ))}
              </Chips>
              <FieldNote anchor={proof.physical.anchor}>{proof.physical.description}</FieldNote>
            </Card>
          </Rung>
        ))}
      </ol>

      <div className="track-foot">
        {nextCategory ? (
          <Action to={`/track/${nextCategory.id}`} tone="ghost">
            Next track: {nextCategory.title} →
          </Action>
        ) : null}
        <Action to="/atlas" tone="ghost">
          See this track on the map
        </Action>
      </div>
    </div>
  );
}
