# Portfolio – notes and to-do

Keep this file on your computer. It isn't part of the website, so you don't need to upload it to GitHub.

## Done (3 Nov 2026)
- Contact form works through FormSubmit, and the email address is hidden from the page.
- SHEC is set to **2nd Place** everywhere: the badge, the awards list, and the chatbot.
- The slider is retitled **"How a LoRa node is made"** and labelled as an illustration, not a production board.
- Readability: brighter grey text and larger small labels, chips, badges and skill lists.

## Done (4 Nov 2026)
- Resume PDF (`resume.pdf`) with download buttons in the hero, top menu (Resume) and Contact section.
  The web copy hides your phone, email and referees' phone numbers ("References available on request").
- Skip button on the skills breakdown: the first press jumps to the full exploded view, the second continues to Awards.
- New photos: U3 GearCharge bench test, U4 trolley tracker on a real trolley.
- Smarter chatbot: comparisons, follow-ups, typos, recruiter questions, personal/off-topic handling.
- Optional AI fallback for unusual questions: `worker.js` + `CHATBOT-SETUP.md` (not switched on yet).

## To do later
1. **Hide the email from the code completely**: put the FormSubmit form ID into `var FORM_ID = '';` in `index.html`.
2. **Delete `activate-form.html`** from GitHub if it's still there.
3. **Switch on the AI chatbot** (optional): follow `CHATBOT-SETUP.md`, then paste the Worker address into `CHAT_API_URL` in `chatbot.js`.
4. **GitHub link**: make a clean showcase repo under your own account, with no keys and no company data, then add the link.
   Don't link Amrin99/METABOTS-TP. If it ever held keys, ask Amrin to make it private and rotate the keys.
5. **Add a real photo of yourself** near the top (the RailTech photo works well).
6. **Replace the U6 Digital Lanyard slide** with a hardware photo when you have one.
7. **Self-host the U5 and U8 images** in `images/`, so they don't depend on Google Drive sharing.
8. **Check the degree wording**: the site says "Next stop: NTU EEE", but the new resume is tailored to SIT (EEE / EDE / CE).

## Files that make up the site (upload to GitHub)
- `index.html`, `style.css`, `chatbot.js`, `fleet-logic-schematic.html`, `resume.pdf`
- the `images/` folder

## Files to keep on your computer only
- `PORTFOLIO-NOTES.md`, `worker.js` (pasted into Cloudflare), `CHATBOT-SETUP.md`
