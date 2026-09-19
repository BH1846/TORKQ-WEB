import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { absoluteUrl } from '../../lib/site';

/**
 * The "where am I" trail, and the BreadcrumbList that goes with it.
 *
 * Every page below the homepage had exactly one way back — a bare "All posts"
 * link on a post, nothing at all on /faq — so a visitor two levels deep could
 * not see the hierarchy, and neither could a crawler. Google builds the
 * breadcrumb line under a search result from BreadcrumbList markup; with none
 * present it falls back to printing the raw URL, and the site loses both the
 * keyword-bearing trail in the SERP and the internal links that tell it which
 * pages are parents of which.
 *
 * The visible trail and the structured data are generated from the same array
 * on purpose. Markup that describes a trail the page does not actually show is
 * a structured-data violation, and the two drifting apart is exactly how that
 * happens.
 */

export interface Crumb {
  label: string;
  /** Root-relative path. Omitted on the final crumb — you are already there. */
  to?: string;
}

/** Home is implicit on every trail, so callers never pass it. */
const HOME: Crumb = { label: 'Home', to: '/' };

/**
 * BreadcrumbList JSON-LD for the same trail.
 *
 * `item` is absolute, as the spec requires, and is omitted on the last
 * element: Google's guidance is that the current page carries a name and
 * position but no URL.
 */
export function breadcrumbSchema(trail: Crumb[]): Record<string, unknown> {
  const items = [HOME, ...trail];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.to && i < items.length - 1
        ? { item: absoluteUrl(crumb.to) }
        : {}),
    })),
  };
}

export const Breadcrumbs: React.FC<{ trail: Crumb[]; className?: string }> = ({
  trail,
  className = '',
}) => {
  const items = [HOME, ...trail];

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-zinc-700"
                  aria-hidden="true"
                />
              )}

              {isLast || !crumb.to ? (
                // aria-current marks the end of the trail for a screen reader,
                // which otherwise hears a list of links with no indication of
                // which one is the page it is on.
                <span aria-current="page" className="text-zinc-300">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="transition-colors hover:text-[#6DBE30]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
