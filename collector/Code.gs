/**
 * Response collector for the Music Listening Test.
 *
 * Setup (one time):
 *  1. Create a Google Sheet, then Extensions > Apps Script, and paste this file.
 *  2. Deploy > New deployment > type "Web app".
 *     Execute as: Me.  Who has access: Anyone.
 *  3. Copy the Web app URL into CONFIG.ENDPOINT in index.html.
 *
 * One row per participant session. The page autosaves after every answer, so
 * rows are updated in place (matched on sessionId) until status = "completed".
 */
const SHEET_NAME = 'responses';
const N_TRIALS = 20;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    const trialIds = [];
    for (let i = 1; i <= N_TRIALS; i++) trialIds.push('t' + String(i).padStart(2, '0'));
    const header = ['sessionId', 'status', 'participant', 'startedAt', 'submittedAt', 'elapsedMs',
                    'userAgent', 'order'].concat(trialIds)
                   .concat(trialIds.map(t => t + '_slots'), ['playCounts', 'lastUpdate']);
    if (sh.getLastRow() === 0) {
      sh.appendRow(header);
      sh.setFrozenRows(1);
    }

    const a = p.answers || {}, s = p.slots || {};
    const row = [p.sessionId, p.status, p.participant, p.startedAt, p.submittedAt, p.elapsedMs,
                 p.userAgent, p.order]
      .concat(trialIds.map(t => a[t] || ''))
      .concat(trialIds.map(t => s[t] || ''), [JSON.stringify(p.playCounts || {}), new Date().toISOString()]);

    // find an existing row for this session
    let target = -1;
    const last = sh.getLastRow();
    if (last > 1) {
      const ids = sh.getRange(2, 1, last - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) if (ids[i][0] === p.sessionId) { target = i + 2; break; }
    }
    // never let a late in-progress autosave overwrite a completed row
    if (target > 0 && p.status !== 'completed' && sh.getRange(target, 2).getValue() === 'completed') {
      return ContentService.createTextOutput('ok');
    }
    if (target > 0) sh.getRange(target, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return ContentService.createTextOutput('listening test collector is running'); }
