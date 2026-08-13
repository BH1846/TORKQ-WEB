/**
 * Date formatting for post metadata.
 *
 * Fixed to en-GB with an explicit UTC time zone rather than the visitor's
 * locale: the pages are pre-rendered, so a locale-dependent string would be
 * baked from the build machine's settings and then differ from what the client
 * renders on hydration — a mismatch React will complain about. Parsing the ISO
 * date as UTC also stops a yyyy-mm-dd from sliding to the previous day for
 * anyone west of Greenwich.
 */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
