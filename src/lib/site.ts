/**
 * Single source of truth for the site's absolute URLs and shared head copy.
 *
 * DOMAIN is a deliberate literal placeholder — the production domain is not
 * finalised yet. Find-and-replace `{{DOMAIN}}` across the repo once it is;
 * every absolute URL on the site is derived from the constant below, so the
 * only other places it appears are the static files that cannot import it
 * (index.html, public/robots.txt).
 */
export const DOMAIN = '{{DOMAIN}}';

export const SITE_ORIGIN = `https://${DOMAIN}`;

export const SITE_NAME = 'TorkQ';

export const DEFAULT_TITLE =
  'TorkQ — Keep Company Data Out of AI Models | AI Governance Gateway';

export const DEFAULT_DESCRIPTION =
  'TorkQ is an on-premise AI governance gateway. Detect and mask PII before prompts reach an LLM, control model access per user, and keep a tamper-evident audit trail. Built for DPDP Act compliance.';

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export const LOGO_URL = `${SITE_ORIGIN}/logo.png`;

/** Turns a root-relative path into an absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
