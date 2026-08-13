import type { Plugin } from 'vite';
import { SITE_ORIGIN } from '../src/lib/site';
import { routes, type SiteRoute } from '../src/lib/routes';

/**
 * Generates dist/sitemap.xml from the route list at build time.
 *
 * Hand-written sitemap XML drifts the moment someone adds a page, so the list
 * in src/lib/routes.ts is the only thing to maintain — add the blog and FAQ
 * URLs there and they appear here automatically.
 */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderSitemap(
  entries: SiteRoute[],
  buildDate: string,
  origin: string = SITE_ORIGIN,
): string {
  const urls = entries
    .map((route) => {
      const loc = `${origin}${route.path.startsWith('/') ? route.path : `/${route.path}`}`;
      const parts = [`    <loc>${xmlEscape(loc)}</loc>`];
      parts.push(`    <lastmod>${route.lastmod ?? buildDate}</lastmod>`);
      if (route.changefreq) {
        parts.push(`    <changefreq>${route.changefreq}</changefreq>`);
      }
      if (route.priority !== undefined) {
        parts.push(`    <priority>${route.priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function sitemapPlugin(): Plugin {
  const buildDate = new Date().toISOString().slice(0, 10);
  let isSsrBuild = false;

  return {
    name: 'torkq-sitemap',

    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr);
    },

    // Also serve it in dev so /sitemap.xml can be checked without a build.
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml');
        res.end(renderSitemap(routes, buildDate));
      });
    },

    // vite-react-ssg runs two builds — the client bundle, then a server bundle
    // used only to pre-render. Emitting from both would write the sitemap into
    // the throwaway SSR output as well, so this only fires for the client pass
    // that actually produces dist/.
    generateBundle() {
      if (isSsrBuild) return;

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: renderSitemap(routes, buildDate),
      });
    },
  };
}
