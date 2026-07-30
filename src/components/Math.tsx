import katex from 'katex';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

function render(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      output: 'html',
    });
  } catch {
    return tex;
  }
}

export function TeX({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(() => render(tex, block), [tex, block]);
  return block ? (
    <div className="tex-block" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className="tex-inline" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * Splits a string on `$…$` math spans, `**bold**` and `` `code` `` and renders
 * each piece. Authoring content stays plain text in the data files.
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  const nodes = useMemo(() => parse(text), [text]);
  return <p className={className}>{nodes}</p>;
}

const TOKEN = /(\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;

function parse(text: string): ReactNode[] {
  const parts = text.split(TOKEN);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return <TeX key={i} tex={part.slice(1, -1)} />;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}
