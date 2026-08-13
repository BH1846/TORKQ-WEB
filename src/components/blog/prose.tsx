import React from 'react';
import { Link } from 'react-router-dom';
import type { Block, Span } from '../../content/types';

/**
 * Renders a post's typed body blocks.
 *
 * No dangerouslySetInnerHTML anywhere in here. Every block type maps to real
 * elements, which is what keeps a post from being an injection surface and
 * lets the prose be restyled site-wide from one file.
 *
 * Typography is tuned for the dark surface the rest of the site uses: white
 * headings, zinc-300 body, brand green links. Measure is held by the article
 * container, not here.
 */

/** Root-relative links stay in the SPA; anything else is a real navigation. */
const isInternal = (href: string): boolean => href.startsWith('/');

const renderSpan = (span: Span, key: React.Key): React.ReactNode => {
  if (typeof span === 'string') return span;

  const { text, href, bold, code } = span;

  let node: React.ReactNode = text;

  if (code) {
    node = (
      <code className="rounded bg-white/[0.06] border border-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#9BE86A]">
        {text}
      </code>
    );
  }

  if (bold) {
    node = <strong className="font-semibold text-white">{node}</strong>;
  }

  if (href) {
    const className =
      'text-[#6DBE30] underline decoration-[#6DBE30]/30 underline-offset-4 hover:decoration-[#6DBE30] transition-colors';

    node = isInternal(href) ? (
      <Link to={href} className={className}>
        {node}
      </Link>
    ) : (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {node}
      </a>
    );
  }

  return <React.Fragment key={key}>{node}</React.Fragment>;
};

const renderSpans = (spans: Span[]): React.ReactNode[] =>
  spans.map((span, i) => renderSpan(span, i));

/**
 * Headings carry an id derived from their text so a section can be linked to
 * directly. scroll-mt keeps the target clear of the fixed nav pill.
 */
const headingId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const Block: React.FC<{ block: Block }> = ({ block }) => {
  switch (block.type) {
    case 'heading': {
      const id = headingId(block.text);
      // h2 and h3 only — the post title owns the single h1 on the page, so the
      // outline runs h1 → h2 → h3 with no level skipped and no competition.
      return block.level === 2 ? (
        <h2
          id={id}
          className="scroll-mt-28 text-2xl sm:text-3xl font-bold text-white tracking-heading leading-heading mt-14 mb-5"
        >
          {block.text}
        </h2>
      ) : (
        <h3
          id={id}
          className="scroll-mt-28 text-lg sm:text-xl font-bold text-white tracking-heading leading-heading mt-10 mb-4"
        >
          {block.text}
        </h3>
      );
    }

    case 'paragraph':
      return (
        <p className="text-[15px] sm:text-base text-zinc-300 leading-[1.75] mb-6">
          {renderSpans(block.spans)}
        </p>
      );

    case 'list': {
      const className =
        'mb-6 space-y-3 text-[15px] sm:text-base text-zinc-300 leading-[1.75] ps-6';
      const items = block.items.map((item, i) => (
        <li key={i} className="ps-1.5">
          {renderSpans(item)}
        </li>
      ));

      return block.ordered ? (
        <ol className={`${className} list-decimal marker:text-[#6DBE30] marker:font-semibold`}>
          {items}
        </ol>
      ) : (
        <ul className={`${className} list-disc marker:text-[#6DBE30]`}>{items}</ul>
      );
    }

    case 'callout':
      // <aside>, not a section with a heading — a callout is a digression and
      // should not appear in the document outline a crawler builds.
      return (
        <aside className="my-8 rounded-2xl border border-[#6DBE30]/20 bg-[#6DBE30]/[0.06] p-5 sm:p-6">
          {block.title && (
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#6DBE30]">
              {block.title}
            </p>
          )}
          <p className="text-[15px] text-zinc-300 leading-[1.7]">
            {renderSpans(block.spans)}
          </p>
        </aside>
      );

    case 'code':
      return (
        <pre className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-5 text-[13px] leading-relaxed">
          <code className="font-mono text-zinc-300">{block.code}</code>
        </pre>
      );
  }
};

export const Prose: React.FC<{ blocks: Block[] }> = ({ blocks }) => (
  <>
    {blocks.map((block, i) => (
      <Block key={i} block={block} />
    ))}
  </>
);
