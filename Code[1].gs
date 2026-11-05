/**
 * Конференц-залы отеля «Казахстан» — связь сайта с Google Таблицей.
 *
 * Что делает этот скрипт:
 *  • setup()  — один раз создаёт листы «Календарь» и «Заявки» с выпадающими списками;
 *  • doGet    — отдаёт сайту календарь занятости;
 *  • doPost   — принимает заявку с сайта и записывает её в лист «Заявки» (+ письмо менеджеру);
 *  • onEdit   — когда менеджер меняет статус заявки, дата сама отмечается в календаре.
 */

/* ===== НАСТРОЙКА ===== */
// Почта, на которую приходят уведомления о новых заявках. Оставьте "" — писем не будет.
const NOTIFY_EMAIL = "";
/* ===================== */

const SHEET_CAL = "Календарь";
const SHEET_REQ = "Заявки";

// Названия залов в таблице ↔ коды на сайте. Менять названия можно только здесь и в выпадающих списках.
const HALLS = { "Grand Ballroom": "gb", "Grand Palace": "gp", "Алтын Емель": "ae", "Elegant Hall": "eh" };
// Статусы календаря: таблица → сайт. Если строки для даты нет — дата свободна.
const CAL_STATUS = { "Предварительная бронь": "hold", "Занято": "booked" };
const REQ_STATUSES = ["Новая", "Предв. бронь", "Подтверждена", "Отклонена"];

const REQ_HEADERS = ["Получена", "Статус", "Дата мероприятия", "Зал", "Гостей", "Состав", "Сумма, ₸",
                     "Контакт", "Компания", "Телефон", "Email", "Комментарий", "ID заявки"];
const COL = { status: 2, date: 3, hall: 4, id: 13 };

/* ---------- 1. Создание листов: запустите один раз ---------- */
function setup() {
  const ss = SpreadsheetApp.getActive();

  let cal = ss.getSheetByName(SHEET_CAL) || ss.insertSheet(SHEET_CAL);
  cal.getRange(1, 1, 1, 4).setValues([["Дата", "Зал", "Статус", "Комментарий"]]).setFontWeight("bold");
  cal.setFrozenRows(1);
  cal.getRange("A2:A").setNumberFormat("dd.mm.yyyy");
  cal.getRange("B2:B").setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(Object.keys(HALLS), true).setAllowInvalid(false).build());
  cal.getRange("C2:C").setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(Object.keys(CAL_STATUS), true).setAllowInvalid(false).build());
  cal.setColumnWidth(1, 110); cal.setColumnWidth(2, 150); cal.setColumnWidth(3, 190); cal.setColumnWidth(4, 260);
  cal.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Занято").setBackground("#F7E1E1")
      .setRanges([cal.getRange("C2:C")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Предварительная бронь").setBackground("#FBEFD9")
      .setRanges([cal.getRange("C2:C")]).build()
  ]);

  let req = ss.getSheetByName(SHEET_REQ) || ss.insertSheet(SHEET_REQ);
  req.getRange(1, 1, 1, REQ_HEADERS.length).setValues([REQ_HEADERS]).setFontWeight("bold");
  req.setFrozenRows(1);
  req.getRange("A2:A").setNumberFormat("dd.mm.yyyy hh:mm");
  req.getRange("C2:C").setNumberFormat("dd.mm.yyyy");
  req.getRange("G2:G").setNumberFormat("#,##0");
  req.getRange("B2:B").setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(REQ_STATUSES, true).setAllowInvalid(false).build());
  req.setColumnWidth(6, 320); req.setColumnWidth(12, 260);
  req.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Новая").setBackground("#F1E9DD").setBold(true)
      .setRanges([req.getRange("B2:B")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Подтверждена").setBackground("#E3F1EA")
      .setRanges([req.getRange("B2:B")]).build()
  ]);

  // убрать пустой лист по умолчанию
  ["Лист1", "Sheet1"].forEach(n => {
    const s = ss.getSheetByName(n);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
  ss.setActiveSheet(cal);
}

/* ---------- 2. Сайт запрашивает календарь ---------- */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "";
  if (action !== "calendar") return json({ ok: true, hint: "use ?action=calendar" });

  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET_CAL);
  if (!sh || sh.getLastRow() < 2) return json({ ok: true, rows: [] });

  const tz = ss.getSpreadsheetTimeZone();
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues()
    .map(([d, hall, status]) => ({ date: toIso(d, tz), hall: HALLS[String(hall).trim()], status: CAL_STATUS[String(status).trim()] }))
    .filter(r => r.date && r.hall && r.status);
  return json({ ok: true, rows: rows });
}

