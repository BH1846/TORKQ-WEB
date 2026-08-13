import type { Post } from '../types';
import { post as dpdpActComplianceForAi } from './dpdp-act-compliance-for-ai';
import { post as preventPiiLeaksToLlms } from './prevent-pii-leaks-to-llms';
import { post as onPremiseAiGatewayDataPrivacy } from './on-premise-ai-gateway-data-privacy';

/**
 * The post registry. Everything downstream is derived from this array: the
 * /blog index, the static paths vite-react-ssg pre-renders, and the sitemap.
 *
 * Adding a post is a file plus one import line here — deliberately not
 * `import.meta.glob`. The sitemap plugin reaches this module from
 * vite.config.ts, which Vite bundles with esbuild, and esbuild does not
 * implement `import.meta.glob`. An eager glob would work in the app and then
 * silently produce a sitemap missing every post. An explicit list cannot fail
 * that way, and it is type-checked.
 *
 * This module must stay free of React and JSX for the same reason.
 */
const registry: Post[] = [
  dpdpActComplianceForAi,
  preventPiiLeaksToLlms,
  onPremiseAiGatewayDataPrivacy,
];

/** Newest first — the order the blog index and the sitemap both want. */
export const posts: Post[] = [...registry].sort((a, b) =>
  b.datePublished.localeCompare(a.datePublished),
);

export function getPostBySlug(slug: string | undefined): Post | undefined {
  return slug ? posts.find((post) => post.slug === slug) : undefined;
}

/** Root-relative URL for a post. One definition, used by links and the sitemap. */
export function postPath(post: Pick<Post, 'slug'>): string {
  return `/blog/${post.slug}`;
}
