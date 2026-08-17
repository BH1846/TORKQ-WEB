/**
 * Single source of truth for the site's absolute URLs and shared head copy.
 *
 * Every absolute URL on the site derives from DOMAIN, so this is the only
 * place to change it — except the two static files that cannot import from
 * here (index.html, public/robots.txt), which hardcode the same host.
 */
export const DOMAIN = 'www.torkq.com';

export const SITE_ORIGIN = `https://${DOMAIN}`;

export const SITE_NAME = 'TorkQ';

export const DEFAULT_TITLE =
  'TorkQ — AI Governance Gateway for Regulated Enterprises';

/** Kept to ~155 characters so search results show it without truncation. */
export const DEFAULT_DESCRIPTION =
  'TorkQ is an on-premise AI governance gateway that masks PII in prompts before they reach an LLM, controls model access, and logs a tamper-evident audit trail.';

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export const LOGO_URL = `${SITE_ORIGIN}/logo.png`;

/** Turns a root-relative path into an absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
