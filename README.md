# NowagieOps site

Static site (no build step). Upload the contents of this folder to Hostinger `public_html`.

## 1. Collect leads (Google Sheet)
1. Create a Google Sheet, open Extensions > Apps Script, paste `apps-script/Code.gs`.
2. Set `OWNER_EMAIL` at the top. Deploy > New deployment > Web app > Execute as **Me**, Access **Anyone**.
3. Copy the `/exec` URL into `config.js` as `formEndpoint`.

## 2. Booking link
Create a free Calendly or Cal.com 15-minute event and put its URL in `config.js` as `bookingUrl`. Until then the "Book" buttons show an email box.

## 3. Push to GitHub (run in your own terminal; never paste a token in chat)
```
git remote add origin https://github.com/<you>/nowagieops.git
git branch -M main
git push -u origin main
```
## 4. Test before ads
Submit both forms with your own email; check the Sheet row, the owner email, the plan email, and the mobile layout.
