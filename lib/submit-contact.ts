/**
 * Posts a contact-form submission to the Google Apps Script Web App that
 * appends it to the TorkQ Responses spreadsheet.
 *
 * See google-apps-script/contact-endpoint.gs for the receiving end and its
 * deployment steps. The endpoint URL lives in VITE_SHEETS_ENDPOINT; it is a
 * public write-only URL, so it is safe in the client bundle.
 */

export interface ContactSubmission {
  name: string;
  email: string;
  company: string;
  message: string;
  /** Honeypot. Hidden from real users; a filled value marks the sender a bot. */
  website?: string;
}

const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT;

export async function submitContact(values: ContactSubmission): Promise<void> {
  if (!ENDPOINT) {
    throw new Error(
      'Form endpoint is not configured. Set VITE_SHEETS_ENDPOINT and rebuild.'
    );
  }

  const payload = JSON.stringify({
    ...values,
    source: typeof window === 'undefined' ? 'website' : window.location.href,
    userAgent: typeof navigator === 'undefined' ? '' : navigator.userAgent,
  });

  // text/plain, not application/json: it keeps this a CORS "simple request", so
  // the browser skips the preflight that Apps Script cannot answer. The script
  // parses the body itself, so the declared type is irrelevant to it.
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: payload,
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Submission failed (HTTP ${response.status}).`);
  }

  const result = (await response.json()) as { ok?: boolean; error?: string };
  if (!result.ok) {
    throw new Error(result.error || 'Submission was rejected.');
  }
}
