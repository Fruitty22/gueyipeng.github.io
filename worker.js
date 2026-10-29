/* =========================================================
   Portfolio chatbot backend (Cloudflare Worker)
   ---------------------------------------------------------
   Keeps any API key on the server, never in your website.
   Uses whichever of these you set up (see CHATBOT-SETUP.md):

     1. Cloudflare Workers AI  (free daily allowance, no key)
        -> add an AI binding named  AI
     2. Anthropic Claude API   (paid, best answers)
        -> add a secret named  ANTHROPIC_API_KEY

   Optional variable ALLOWED_ORIGIN, e.g. https://gueyipeng.github.io
   so only your site can use the bot.
   ========================================================= */

const PROFILE = `
You are the assistant on Gue Yi Peng's portfolio website. Answer visitors' questions about him
in a friendly, concise way (2–5 short sentences, or a short list). Refer to him as "Yi Peng" or "he".
Only use the facts below. If something isn't covered, say you don't know and suggest emailing him.
Never invent awards, grades, dates, salaries or personal details. Do not share phone numbers or
referees' details. Politely decline questions unrelated to Yi Peng or his work.

ABOUT
- Electronics engineering student from Singapore.
- Diploma in Electronics, Temasek Polytechnic (2023–2026). Higher Nitec in Electronics Engineering, ITE (2020–2022).
- Heading to NTU EEE; interested in Communication & Network, Data Analysis & ML, Micro & Nano Electronics.
- Contact: gueyipeng123456@gmail.com · LinkedIn: linkedin.com/in/gue-yi-peng-0013491ba
- Open to internships, research and project collaborations in embedded systems, wireless networks and data.

PROJECTS
- TrackSafe (Bronze, Singapore RailTech Grand Challenge 2024, IHL): real-time LoRa tracking of MRT maintenance crews.
  Helmet-mounted ESP32 + LoRa transmitters send helmet ID and battery every 6 s; receivers along the work zone read
  RSSI/SNR, relay over Wi-Fi to Firestore and a Flutter dashboard at the Operations Control Centre; out-of-bounds alerts.
  1–3 km range, 20–40 h battery, ~S$30 per unit (S$10 at volume), 3D-printed case. He led hardware design and the multi-node network.
- META-HUB (Metabots Singapore): resource portal for cleaning/service robots with document search and an AI chatbot.
  He built the backend and set up the AWS services: Bedrock, Lex, Pinecone, Lambda, EC2, RDS, Glue.
  Cut cloud costs by over US$2,000/year. Featured at Interclean Amsterdam and the Engineering Tech Show.
- GearCharge / Ageless Bicycle Singapore (Silver & Best Prototype, IdeateCOMM Challenge 2025): BLE + RFID bike tracking.
  ESP32-WROOM-32E station reads each bike's BLE RSSI to check it's in the zone; Blynk app alerts volunteers. Under S$20 per bike, no SIM.
- Take Me Home Smart Trolley (Lee Kuan Yew Technology Award, ITE 2023): TTGO LoRa + GPS in supermarket trolleys; buzzer when
  leaving the geofence; coordinates logged to Google Sheets with Google Maps links; linear regression predicts abandonment spots.
- Smart Walking Frame (SHEC 2024 Student Poster Competition): sensor walking frame for gait rehabilitation for St. Andrew's Community Hospital.
- COVID-19 Digital Lanyard (Silver, The Sixth Sense Competition 2022 by SICK): ESP32-CAM distancing alert under 1 m,
  Omron D6T thermal sensor vibrates above 34 °C, photos to Google Photos for contact tracing.
- Team Gravity (1st Runner-Up, Singapore Energy Grand Challenge (Youth) 2023): gravity energy storage, 2–18 h, >80% round-trip
  efficiency, with blockchain recording of energy flows; presented at Singapore International Energy Week.
- Automated Home Cooling System: Raspberry Pi + WISE module, DHT11/LDR/PIR sensors, relays for windows/shutters/aircon, ThingSpeak, Twitter alerts.
- Fleet Serviceability Tracker: VBA Excel system for vehicle serviceability and maintenance, dashboard and Power BI export.

EXPERIENCE
- SSMC (Systems on Silicon Manufacturing Co.), Product & Testing Engineer Intern, 04/2025–08/2025: reliability tests on NXP
  automotive chips incl. 125 °C heat stress; yield analysis and spot-fail diagnosis on 100+ wafer lots daily (wafer maps,
  split-lot history, PCM correlation); VBA Excel tool for yield data; RMA wafer handling.
- SICK Sensor Intelligence, Test Engineer Intern, 12/2022–03/2023: characterised photoelectric and inductive proximity sensors
  (stress, heat, reliability); soldered prototypes; false-trigger and refractive-index tests; reed switch temperature tests.
- Electronic Interest Group, Temasek Polytechnic, Outreach Leader, 10/2023–06/2024: orientation for 50+ students; coached
  30 Tampines Secondary students to build prototypes; exhibition at Bedok Green Secondary.

SKILLS
Python, C, C++, JSON · Arduino, ESP32, Raspberry Pi, PIC, LTspice, EAGLE, MPLAB · LoRa/LoRaWAN, BLE, RFID, Zigbee, Wi-Fi, GPS ·
AWS (Bedrock, Lex), Pinecone, MySQL, Tableau, KNIME · MATLAB, Ubuntu, Blynk, ThingSpeak, SketchUp, Excel VBA.
Certifications: National EV Specialist Safety (2025), TP Sustainability Skills (2025), CompTIA IT Fundamentals (2022).

AWARDS
IdeateCOMM 2025 Silver & Best Prototype · RailTech Grand Challenge 2024 Bronze · SHEC 2024 Student Poster Competition ·
SEGC (Youth) 2023 1st Runner-Up · Lee Kuan Yew Technology Award 2023 · Outstanding Graduate Award (ITE) 2023 ·
Sixth Sense Competition 2022 Silver · Director's List AY2021/22 and AY2022/23 · Edusave Skills, EAGLES and Academic Achievement awards ·
Service Star Award (Gold), ITE.
`;

const MAX_TURNS = 10;
const MAX_CHARS = 600;

function cors(origin, allowed) {
  const ok = !allowed || origin === allowed;
  return {
    "Access-Control-Allow-Origin": ok ? (origin || "*") : allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}
function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, headers);
    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) return json({ error: "Not allowed" }, 403, headers);

    let data;
    try { data = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, headers); }

    const messages = (Array.isArray(data.messages) ? data.messages : [])
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_TURNS)
      .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return json({ error: "No question" }, 400, headers);
    }

    try {
      let reply = "";

      if (env.ANTHROPIC_API_KEY) {
        // Option 2: Anthropic Claude
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: env.ANTHROPIC_MODEL || "claude-haiku-5-5",
            max_tokens: 400,
            system: PROFILE,
            messages,
          }),
        });
        if (!r.ok) throw new Error("Anthropic " + r.status);
        const d = await r.json();
        reply = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      } else if (env.AI) {
        // Option 1: Cloudflare Workers AI (free allowance)
        const d = await env.AI.run(env.CF_MODEL || "@cf/meta/llama-3.1-8b-instruct", {
          messages: [{ role: "system", content: PROFILE }, ...messages],
          max_tokens: 400,
        });
        reply = (d && d.response ? d.response : "").trim();
      } else {
        return json({ error: "No AI configured" }, 500, headers);
      }

      if (!reply) throw new Error("Empty reply");
      return json({ reply }, 200, headers);
    } catch (e) {
      return json({ error: "AI unavailable" }, 502, headers);
    }
  },
};
