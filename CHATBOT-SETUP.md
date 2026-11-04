# Chatbot: how it works and how to add AI

## How it works now (no setup)
The chatbot answers from the list of topics (`KB`) in `chatbot.js`, inside the visitor's browser. It now also handles:
- **Comparisons**: "Compare TrackSafe and GearCharge", "trolley or lanyard?"
- **Follow-ups**: "how much did it cost?" after asking about a project
- **Typos**: "trackseif" still finds TrackSafe
- **Recruiter questions**: why hire, strengths, weaknesses, availability, location, grades, future plans, resume, teamwork, this website
- **Personal questions** (salary, age, phone number…): politely redirects to the Contact form
- **Off-topic questions** (weather, jokes…): politely declines

## Optional: add AI for questions it can't answer
When the built-in answers have no match, the site can ask a free AI model instead.
It runs on **Cloudflare Workers**, a small free server, so no secret key ever sits inside your public website.

You need: a laptop, about 15 minutes, and the file `worker.js`.

### Step 1: Create a free Cloudflare account
1. Go to **https://dash.cloudflare.com/sign-up**.
2. Enter your email and a password, then click **Sign up**. No credit card is needed.
3. Open the email from Cloudflare and click the verification link.
4. If it asks you to "add a website" or "add a domain", click **Skip** or go back to the dashboard. You don't need one.

### Step 2: Create the Worker (your mini server)
1. In the left menu, click **Workers & Pages** (sometimes under **Compute**).
2. Click **Create**, then **Create Worker** (or "Start with Hello World").
3. Name it **`portfolio-chat`**.
4. Click **Deploy**. This creates a sample "Hello World" worker.

### Step 3: Put in your chatbot code
1. On the Worker's page, click **Edit code**.
2. Click inside the code editor, press **Ctrl + A** (select all), then **Delete**.
3. Open `worker.js` in Notepad, press **Ctrl + A** then **Ctrl + C** to copy it all.
4. Click back in the Cloudflare editor and press **Ctrl + V** to paste.
5. Click **Deploy** (top right).

### Step 4: Switch on the free AI
1. Go back to the Worker's page and open the **Settings** tab.
2. Find **Bindings**, then click **Add** (or **Add binding**).
3. Choose **Workers AI**.
4. In **Variable name**, type exactly **`AI`** (capital A, capital I).
5. Click **Add binding** / **Deploy**.

### Step 5: Lock it to your website only
1. Still in **Settings**, find **Variables and Secrets**, then click **Add**.
2. Set **Type** to **Text**.
3. Set **Variable name** to **`ALLOWED_ORIGIN`**.
4. Set **Value** to your site address: just `https://` plus the domain, with no slash at the end, e.g. `https://gueyipeng.github.io`.
5. Click **Deploy**.

### Step 6: Check it's alive
1. On the Worker's main page, copy its address, e.g. `https://portfolio-chat.yourname.workers.dev`.
2. Paste it into a new browser tab. You should see `{"error":"POST only"}`. That means it's working.

### Step 7: Connect your website
1. Open `chatbot.js`. Near the top, find:
   ```js
   var CHAT_API_URL = "";
   ```
2. Paste your Worker address between the quotes:
   ```js
   var CHAT_API_URL = "https://portfolio-chat.yourname.workers.dev";
   ```
3. Upload `chatbot.js` to GitHub and commit.

### Step 8: Test it
1. Open your site, press **Ctrl + Shift + R**, and click **Ask me**.
2. The chat header should say **"Answers from the site, AI for anything else"**.
3. Ask something unusual, e.g. *"Which of his projects would suit a power electronics role?"*

### If something goes wrong
| What you see | Fix |
|---|---|
| The bot only gives the "I'm not sure" reply | Check `ALLOWED_ORIGIN` matches your site address exactly (Step 5), with no slash at the end. |
| `{"error":"Workers AI binding 'AI' is missing"}` | Redo Step 4. The name must be exactly `AI`. |
| Nothing changes on the site | `CHAT_API_URL` isn't saved or uploaded (Step 7), or your browser is showing an old copy. Press Ctrl + Shift + R. |

### Keeping facts up to date
- **Built-in answers:** edit the `KB` list in `chatbot.js`.
- **AI answers:** edit the `PROFILE` text at the top of `worker.js`, then paste it into Cloudflare again (Step 3).

Cost: Workers AI has a free daily allowance that is far more than a portfolio needs.
