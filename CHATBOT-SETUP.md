# Portfolio chatbot – setup

## It already works

Upload `chatbot.js` next to `index.html` and the chat button appears at the bottom right.
Out of the box it answers from the knowledge base inside `chatbot.js`, so it needs no
server, no account and no API key.

To change what it says, open `chatbot.js` and edit the `KB` list near the top. Each entry has:
- `keys`: words that trigger it
- `a`: the answer
- `link`: the section it jumps to

## Optional: switch on a real AI model

GitHub Pages can't keep secrets, so an AI key must never go in `chatbot.js`.
Instead, a tiny free Cloudflare Worker (`worker.js`) holds it and talks to the AI for you.

### 1. Create the Worker
1. Sign up at https://dash.cloudflare.com (free).
2. Go to **Workers & Pages → Create → Create Worker**, name it e.g. `portfolio-chat`, and click **Deploy**.
3. Click **Edit code**, delete everything, paste in the whole of `worker.js`, then click **Deploy**.

### 2. Give it an AI (pick one)

**A. Free: Cloudflare Workers AI**
- Worker → **Settings → Bindings → Add → Workers AI**, variable name `AI`, then **Deploy**.
- This uses Cloudflare's free daily allowance. No key or card is needed for light use.

**B. Best answers: Anthropic Claude (paid per use)**
- Get an API key at https://console.anthropic.com and add some credit.
- Worker → **Settings → Variables and Secrets → Add**, type **Secret**, name `ANTHROPIC_API_KEY`, then paste the key and **Deploy**.
- If both A and B are set up, the Worker uses Claude.

### 3. Lock it to your site
Worker → **Settings → Variables and Secrets → Add**, type **Text**, name `ALLOWED_ORIGIN`,
value `https://gueyipeng.github.io` (your exact site address, with no slash at the end), then **Deploy**.

### 4. Connect the website
1. Copy the Worker's URL, e.g. `https://portfolio-chat.yourname.workers.dev`.
2. In `chatbot.js`, set:
   ```js
   var CHAT_API_URL = "https://portfolio-chat.yourname.workers.dev";
   ```
3. Upload the new `chatbot.js` to GitHub and commit.

The chat header changes to "AI assistant". If the Worker is ever down or out of
allowance, the bot quietly falls back to the built-in answers.

### Keeping the AI's facts up to date
The AI only knows what is in the `PROFILE` text at the top of `worker.js`. When you add a
project, update it there and redeploy, and add a matching entry to `KB` in `chatbot.js`.
