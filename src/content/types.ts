/**
 * The content model for blog posts.
 *
 * Posts are data, not JSX: a post file exports a plain object, so adding one
 * needs no code change and nothing in this file may import React. That
 * constraint is load-bearing — src/lib/routes.ts pulls the post list in to
 * build the sitemap, and vite.config.ts imports *that*, so anything reachable
 * from here has to survive being evaluated by esbuild inside the Vite config.
 *
 * Bodies are structured blocks rather than HTML strings. A string body would
 * mean dangerouslySetInnerHTML, which turns every future post into an XSS
 * surface and makes the prose impossible to restyle; blocks are typed, so a
 * malformed post is a build error rather than a broken page.
 */

/**
 * An inline run of text. A bare string is the common case; the object form
 * carries a link or emphasis.
 *
 * `href` is what makes contextual internal linking possible mid-sentence,
 * which is the form of internal link that actually helps a post rank.
 */
export type Span =
  | string
  | {
      text: string;
      /** Root-relative ('/blog/x') or absolute. */
      href?: string;
      bold?: boolean;
      code?: boolean;
    };

/** A run of prose, one paragraph's worth. */
export interface ParagraphBlock {
  type: 'paragraph';
  spans: Span[];
}

/**
 * A subheading. Only h2 and h3 — the post's h1 is the title, rendered by the
 * post page itself, so a body heading can never compete with it.
 */
export interface HeadingBlock {
  type: 'heading';
  level: 2 | 3;
  text: string;
}

export interface ListBlock {
  type: 'list';
  ordered?: boolean;
  items: Span[][];
}

/** A pulled-aside note. Rendered as an aside, not a heading, so it stays out of the document outline. */
export interface CalloutBlock {
  type: 'callout';
  title?: string;
  spans: Span[];
}

export interface CodeBlock {
  type: 'code';
  language?: string;
  code: string;
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | CalloutBlock
  | CodeBlock;

export interface Post {
  /** URL segment. The post is served at /blog/<slug>. */
  slug: string;
  /** Also the <h1> and the <title> base. */
  title: string;
  /** Meta description and the card blurb on /blog. */
  description: string;
  /** Target terms, emitted in the BlogPosting JSON-LD. */
  keywords: string[];
  /** ISO yyyy-mm-dd. */
  datePublished: string;
  /** ISO yyyy-mm-dd. Drives <lastmod> in the sitemap. */
  dateModified: string;
  /** Name only. No titles or credentials we cannot stand behind. */
  author: string;
  /** Human-readable, e.g. '7 min read'. */
  readingTime: string;
  tags: string[];
  body: Block[];
}
