(function () {
  "use strict";
  var CFG = window.NOWAGIE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- sample content (all made-up businesses) ---------- */
  var ADS = [
    { n: "Summit Roofing", loc: "Sponsored · Denver", t: "violet", h: "Leaking roof? Free quote today.", p: "Local, insured, 10-year guarantee.", cta: "Get quote", b: "Book an inspection" },
    { n: "Bright Smile Dental", loc: "Sponsored · Austin", t: "lime", h: "New patient? Your first check-up is free.", p: "Same-week appointments.", cta: "Book now", b: "Free first visit" },
    { n: "Fresh Nest Cleaning", loc: "Sponsored · Leeds", t: "paper", h: "Come home to a spotless house.", p: "Vetted cleaners. Fixed prices.", cta: "Get price", b: "Instant quote" },
    { n: "Iron Yard Gym", loc: "Sponsored · Tampa", t: "ink", h: "Try 7 days free. No contract.", p: "Coaches who actually know your name.", cta: "Claim pass", b: "7-day pass" },
    { n: "Maison Salon", loc: "Sponsored · Dublin", t: "mix", h: "Book your colour before Saturday.", p: "Only a few slots left this week.", cta: "Book slot", b: "Book online" },
    { n: "Gloss Auto Detailing", loc: "Sponsored · Phoenix", t: "sun", h: "Showroom shine, at your door.", p: "We come to you. Done in 3 hours.", cta: "Get price", b: "Mobile detailing" },
    { n: "Clarity Accounting", loc: "Sponsored · Toronto", t: "paper", h: "Stop dreading tax season.", p: "Flat monthly fee. Zero surprises.", cta: "Free call", b: "Talk to us" },
    { n: "Lena Frame Photography", loc: "Sponsored · Perth", t: "violet", h: "Family photos you'll actually frame.", p: "Limited spring dates.", cta: "See dates", b: "Check dates" }
  ];
  var PAGES = [
    { n: "Summit Roofing", u: "summitroofing.com/free-quote", h: "Get a free roof quote in 2 minutes.", p: "Local crew. Insured. Fixed price before we start.", f: "Your email", b: "Get my quote", pr: ["10-yr guarantee", "Free inspection"] },
    { n: "Bright Smile", u: "brightsmile.com/new-patient", h: "Your first check-up is on us.", p: "Pick a time that suits you. We'll handle the rest.", f: "Your email", b: "Book my visit", pr: ["Same-week slots", "Friendly team"] },
    { n: "Fresh Nest", u: "freshnest.co/price", h: "See your cleaning price instantly.", p: "Tell us your home size. No call needed.", f: "Your postcode", b: "Show my price", pr: ["Vetted cleaners", "Fixed prices"] },
    { n: "Iron Yard Gym", u: "ironyard.fit/trial", h: "Your 7-day pass is waiting.", p: "Try everything. No contract, no card.", f: "Your email", b: "Claim my pass", pr: ["No contract", "Coaches included"] },
    { n: "Maison Salon", u: "maisonsalon.ie/book", h: "Book your colour this week.", p: "See open slots and pick yours in 30 seconds.", f: "Your email", b: "See open slots", pr: ["Top stylists", "Easy rebooking"] },
    { n: "Gloss Detailing", u: "glossauto.com/mobile", h: "We bring the shine to you.", p: "Choose a package. We arrive at your door.", f: "Your phone", b: "Get my price", pr: ["Done in 3 hrs", "Fully insured"] }
  ];
  var EMAILS = [
    { d: "Day 0 · Right after they sign up", n: "Summit Roofing", s: "Your free quote is on its way", p: "Hi Sam, thanks for asking. Here's what happens next, and a quick way to pick a time for the inspection." },
    { d: "Day 1 · Gentle nudge", n: "Bright Smile", s: "Still want that free check-up?", p: "Hi Maya, we saved a spot for you this week. It takes one tap to confirm. No pressure at all." },
    { d: "Day 3 · Answer the doubts", n: "Fresh Nest", s: "Is cleaning really worth it? Honest answer", p: "Most people wonder the same. Here are 3 quick answers, plus what our cleaners do in your first visit." },
    { d: "Day 5 · Show proof", n: "Iron Yard Gym", s: "What Dan did in his first 7 days", p: "Dan was nervous too. Here's his week, and how you can start yours with your free pass." },
    { d: "Day 7 · Last call", n: "Maison Salon", s: "Your slot is about to be released", p: "Hi Ella, we hold slots for 7 days. If you still want yours, tap below and it's done." },
    { d: "After the job · Ask for a review", n: "Gloss Detailing", s: "How did we do?", p: "Thanks for choosing us, Tom. If you're happy, a quick review helps a lot. If not, tell us first." }
  ];

  /* ---------- render marquees ---------- */
  var ini = function (s) { return esc(s.trim().charAt(0)); };
  function adCard(a) {
    return '<article class="ad"><div class="ad-top"><span class="ad-av">' + ini(a.n) + '</span><div><b>' + esc(a.n) + '</b><small>' + esc(a.loc) + '</small></div></div>' +
      '<div class="ad-img t-' + a.t + '"><h4>' + esc(a.h) + '</h4><p>' + esc(a.p) + '</p></div>' +
      '<div class="ad-bot"><span>' + esc(a.b) + '</span><i>' + esc(a.cta) + '</i></div></article>';
  }
  function pageCard(p) {
    return '<article class="lp"><div class="lp-bar"><i></i><i></i><i></i><em>' + esc(p.u) + '</em></div>' +
      '<div class="lp-body"><div class="lp-nav"><b>' + esc(p.n) + '</b><i>Book now</i></div><h4>' + esc(p.h) + '</h4><p>' + esc(p.p) + '</p>' +
      '<div class="lp-form"><span>' + esc(p.f) + '</span><b>' + esc(p.b) + '</b></div>' +
      '<div class="lp-proof"><span>' + esc(p.pr[0]) + '</span><span>' + esc(p.pr[1]) + '</span></div></div></article>';
  }
  function emailCard(e) {
    return '<article class="em"><div class="em-day">' + esc(e.d) + '</div><div class="em-row"><span class="em-av">' + ini(e.n) + '</span>' +
      '<div class="em-meta"><b>' + esc(e.s) + '</b><small>' + esc(e.n) + '</small></div></div><p>' + esc(e.p) + '</p></article>';
  }
  function fill(id, arr, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    var html = arr.map(fn).join("");
    el.innerHTML = html + html.replace(/<article /g, '<article aria-hidden="true" ');
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
