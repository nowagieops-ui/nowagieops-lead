/* NowagieOps site settings. Edit this file only; no other code needs touching.
   Until formEndpoint is filled in, the email forms open the visitor's mail app as a fallback. */
window.NOWAGIE = {
  // Your booking page (Calendly, Cal.com, Google Calendar appointment page...). Leave "" to show the email box instead.
  bookingUrl: "",

  // The web-app URL from apps-script/Code.gs (see README, step 1). Looks like https://script.google.com/macros/s/XXXX/exec
  formEndpoint: "",

  // Where the fallback email goes, and what's shown in the footer.
  contactEmail: "hello@nowagieops.com",

  // The live address of the site (used in the plan email links).
  siteUrl: "https://nowagieops.com"
};
