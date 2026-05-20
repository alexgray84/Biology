/**
 * KS3 Energy quiz — Google Apps Script endpoint
 *
 * Setup
 * 1. Open the Google Sheet you want to capture results in (must live in the
 *    Arcadia workspace so data stays inside the school tenancy).
 * 2. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
 *    and paste it into SHEET_ID below.
 * 3. Set FORM_TOKEN to any random string. Paste the SAME string into the HTML
 *    quiz's FORM_TOKEN constant. The token is light anti-spam only; it is
 *    visible in client-side source. Real protection comes from the endpoint
 *    being write-only.
 * 4. Deploy: Deploy > New deployment > Web app.
 *      Description: KS3 energy quiz
 *      Execute as: Me (the Arcadia account)
 *      Who has access: Anyone
 *    Authorise when prompted.
 * 5. Copy the Web app URL ending in `/exec` and paste it into the HTML quiz's
 *    APPS_SCRIPT_URL constant.
 * 6. Test by completing the quiz on the live GitHub Pages URL and confirming a
 *    new row appears in the Sheet.
 *
 * Design notes
 * - Write-only by design. doGet returns a status string and never reads the
 *   Sheet, so the Anyone-access deployment cannot leak student data.
 * - The endpoint expects the body to be raw JSON sent as text/plain. That
 *   avoids the CORS preflight (OPTIONS) request that Apps Script cannot
 *   answer.
 */

const SHEET_ID   = '10ZvlOg9XxiRHJH7uYHqzT_YU4k8vnwMMYo8KDsg2PzM';
const SHEET_NAME = 'Responses';
const FORM_TOKEN = 'ks3-energy-7a3f9d2c';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.token !== FORM_TOKEN) {
      return jsonOut({ status: 'error', message: 'unauthorised' });
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Class', 'Total /30', 'Percent',
        'Tier 3-6', 'Tier 5-7',
        'Stores', 'Transfers', 'Resources', 'Efficiency', 'Power',
        'Responses JSON'
      ]);
    }

    sheet.appendRow([
      new Date(),
      data.name  || '',
      data.class || '',
      data.total,
      data.percent,
      data.byLevel['3-6'],
      data.byLevel['5-7'],
      data.byTopic.stores,
      data.byTopic.transfers,
      data.byTopic.resources,
      data.byTopic.efficiency,
      data.byTopic.power,
      JSON.stringify(data.responses)
    ]);

    return jsonOut({ status: 'ok' });
  } catch (err) {
    return jsonOut({ status: 'error', message: String(err) });
  }
}

function doGet() {
  // Health check only. Never reads or returns Sheet data.
  return jsonOut({ status: 'running' });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
