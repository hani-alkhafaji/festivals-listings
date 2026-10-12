/**
 * European Festival Listings — Google Sheets
 *
 * IMPORTANT:
 * 1. Open Apps Script FROM the sheet: Extensions → Apps Script (bound project).
 *    OR set SPREADSHEET_ID below (from sheet URL).
 * 2. Deploy → Web app → Anyone → copy URL ending in /exec to Vercel GAS_WEB_APP_URL
 *    Do NOT paste this code into Vercel — only the https://script.google.com/.../exec URL.
 */

var REQUESTS_SHEET = 'Festival Requests';
var PUBLISHED_SHEET = 'Published Festivals';

/** Optional: paste Sheet ID if script is not opened from the sheet */
var SPREADSHEET_ID = '';

function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'No spreadsheet linked. Use Extensions → Apps Script from your Google Sheet, or set SPREADSHEET_ID in Code.gs'
    );
  }
  return ss;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('POST body missing. Use the deployed Web App URL ending in /exec');
    }
    var data = JSON.parse(e.postData.contents);
    if (data.type === 'festival_request') {
      var sheet = getSpreadsheet().getSheetByName(REQUESTS_SHEET);
      if (!sheet) throw new Error('Missing tab: ' + REQUESTS_SHEET);
      sheet.appendRow([
        data.timestamp || new Date(),
        data.festivalName,
        data.city,
        data.address,
        data.dateStart,
        data.dateEnd,
        data.timeStart,
        data.timeEnd,
        data.email,
        data.instagramUrl || '',
        data.imageUrl || '',
        data.description,
        data.status || 'NEW',
        data.listingFeeEur || 49,
        data.ticketPrice || ''
      ]);
      return jsonOut({ ok: true });
    }
    throw new Error('Unknown type');
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  if (action === 'festivals') {
    try {
      var sheet = getSpreadsheet().getSheetByName(PUBLISHED_SHEET);
      if (!sheet) throw new Error('Missing tab: ' + PUBLISHED_SHEET);
      var values = sheet.getDataRange().getValues();
      if (values.length < 2) return jsonOut({ ok: true, festivals: [] });
      var headers = values[0].map(function (h) { return String(h).trim(); });
      var festivals = [];
      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        var hasAny = false;
        for (var j = 0; j < row.length; j++) {
          if (String(row[j]).trim() !== '') {
            hasAny = true;
            break;
          }
        }
        if (!hasAny) continue;
        var obj = {};
        for (var c = 0; c < headers.length; c++) {
          var key = headers[c];
          if (key) obj[key] = row[c];
        }
        festivals.push(obj);
      }
      festivals.sort(function (a, b) {
        var da = String(a.sortDate || '9999-12-31');
        var db = String(b.sortDate || '9999-12-31');
        return da.localeCompare(db);
      });
      return jsonOut({ ok: true, festivals: festivals });
    } catch (err) {
      return jsonOut({ ok: false, error: String(err) });
    }
  }
  return ContentService.createTextOutput('Use POST for requests or GET ?action=festivals')
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
