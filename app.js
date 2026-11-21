(function () {
  "use strict";
  var CFG = window.NOWAGIE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- real work (Lucera, our own store) ---------- */
  var ADS = [
    { f: "abito", t: "Dress", s: "story" }, { f: "giacca-collage", t: "Jacket", s: "sq" },
    { f: "maglione", t: "Knitwear", s: "story" }, { f: "pullover-collage", t: "Pullover", s: "sq" },
    { f: "stivaletti", t: "Boots", s: "story" }, { f: "mocassini-collage", t: "Shoes", s: "sq" },
    { f: "gilet", t: "Co-ord set", s: "story" }, { f: "giubbotto", t: "Puffer jacket", s: "story" }
  ];
  var PAGES = [
    { f: "storbolt", u: "storbolt.com", t: "Storbolt" },
    { f: "felpa", u: "luceramoda.com/products/felpa-mezza-zip", t: "Half-zip knit" },
    { f: "trench", u: "luceramoda.com/products/trench-lungo", t: "Long trench" },
    { f: "completo", u: "luceramoda.com/products/completo-gilet", t: "Waistcoat set" },
    { f: "velluto", u: "luceramoda.com/products/giacca-velluto", t: "Corduroy jacket" },
    { f: "stivaletti", u: "luceramoda.com/products/stivaletti", t: "Heeled boots" }
  ];
  var EMAILS = [
    { f: "W1_welcome", d: "Welcome · Day 0" }, { f: "W3_welcome", d: "Welcome · Size guide" },
    { f: "R1_winback", d: "New arrivals" }, { f: "BF1_campaign", d: "Black Friday · Launch" },
    { f: "BF2_campaign", d: "Black Friday · Last hours" }, { f: "P1_postpurchase", d: "After purchase" }
  ];

  /* ---------- render marquees ---------- */
  function adCard(a) {
    return '<figure class="shot shot--' + a.s + '"><img src="assets/work/ads/' + a.f + '.jpg" alt="Lucera ad: ' + esc(a.t) + '"><figcaption>Ad · ' + esc(a.t) + '</figcaption></figure>';
  }
  function pageCard(p) {
    return '<figure class="lp"><div class="lp-bar"><i></i><i></i><i></i><em>' + esc(p.u) + '</em></div>' +
      '<img src="assets/work/pages/' + p.f + '.jpg" alt="Lucera product page: ' + esc(p.t) + '"></figure>';
  }
  function emailCard(e) {
    return '<figure class="em em--shot"><div class="em-day">' + esc(e.d) + '</div>' +
      '<div class="em-crop"><img src="assets/work/emails/' + e.f + '.jpg" alt="Lucera email: ' + esc(e.d) + '"></div></figure>';
  }
  function fill(id, arr, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    var html = arr.map(fn).join("");
    el.innerHTML = html + html.replace(/<figure /g, '<figure aria-hidden="true" ');
  }
  fill("ads", ADS, adCard);
  fill("pages", PAGES, pageCard);
  fill("emails", EMAILS, emailCard);

  /* ---------- reveal + arrows ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.2 }) : null;
  $$(".rv, .connector").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

  /* ---------- motion toggle ---------- */
  var mt = $("#motion"), flow = $("#flow");
  if (mt) mt.addEventListener("click", function () {
    var on = flow.classList.toggle("paused");
    mt.setAttribute("aria-pressed", on);
    mt.textContent = on ? "Resume the movement" : "Pause the movement";
  });

  /* ---------- modal / booking ---------- */
  var modal = $("#modal"), lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    var i = $("input[type=email]", modal); if (i) i.focus();
  }
  function closeModal() { modal.hidden = true; if (lastFocus) lastFocus.focus(); }
  $$("[data-book]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (CFG.bookingUrl) window.open(CFG.bookingUrl, "_blank", "noopener");
      else openModal();
    });
  });
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });
  $$("[data-plan-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var t = $("#plan"); t.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () { $("#email-plan").focus({ preventScroll: true }); }, 500);
    });
  });

  /* ---------- sticky mobile bar ---------- */
  var stick = $("#stick"), hero = $(".hero");
  if (stick && hero && io) {
    new IntersectionObserver(function (es) { stick.classList.toggle("show", !es[0].isIntersecting); }).observe(hero);
  }

  /* ---------- UTM capture ---------- */
  var utm = {};
  try {
    var q = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) { if (q.get(k)) utm[k] = q.get(k); });
  } catch (e) {}
  var loaded = Date.now();

  /* ---------- forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  $$("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var kind = f.getAttribute("data-form");
      var err = $(".err", f), btn = $("button[type=submit]", f);
      var email = f.elements.email.value.trim();
      err.textContent = "";
      if (!EMAIL_RE.test(email)) { err.textContent = "Please enter a valid email address."; f.elements.email.focus(); return; }
      if (f.elements.website.value) return; // honeypot: bots fill this
      if (Date.now() - loaded < 1500) { err.textContent = "One second, then try again."; return; }

      var done = function () {
        var ok = document.createElement("div");
        ok.className = "ok"; ok.setAttribute("role", "status");
        ok.innerHTML = kind === "growth-plan"
          ? "<b>Check your inbox.</b><span>Your growth plan is on its way. Can't see it in a minute? Look in spam or promotions. You can also <a href=\"growth-plan.html\">read it here now</a>.</span>"
          : "<b>Got it. Thank you.</b><span>We'll email you a few times to pick from, usually within one working day.</span>";
        f.replaceWith(ok);
      };

      if (!CFG.formEndpoint) { // fallback until the Apps Script is connected
        var subj = kind === "growth-plan" ? "Send me the free growth plan" : "Book my free 15-minute call";
        location.href = "mailto:" + (CFG.contactEmail || "") + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent("My email: " + email);
        return;
      }
      btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending…";
      var body = new URLSearchParams(Object.assign({ email: email, kind: kind, page: location.href, referrer: document.referrer || "" }, utm));
      fetch(CFG.formEndpoint, { method: "POST", body: body, mode: "no-cors" })
        .then(done)
        .catch(function () {
          btn.disabled = false; btn.textContent = label;
          err.textContent = "Something went wrong. Please try again or email " + (CFG.contactEmail || "us") + ".";
        });
    });
  });

  var c = $("#contact"); if (c && CFG.contactEmail) c.href = "mailto:" + CFG.contactEmail;
})();
