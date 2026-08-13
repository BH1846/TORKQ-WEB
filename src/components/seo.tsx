import React, { useEffect, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
} from '../lib/site';

/**
 * Per-route head management.
 *
 * index.html carries the homepage's tags statically so a crawler that does not
 * execute JavaScript still sees a real title, description and OG card. This
 * component then owns the head at runtime and is what future routes (blog,
 * FAQ) use to override those values — same tag names, so Helmet replaces
 * rather than duplicates them.
 *
 * `canonical` is a root-relative path ('/', '/blog/some-post'), not a full URL;
 * the origin comes from src/lib/site.ts so there is one place to change it.
 */
export interface SeoProps {
  title?: string;
  description?: string;
  /** Root-relative path for the canonical URL, e.g. '/faq'. */
  canonical?: string;
  /** Absolute URL. Defaults to the site-wide OG image. */
  ogImage?: string;
  /** 'website' for pages, 'article' for blog posts. */
  ogType?: 'website' | 'article';
  /** Emit the site-level Organization / SoftwareApplication / WebSite graph. */
  includeStructuredData?: boolean;
  /** Extra JSON-LD (e.g. BlogPosting, FAQPage) for a specific page. */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

/**
 * Site-level structured data.
 *
 * Deliberately minimal: only claims that are verifiably true today. No
 * founding date, employee count, address or sameAs profiles on the
 * Organization, and no aggregateRating or offers on the SoftwareApplication —
 * inventing those is structured-data spam and is a manual-action risk.
 */
function siteStructuredData(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      logo: absoluteUrl('/logo.png'),
      description:
        'TorkQ builds an on-premise AI governance gateway that masks sensitive data in prompts before they reach a large language model.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Windows, Linux',
      url: absoluteUrl('/'),
      description:
        'On-premise AI governance gateway that detects and masks PII in prompts before they reach a large language model, controls model access per user, and records a tamper-evident audit trail.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
  ];
}

/**
 * Drops the static head tags from index.html once the runtime head takes over.
 *
 * On React 19 react-helmet-async routes through React's native metadata
 * hoisting, which appends its tags to <head> and does not reconcile against
 * markup that was already there — so the static baseline and the rendered tags
 * would both be live, giving the page two titles and two canonicals. Removing
 * the marked nodes on mount leaves exactly one of each, while a crawler that
 * never runs the bundle still sees the static set.
 */
/**
 * useLayoutEffect does not run on the server and warns if it is called there.
 * The pages are pre-rendered now, so this picks useEffect during SSG and keeps
 * the layout timing — tags removed before paint — in the browser.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useStaticHeadTakeover(): void {
  useIsomorphicLayoutEffect(() => {
    document
      .querySelectorAll('head [data-seo-static]')
      .forEach((node) => node.remove());
  }, []);
}

export const Seo: React.FC<SeoProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  includeStructuredData = false,
  structuredData,
  noindex = false,
}) => {
  useStaticHeadTakeover();

  const canonicalUrl = absoluteUrl(canonical);

  const graph = [
    ...(includeStructuredData ? siteStructuredData() : []),
    ...(structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : []),
  ];

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {graph.map((node, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(node)}
        </script>
      ))}
    </Helmet>
  );
};
