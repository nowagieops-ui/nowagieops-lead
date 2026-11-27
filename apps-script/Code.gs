/**
 * NowagieOps lead capture. Paste into script.google.com (bound to a Google Sheet),
 * then Deploy > New deployment > Web app > Execute as: Me, Access: Anyone.
 * Put the /exec URL in config.js as formEndpoint.
 */
var OWNER_EMAIL = "hello@nowagieops.com";            // gets a notification per lead
var SITE_URL = "https://nowagieops.com";
var SHEET_NAME = "Leads";
var MAX_PER_HOUR = 60;                               // simple flood guard

function doGet() {
  return ContentService.createTextOutput("ok");
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var email = String(p.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return out("bad");
  if (p.website) return out("ok"); // honeypot

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var cache = CacheService.getScriptCache();
    var n = Number(cache.get("hits") || 0);
    if (n >= MAX_PER_HOUR) return out("busy");
    cache.put("hits", String(n + 1), 3600);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Time", "Email", "Type", "Source", "Medium", "Campaign", "Page", "Referrer"]);
    }
    sh.appendRow([new Date(), email, p.kind || "", p.utm_source || "", p.utm_medium || "", p.utm_campaign || "", p.page || "", p.referrer || ""]);
  } finally {
    lock.releaseLock();
  }

  try {
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: "New lead: " + email + " (" + (p.kind || "?") + ")",
      body: "Email: " + email + "\nType: " + (p.kind || "") + "\nSource: " + (p.utm_source || "direct")
    });
    if (p.kind === "step3") {
      MailApp.sendEmail({
        to: email,
        name: "NowagieOps",
        replyTo: OWNER_EMAIL,
        subject: "This email is step 3",
        htmlBody: "<p>Hi,</p><p>You just went through all three steps:</p>" +
          "<ol><li>Something brought you to our site.</li><li>You landed on a web page built to get one thing done.</li><li>You gave us your email, and this email is what arrived.</li></ol>" +
          "<p>That is what we make for local businesses: ads that bring in the right people, a web page that gets their details, and follow-up emails that bring them back.</p>" +
          "<p><a href=\"" + SITE_URL + "/#start\">Book a free 15-minute call</a> and we'll show you how it would work for your business, or read the free plan: " +
          "<a href=\"" + SITE_URL + "/growth-plan.html\">" + SITE_URL + "/growth-plan.html</a></p>" +
          "<p>Reply to this email any time.<br>NowagieOps</p>"
      });
    } else if (p.kind === "growth-plan") {
      MailApp.sendEmail({
        to: email,
        name: "NowagieOps",
        replyTo: OWNER_EMAIL,
        subject: "Your free plan to get more customers",
        htmlBody: "<p>Hi,</p><p>Here is your free plan:</p>" +
          "<p><a href=\"" + SITE_URL + "/growth-plan.html\">Open the plan</a></p>" +
          "<p>If you'd like us to go through it with you, book a free 15-minute call: " + SITE_URL + "</p>" +
          "<p>Reply to this email any time.<br>NowagieOps</p>"
      });
    } else {
      MailApp.sendEmail({
        to: email,
        name: "NowagieOps",
        replyTo: OWNER_EMAIL,
        subject: "Let's find a time for your free call",
        body: "Thanks for asking for a call. We'll reply shortly with a few times that suit you.\n\nNowagieOps"
      });
    }
  } catch (err) { /* lead is already saved; ignore mail quota errors */ }
  return out("ok");
}

function out(s) { return ContentService.createTextOutput(s); }