/* ---------- 3. Сайт отправляет заявку ---------- */
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: "bad_json" }); }
  if (d.hp) return json({ ok: true });                       // ловушка для ботов
  if (d.action !== "request") return json({ ok: false, error: "bad_action" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || "")) return json({ ok: false, error: "bad_date" });
  if (!d.name || String(d.phone || "").replace(/\D/g, "").length < 10) return json({ ok: false, error: "bad_contact" });
  const hallName = Object.keys(HALLS).find(n => HALLS[n] === d.hall);
  if (!hallName) return json({ ok: false, error: "bad_hall" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_REQ);
    const [y, m, day] = d.date.split("-").map(Number);
    sh.appendRow([
      new Date(), "Новая", new Date(y, m - 1, day), hallName, Number(d.guests) || "",
      safe(d.summary, 500), Number(d.total) || "", safe(d.name, 120), safe(d.company, 160),
      safe(d.phone, 40), safe(d.email, 120), safe(d.comment, 1000), safe(d.id, 40)
    ]);
  } finally { lock.releaseLock(); }

  if (NOTIFY_EMAIL) {
    try {
      MailApp.sendEmail(NOTIFY_EMAIL, `Новая заявка: ${hallName}, ${d.date.split("-").reverse().join(".")}`,
        [`Зал: ${hallName}`, `Дата: ${d.date.split("-").reverse().join(".")}`, `Гостей: ${d.guests}`,
         `Состав: ${d.summary}`, `Сумма: ${Number(d.total).toLocaleString("ru-RU")} ₸`,
         `Контакт: ${d.name}${d.company ? ", " + d.company : ""}`, `Телефон: ${d.phone}`,
         d.email ? `Email: ${d.email}` : "", d.comment ? `Комментарий: ${d.comment}` : "",
         "", `Таблица: ${SpreadsheetApp.getActive().getUrl()}`].filter(Boolean).join("\n"));
    } catch (err) { /* письмо не обязательно */ }
  }
  return json({ ok: true });
}

/* ---------- 4. Менеджер меняет статус заявки → календарь обновляется ---------- */
function onEdit(e) {
  const sh = e.range.getSheet();
  if (sh.getName() !== SHEET_REQ || e.range.getColumn() !== COL.status || e.range.getRow() < 2 || e.range.getNumRows() > 1) return;

  const row = sh.getRange(e.range.getRow(), 1, 1, REQ_HEADERS.length).getValues()[0];
  const status = String(row[COL.status - 1]), date = row[COL.date - 1], hall = String(row[COL.hall - 1]), id = String(row[COL.id - 1]);
  if (!(date instanceof Date) || !HALLS[hall]) return;

  const cal = e.source.getSheetByName(SHEET_CAL);
  const tz = e.source.getSpreadsheetTimeZone(), iso = toIso(date, tz);
  const n = Math.max(cal.getLastRow() - 1, 0);
  const data = n ? cal.getRange(2, 1, n, 4).getValues() : [];
  const idx = data.findIndex(r => toIso(r[0], tz) === iso && String(r[1]).trim() === hall);
  const note = "Заявка " + id;

  if (status === "Предв. бронь" || status === "Подтверждена") {
    const calStatus = status === "Подтверждена" ? "Занято" : "Предварительная бронь";
    if (idx >= 0) cal.getRange(idx + 2, 3, 1, 2).setValues([[calStatus, data[idx][3] || note]]);
    else cal.appendRow([date, hall, calStatus, note]);
  } else if (status === "Отклонена" || status === "Новая") {
    // снимаем отметку, только если её поставила эта же заявка
    if (idx >= 0 && String(data[idx][3]).indexOf(id) >= 0) cal.deleteRow(idx + 2);
  }
}

/* ---------- помощники ---------- */
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function toIso(v, tz) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, tz, "yyyy-MM-dd");
  const s = String(v || "").trim();
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return `${m[3]}-${("0" + m[2]).slice(-2)}-${("0" + m[1]).slice(-2)}`;
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? s : "";
}
// обрезает длину и не даёт тексту из формы стать формулой в таблице
function safe(v, max) {
  let s = String(v == null ? "" : v).slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
