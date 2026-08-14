/**
 * The site's indexable routes, in one list.
 *
 * The sitemap is generated from this at build time (see the `torkq-sitemap`
 * plugin in vite.config.ts) rather than hand-maintained as XML, so a new page
 * cannot ship with a stale sitemap. The blog posts are appended from the post
 * registry rather than listed by hand, so publishing a post puts it in the
 * sitemap with the right <lastmod> without anyone remembering to come here.
 *
 * Kept dependency-free and JSX-free on purpose: vite.config.ts imports it.
 */
import { posts, postPath } from '../content/posts';

export interface SiteRoute {
  /** Root-relative path, e.g. '/' or '/faq'. */
  path: string;
  /** ISO yyyy-mm-dd. Falls back to the build date when omitted. */
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  /** 0.0–1.0, relative to the rest of this site only. */
  priority?: number;
}

/** Pages that exist regardless of how much has been published. */
const staticRoutes: SiteRoute[] = [
  {
    path: '/',
    lastmod: '2026-08-13',
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/blog',
    // The index changes whenever the newest post does.
    lastmod: posts[0]?.dateModified ?? '2026-08-13',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/faq',
    lastmod: '2026-08-13',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    // Reference page for the DPDP penalty schedule. Changes only when the Act
    // or the Rules do, hence the low changefreq despite the high priority.
    path: '/dpdp-exposure',
    lastmod: '2026-08-14',
    changefreq: 'yearly',
    priority: 0.9,
  },
];

const postRoutes: SiteRoute[] = posts.map((post) => ({
  path: postPath(post),
  lastmod: post.dateModified,
  changefreq: 'monthly',
  priority: 0.7,
}));

export const routes: SiteRoute[] = [...staticRoutes, ...postRoutes];

/**
 * Every path vite-react-ssg should pre-render, derived from the same list so
 * the sitemap can never advertise a URL that was not built.
 */
export const allRoutePaths: string[] = routes.map((route) => route.path);
