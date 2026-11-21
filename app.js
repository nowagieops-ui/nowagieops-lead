(function () {
  "use strict";
  var CFG = window.NOWAGIE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- real work (Lucera, our own store) ---------- */
  var ADS = [
    { f: "x-roofing-1", t: "Roofing" },
    { f: "x-dental-1", t: "Dental" },
    { f: "x-fitness-1", t: "Fitness" },
    { f: "x-cleaning-1", t: "Cleaning" },
    { f: "x-plumbing-1", t: "Plumbing" },
    { f: "giacca-collage", t: "Fashion · Lucera" },
    { f: "x-landscaping-1", t: "Landscaping" },
    { f: "x-salon-1", t: "Salon" },
    { f: "x-physio-1", t: "Physio" },
    { f: "x-roofing-2", t: "Roofing" },
    { f: "x-dental-2", t: "Dental" },
    { f: "x-fitness-2", t: "Fitness" },
    { f: "x-cleaning-2", t: "Cleaning" },
    { f: "x-plumbing-2", t: "Plumbing" },
    { f: "x-landscaping-2", t: "Landscaping" },
    { f: "x-salon-2", t: "Salon" },
    { f: "x-physio-2", t: "Physio" }
  ];
  var PAGES = [
    { f: "storbolt", u: "storbolt.com", t: "Storbolt" },
    { f: "x-roofing-1", u: "summitroofing.com", t: "Roofing" },
    { f: "x-dental-1", u: "brightsmile.com", t: "Dental" },
    { f: "x-fitness-1", u: "ironyard.fit", t: "Fitness" },
    { f: "x-cleaning-1", u: "freshnest.co", t: "Cleaning" },
    { f: "felpa", u: "luceramoda.com/products/felpa-mezza-zip", t: "Lucera" },
    { f: "x-plumbing-1", u: "flowline.co", t: "Plumbing" },
    { f: "x-landscaping-1", u: "greenleafgardens.com", t: "Landscaping" },
    { f: "x-salon-1", u: "maisonsalon.com", t: "Salon" },
    { f: "x-physio-1", u: "northsidephysio.com", t: "Physio" },
    { f: "x-roofing-2", u: "summitroofing.com", t: "Roofing" },
    { f: "x-dental-2", u: "brightsmile.com", t: "Dental" },
    { f: "x-fitness-2", u: "ironyard.fit", t: "Fitness" },
    { f: "x-cleaning-2", u: "freshnest.co", t: "Cleaning" },
    { f: "x-plumbing-2", u: "flowline.co", t: "Plumbing" },
    { f: "x-landscaping-2", u: "greenleafgardens.com", t: "Landscaping" },
    { f: "x-salon-2", u: "maisonsalon.com", t: "Salon" },
    { f: "x-physio-2", u: "northsidephysio.com", t: "Physio" }
  ];
  var EMAILS = [
    { f: "x-roofing-1", d: "Roofing" },
    { f: "x-dental-1", d: "Dental" },
    { f: "x-fitness-1", d: "Fitness" },
    { f: "W1_welcome", d: "Fashion · Lucera" },
    { f: "x-cleaning-1", d: "Cleaning" },
    { f: "x-plumbing-1", d: "Plumbing" },
    { f: "x-landscaping-1", d: "Landscaping" },
    { f: "x-salon-1", d: "Salon" },
    { f: "x-physio-1", d: "Physio" },
    { f: "x-roofing-2", d: "Roofing" },
    { f: "x-dental-2", d: "Dental" },
    { f: "x-fitness-2", d: "Fitness" },
    { f: "x-cleaning-2", d: "Cleaning" },
    { f: "x-plumbing-2", d: "Plumbing" },
    { f: "x-landscaping-2", d: "Landscaping" },
    { f: "x-salon-2", d: "Salon" },
    { f: "x-physio-2", d: "Physio" }
  ];

  /* ---------- render marquees ---------- */
  function adCard(a) {
    return '<figure class="shot shot--sq"><img src="assets/work/ads/' + a.f + '.jpg" alt="Lucera ad: ' + esc(a.t) + '"><figcaption>' + esc(a.t) + '</figcaption></figure>';
  }
  function pageCard(p) {
    return '<figure class="lp"><div class="lp-bar"><i></i><i></i><i></i><em>' + esc(p.u) + '</em></div>' +
      '<img src="assets/work/pages/' + p.f + '.jpg" alt="Lucera product page: ' + esc(p.t) + '"></figure>';
  }
  function emailCard(e) {
    return '<figure class="em em--shot"><div class="em-day">' + esc(e.d) + '</div>' +
      '<div class="em-crop"><img src="assets/work/emails/' + e.f + '.jpg" alt="Lucera email: ' + esc(e.d) + '"></div></figure>';
  }
  function fill(id, arr, fn, secs) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.setProperty("--dur", Math.round(arr.length * secs) + "s");
    var html = arr.map(fn).join("");
    el.innerHTML = html + html.replace(/<figure /g, '<figure aria-hidden="true" ');
  }
  fill("ads", ADS, adCard, 7);
  fill("pages", PAGES, pageCard, 11);
  fill("emails", EMAILS, emailCard, 8);

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
