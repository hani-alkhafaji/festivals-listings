/**
 * European Festival Listings — Google Sheets
 *
 * TAB "Festival Requests" (submissions from website):
 * Row 1 headers:
 * Timestamp | Festival Name | City | Address | Date Start | Date End | Time Start | Time End |
 * Email | Instagram | Image URL | Description | Status | Listing Fee
 *
 * TAB "Published Festivals" (live events on website):
 * Row 1 headers:
 * id | title | city | address | dateStart | dateEnd | timeStart | timeEnd | sortDate |
 * image | descriptionShort | descriptionLong | instagramUrl
 *
 * Deploy: Web app → Execute as Me → Anyone → copy URL to Vercel GAS_WEB_APP_URL
 */

var REQUESTS_SHEET = 'Festival Requests';
var PUBLISHED_SHEET = 'Published Festivals';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.type === 'festival_request') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REQUESTS_SHEET);
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
        data.listingFeeEur || 49
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
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PUBLISHED_SHEET);
      if (!sheet) throw new Error('Missing tab: ' + PUBLISHED_SHEET);
      var values = sheet.getDataRange().getValues();
      if (values.length < 2) return jsonOut({ ok: true, festivals: [] });
      var headers = values[0].map(function (h) { return String(h).trim(); });
      var festivals = [];
      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        if (!row[0] && !row[1]) continue;
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
