/**
 * Moves the head tags rendered by <Seo> out of the body and into <head>.
 *
 * Why this is needed: on React 19, react-helmet-async hands off to React's
 * native metadata support. In the browser React hoists <title>/<meta>/<link>
 * into <head> itself, but the SSG pass renders the app to a string that is
 * then injected into <div id="root">, so those tags land inside the body. A
 * <title> in the body is invalid, and a canonical there is ignored — which
 * would mean every pre-rendered page shipped with only the generic baseline
 * tags from index.html and no per-page SEO at all.
 *
 * So after each page renders we lift them into <head>, and drop the
 * data-seo-static baseline tags they replace. index.html keeps that baseline
 * for dev and as the fallback for any HTML this step does not touch; every
 * route renders <Seo> with a complete tag set, so removing them here always
 * leaves a real replacement behind.
 *
 * The JSON-LD scripts are deliberately left where they are. React treats
 * title/meta/link as hoistable and, on hydration, looks for them in <head>
 * rather than at their position in the tree — so moving them is invisible to
 * it. A <script type="application/ld+json"> is an ordinary element: React
 * expects to find it exactly where it rendered it, and lifting it out of the
 * body makes hydration fail and the whole tree re-render on the client.
 * Google reads JSON-LD from the body as happily as from the head, so there is
 * nothing to gain by moving it and a working hydration to lose.
 *
 * String surgery rather than a DOM parse: this runs once per route inside the
 * build, the input is markup we generated ourselves, and the tags are all
 * self-contained and void. Adding a parser dependency to the build for it
 * would not buy correctness we do not already have.
 */

/** The void head elements <Seo> emits. */
const VOID_TAG_PATTERN = /<(title|meta|link)\b[^>]*?>(?:([^<]*)<\/\1>)?/gi;

/** Attributes that mark a tag as one <Seo> owns and therefore worth hoisting. */
const HOISTABLE_META =
  /\b(?:name|property)=["'](?:description|robots|og:[\w:]+|twitter:[\w:]+)["']/i;
const HOISTABLE_LINK = /\brel=["']canonical["']/i;

function isHoistable(tag: string): boolean {
  const lower = tag.toLowerCase();
  if (lower.startsWith('<title')) return true;
  if (lower.startsWith('<meta')) return HOISTABLE_META.test(tag);
  if (lower.startsWith('<link')) return HOISTABLE_LINK.test(tag);
  return false;
}

/** Splits a document at the </head> boundary so the two halves can be treated separately. */
function splitHead(html: string): { head: string; body: string } | null {
  const index = html.search(/<\/head\s*>/i);
  if (index === -1) return null;
  return { head: html.slice(0, index), body: html.slice(index) };
}

/**
 * Strips the tags index.html marks with data-seo-static, so the hoisted ones
 * are the only title/canonical/OG set in the document.
 */
function stripStaticBaseline(head: string): string {
  return (
    head
      .replace(
        /\s*<(title|meta|link)\b[^>]*\bdata-seo-static\b[^>]*?>(?:[^<]*<\/\1>)?/gi,
        '',
      )
      // The baseline JSON-LD too. It is not hoisted from the body like the
      // tags above — <Seo> deliberately leaves its scripts there — but it
      // still has to go, or the page carries two Organization nodes.
      .replace(
        /\s*<script\b[^>]*\bdata-seo-static\b[^>]*>[\s\S]*?<\/script\s*>/gi,
        '',
      )
  );
}

/**
 * Head tags every pre-rendered page must carry exactly once.
 *
 * Zero means a crawler that does not run the bundle sees nothing; two means
 * the baseline and the hoisted copy are both live and the page contradicts
 * itself. Both are silent failures in the served HTML — nothing at runtime
 * would surface them — so the build asserts on them instead.
 */
const REQUIRED_ONCE: ReadonlyArray<readonly [string, RegExp]> = [
  ['<title>', /<title[^>]*>/gi],
  ['meta[name=description]', /<meta\b[^>]*\bname=["']description["']/gi],
  ['meta[name=robots]', /<meta\b[^>]*\bname=["']robots["']/gi],
  ['link[rel=canonical]', /<link\b[^>]*\brel=["']canonical["']/gi],
  ['meta[og:title]', /<meta\b[^>]*\bproperty=["']og:title["']/gi],
  ['meta[og:description]', /<meta\b[^>]*\bproperty=["']og:description["']/gi],
  ['meta[og:url]', /<meta\b[^>]*\bproperty=["']og:url["']/gi],
  ['meta[og:image]', /<meta\b[^>]*\bproperty=["']og:image["']/gi],
  ['meta[og:type]', /<meta\b[^>]*\bproperty=["']og:type["']/gi],
  ['meta[twitter:card]', /<meta\b[^>]*\bname=["']twitter:card["']/gi],
  ['meta[twitter:title]', /<meta\b[^>]*\bname=["']twitter:title["']/gi],
  ['meta[twitter:image]', /<meta\b[^>]*\bname=["']twitter:image["']/gi],
];

/**
 * Fails the build if a pre-rendered page's SEO is not fully present in the
 * static HTML.
 *
 * Comments are stripped before counting: index.html's explanatory comment
 * quotes tag names like `<title>` as prose, which a naive count reads as a
 * second tag.
 */
export function assertStaticSeo(route: string, html: string): void {
  const stripped = html.replace(/<!--[\s\S]*?-->/g, '');
  const headEnd = stripped.search(/<\/head\s*>/i);
  if (headEnd === -1) throw new Error(`[seo] ${route}: no </head> in output`);
  const head = stripped.slice(0, headEnd);

  const problems: string[] = [];

  for (const [label, pattern] of REQUIRED_ONCE) {
    const found = [...head.matchAll(pattern)].length;
    if (found !== 1) problems.push(`${label}: found ${found}, expected 1`);
  }

  // A surviving baseline tag means stripStaticBaseline missed it, so the
  // homepage's canonical is now claiming to be this route.
  if (head.includes('data-seo-static')) {
    problems.push('a data-seo-static baseline tag survived into <head>');
  }

  const h1s = [...stripped.matchAll(/<h1[\s>]/gi)].length;
  if (h1s !== 1) problems.push(`<h1>: found ${h1s}, expected 1`);

  if (problems.length > 0) {
    throw new Error(
      `[seo] ${route} would ship broken metadata:\n  - ${problems.join('\n  - ')}`,
    );
  }
}

export function hoistHeadTags(html: string, route = '(unknown route)'): string {
  const split = splitHead(html);
  if (!split) return html;

  const hoisted: string[] = [];

  // Pull the SEO tags out of the body half only — anything already in <head>
  // stays where it is.
  const body = split.body.replace(VOID_TAG_PATTERN, (match) => {
    if (!isHoistable(match)) return match;
    hoisted.push(match);
    return '';
  });

  // Nothing to hoist means the page did not render <Seo>. Returning early
  // would leave index.html's homepage baseline in place, quietly giving this
  // route the homepage's title and canonical, so this is an error, not a
  // no-op — the assert below is what reports it.
  const result =
    hoisted.length === 0
      ? html
      : `${stripStaticBaseline(split.head)}${hoisted.join('')}${body}`;

  assertStaticSeo(route, result);

  return result;
}
