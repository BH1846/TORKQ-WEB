/**
 * TorkQ contact-form endpoint — Google Apps Script Web App.
 *
 * Appends every contact-form submission to the TorkQ Responses spreadsheet.
 * The site is a static build with no server of its own, so this script is the
 * whole backend: the browser POSTs JSON here, and Apps Script writes the row
 * under the sheet owner's own authorisation. No API key or service-account
 * credential ever reaches the client.
 *
 * ── Deploy ───────────────────────────────────────────────────────────────────
 *  1. Open the spreadsheet you want the responses in → Extensions → Apps Script.
 *     Any spreadsheet works; the script writes to whichever one it is opened
 *     from, so switching sheets later means repeating these steps there, not
 *     editing this file.
 *  2. Replace the contents of Code.gs with this file, and Save.
 *  3. Run `setup` once and accept the authorisation prompt. It prints the
 *     spreadsheet name it will write to — check that it is the one you meant —
 *     and creates the "Responses" tab with its header row.
 *  4. Deploy → New deployment → type "Web app".
 *       Execute as:        Me
 *       Who has access:    Anyone            ← required; "Anyone with Google
 *                                              account" blocks anonymous
 *                                              visitors, which is everyone.
 *  5. Copy the /exec URL it hands back into the site's .env as
 *     VITE_SHEETS_ENDPOINT, then rebuild.
 *
 * Re-deploy note: editing this file does NOT update the live web app. Use
 * Deploy → Manage deployments → edit → Version: New version, which keeps the
 * same /exec URL so .env does not change.
 */

/**
 * Fallback only. When this script is opened from a spreadsheet's
 * Extensions → Apps Script menu it is bound to that spreadsheet and writes
 * there regardless of what this says — so pasting the file into a different
 * sheet needs no edit at all. SHEET_ID is used only by a standalone script
 * (script.google.com → New project), which has no spreadsheet of its own.
 */
var SHEET_ID = '14RkvAlqKbgzkTTW2YjM_F1TWEKcpKqQltNEgSTIN_vY';
var SHEET_NAME = 'Responses';
var HEADERS = ['Timestamp', 'Name', 'Work Email', 'Company', 'Message', 'Source', 'User Agent'];

/** Run once from the editor to create the tab and trigger the auth prompt. */
function setup() {
  var sheet = getSheet_();
  return (
    'Ready: writing to "' + sheet.getParent().getName() + '" → ' + sheet.getName() +
    ', ' + Math.max(0, sheet.getLastRow() - 1) + ' response(s) so far.'
  );
}

function getSheet_() {
  // Bound script → the spreadsheet it lives in. Standalone → SHEET_ID.
  var book = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID);
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(5, 420); // Message
  }
  return sheet;
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: a real browser leaves this hidden field empty, bots fill it.
    // Answer 200 so the bot sees success and does not retry, but write nothing.
    if (body.website) return json_({ ok: true });

    var name = String(body.name || '').trim();
    var email = String(body.email || '').trim();
    var message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return json_({ ok: false, error: 'Name, email and message are required.' });
    }

    // Serialise appends: two visitors submitting at once would otherwise both
    // read the same last row and one would overwrite the other.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      getSheet_().appendRow([
        new Date(),
        name.slice(0, 200),
        email.slice(0, 200),
        String(body.company || '').trim().slice(0, 200),
        message.slice(0, 5000),
        String(body.source || 'website').slice(0, 200),
        String(body.userAgent || '').slice(0, 500),
      ]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    // Surface the reason to the client but keep the row loss visible in the
    // Apps Script execution log too.
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

/** Browser health check: opening the /exec URL should print {"ok":true,...}. */
function doGet() {
  return json_({ ok: true, service: 'torkq-contact-endpoint' });
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
