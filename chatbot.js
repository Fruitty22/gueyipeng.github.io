/* =========================================================
   "Ask Yi Peng's portfolio" chatbot
   ---------------------------------------------------------
   Works straight away on GitHub Pages: answers come from the
   knowledge base below, matched in the visitor's browser.

   To switch on a real AI model, deploy worker.js (see
   CHATBOT-SETUP.md) and paste its URL into CHAT_API_URL.
   If the AI service is unreachable, the bot falls back to the
   built-in answers automatically.
   ========================================================= */
(function () {
  "use strict";

  var CHAT_API_URL = ""; // e.g. "https://portfolio-chat.yourname.workers.dev"

  /* ---------- Knowledge base: edit these to change answers ---------- */
  var KB = [
    {
      id: "about", link: "#top", label: "About me", generic: true,
      keys: ["who is", "who", "yourself", "introduce", "background", "student", "study", "studying", "education", "school", "diploma", "temasek", "polytechnic", "ite", "nitec", "ntu", "university", "degree", "eee", "yi peng", "gue"],
      a: "Gue Yi Peng is an electronics engineering student from Singapore. He holds a <b>Diploma in Electronics from Temasek Polytechnic</b> (2023–2026) and a <b>Higher Nitec in Electronics Engineering from ITE</b> (2020–2022). He's heading to <b>NTU EEE</b>, focusing on Communication &amp; Network, Data Analysis &amp; ML, and Micro &amp; Nano Electronics."
    },
    {
      id: "projects", link: "#projects", label: "All projects", generic: true,
      keys: ["projects", "project list", "what have you built", "built", "portfolio", "work", "show me", "examples", "list"],
      a: "Here are his main builds:<ul><li><b>TrackSafe</b> – LoRa safety tracking for MRT crews (Bronze, RailTech 2024)</li><li><b>META-HUB</b> – AWS + AI knowledge portal for Metabots</li><li><b>GearCharge</b> – BLE + RFID bike tracking (Silver &amp; Best Prototype, IdeateCOMM 2025)</li><li><b>Smart Trolley</b> – LoRa + GPS trolley tracker (Lee Kuan Yew Technology Award)</li><li><b>Smart Walking Frame</b> – gait rehab aid (SHEC 2024)</li><li><b>Digital Lanyard</b> – COVID-19 distancing wearable (Silver, Sixth Sense)</li><li><b>Team Gravity</b> – gravity energy storage (1st Runner-Up, SEGC 2023)</li><li>Plus a smart home cooling system and a fleet tracker</li></ul>Ask about any of them for details."
    },
    {
      id: "tracksafe", link: "#proj-tracksafe", label: "TrackSafe",
      keys: ["tracksafe", "track safe", "railtech", "rail tech", "rail", "mrt", "train", "track", "helmet", "occ", "control centre", "maintenance", "personnel", "crew", "smrt", "lta", "bustech"],
      a: "<b>TrackSafe</b> tracks MRT maintenance crews in real time. Each helmet carries an <b>ESP32 + LoRa</b> transmitter that sends its helmet ID and battery level every 6 seconds. Receivers along the work zone read the RSSI and SNR, relay the data over Wi-Fi to Firestore, and a Flutter dashboard at the Operations Control Centre shows every helmet live, with out-of-bounds alerts.<br><br>Range 1–3 km · 20–40 h battery · about S$30 per unit.<br>It won <b>Bronze at the Singapore RailTech Grand Challenge 2024</b>. Yi Peng led the hardware design and multi-node network."
    },
    {
      id: "metahub", link: "#proj-metahub", label: "META-HUB",
      keys: ["metahub", "meta hub", "meta-hub", "metabots", "aws", "amazon", "bedrock", "lex", "lambda", "ec2", "rds", "glue", "pinecone", "cloud", "backend", "chatbot", "ai portal", "knowledge platform", "interclean", "amsterdam", "rai"],
      a: "<b>META-HUB</b> is the resource portal for Metabots Singapore's cleaning and service robots, with product browsing, document search and an AI chatbot. Yi Peng built the <b>backend and set up the AWS services</b> from scratch: Bedrock and Lex for the chatbot, Pinecone for retrieval, and Lambda, EC2, RDS and Glue for services and data.<br><br>It cut cloud costs by <b>over US$2,000 a year</b> and was featured at <b>Interclean Amsterdam</b> and the Engineering Tech Show."
    },
    {
      id: "gearcharge", link: "#proj-gearcharge", label: "GearCharge",
      keys: ["gearcharge", "gear charge", "ageless", "bicycle", "bike", "bikes", "cycling", "ble", "bluetooth", "rfid", "blynk", "ideatecomm", "ideate", "seniors"],
      a: "<b>GearCharge</b> keeps track of bikes for Ageless Bicycle Singapore's community rides. Each bike has a BLE transmitter, and riders log in and out with RFID. An <b>ESP32-WROOM-32E</b> station reads every bike's signal strength to tell whether it's still in the zone, and the <b>Blynk</b> app alerts volunteers if a bike leaves or is moved without a login. It costs under S$20 per bike and needs no SIM card.<br><br>It won <b>Silver and Best Prototype at the IdeateCOMM Challenge 2025</b>."
    },
    {
      id: "trolley", link: "#proj-trolley", label: "Smart Trolley",
      keys: ["trolley", "trolleys", "shopping", "supermarket", "ntuc", "take me home", "gps", "geofence", "lee kuan yew", "lky", "ttgo", "google sheets", "regression"],
      a: "<b>Take Me Home · Smart Trolley</b> hides a TTGO LoRa board with GPS in each supermarket trolley. When a trolley leaves the geofence, a buzzer prompts the shopper to return it, and its coordinates go over LoRa into Google Sheets with a one-click Google Maps link. A linear-regression model predicts where trolleys get abandoned.<br><br>It won the <b>Lee Kuan Yew Technology Award</b> (ITE, 2023)."
    },
    {
      id: "walkingframe", link: "#proj-walkingframe", label: "Smart Walking Frame",
      keys: ["walking frame", "walker", "gait", "rehab", "rehabilitation", "shec", "healthcare", "hospital", "st andrew", "biomedical", "patient"],
      a: "The <b>Smart Walking Frame</b> is a sensor-equipped frame for gait rehabilitation, developed for St. Andrew's Community Hospital. It gives patients feedback so they can build consistent walking patterns and longer strides.<br><br>It placed at the <b>SHEC 2024 Student Poster Competition</b> (Singapore Healthcare Engineering Conference)."
    },
    {
      id: "lanyard", link: "#proj-lanyard", label: "Digital Lanyard",
      keys: ["lanyard", "covid", "covid-19", "distancing", "social distancing", "temperature", "fever", "thermal", "d6t", "esp32-cam", "esp32 cam", "camera", "sixth sense", "contact tracing"],
      a: "The <b>COVID-19 Digital Lanyard</b> is a hands-free wearable. Its <b>ESP32-CAM</b> uses on-board AI to flash an LED when two people are closer than 1 m, an <b>Omron D6T</b> thermal sensor vibrates above 34 °C, and photos of close contacts go to Google Photos for contact tracing.<br><br>It won <b>Silver at The Sixth Sense Competition 2022</b>, organised by SICK."
    },
    {
      id: "gravity", link: "#proj-gravity", label: "Team Gravity",
      keys: ["gravity", "energy", "energy storage", "grid", "smart grid", "segc", "siew", "blockchain", "renewable", "solar", "power", "ema", "energy market"],
      a: "<b>Team Gravity</b> designed a gravity energy storage system for Singapore's grid: surplus solar and wind power lifts heavy weights, and lowering them generates power again at peak demand, with 2–18 hours of storage at over 80% round-trip efficiency. A blockchain layer records energy flows from smart meters.<br><br>It was <b>1st Runner-Up at the Singapore Energy Grand Challenge (Youth) 2023</b>, presented at Singapore International Energy Week."
    },
    {
      id: "smarthome", link: "#proj-smarthome", label: "Home Cooling System",
      keys: ["smart home", "home", "cooling", "aircon", "raspberry pi", "zigbee", "wise", "thingspeak", "twitter", "automation", "dht11", "pir", "ldr"],
      a: "The <b>Automated Home Cooling System</b> uses a Raspberry Pi and a WISE module to read temperature, humidity, light and motion, then closes windows, lowers shutters and switches the aircon through relays. Data logs to ThingSpeak with Twitter alerts for remote monitoring."
    },
    {
      id: "fleet", link: "#proj-fleet", label: "Fleet Tracker",
      keys: ["fleet", "vehicle", "vehicles", "vba", "excel", "macro", "power bi", "powerbi", "serviceability", "dashboard"],
      a: "The <b>Fleet Serviceability Tracker</b> is a VBA-driven Excel system that tracks vehicle serviceability, maintenance and blocked vehicles across several commanders' sheets, with a dashboard that rolls up the stats and a Power BI export for reporting."
    },
    {
      id: "lora", link: "#proj-tracksafe", label: "LoRa projects",
      keys: ["lora", "lorawan", "long range", "sx1276", "radio", "wireless", "rf", "iot", "923", "915"],
      a: "LoRa runs through several of his projects:<ul><li><b>TrackSafe</b> – helmet-mounted LoRa nodes reporting to the OCC, 1–3 km range</li><li><b>Smart Trolley</b> – TTGO LoRa + GPS sending trolley locations with no SIM card</li><li><b>GearCharge</b> – BLE today, with LoRa planned for longer range</li></ul>He also works with BLE, RFID, Zigbee, Wi-Fi and GPS."
    },
    {
      id: "ssmc", link: "#job-ssmc", label: "SSMC internship",
      keys: ["ssmc", "semiconductor", "wafer", "wafers", "yield", "fab", "nxp", "tsmc", "chip", "chips", "automotive", "rma", "reliability", "pcm"],
      a: "At <b>SSMC</b> (Systems on Silicon Manufacturing Co., 04/2025 – 08/2025) Yi Peng was a <b>Product &amp; Testing Engineer intern</b>. He ran reliability tests on NXP automotive chips, including 125 °C heat stress, did yield analysis and spot-fail diagnosis on <b>100+ wafer lots a day</b>, validated yield data with a VBA Excel tool, and handled RMA wafers."
    },
    {
      id: "sick", link: "#job-sick", label: "SICK internship",
      keys: ["sick", "sensor intelligence", "sensors", "sensor", "photoelectric", "inductive", "proximity", "reed switch", "oscilloscope", "test engineer", "testing"],
      a: "At <b>SICK Sensor Intelligence</b> (12/2022 – 03/2023) Yi Peng was a <b>Test Engineer intern</b>. He characterised photoelectric and inductive proximity sensors through stress, heat and reliability testing, soldered prototypes for new sensor designs, tested false-trigger limits under extreme conditions, and ran temperature tests on reed switches."
    },
    {
      id: "experience", link: "#experience", label: "Experience", generic: true,
      keys: ["experience", "internship", "internships", "intern", "job", "jobs", "worked", "work experience", "company", "companies"],
      a: "He has two internships:<ul><li><b>SSMC</b> – Product &amp; Testing Engineer (2025): reliability testing and yield analysis on automotive chips</li><li><b>SICK Sensor Intelligence</b> – Test Engineer (2022–2023): sensor characterisation and prototype assembly</li></ul>He was also Outreach Leader of TP's Electronic Interest Group."
    },
    {
      id: "skills", link: "#skills", label: "Skills",
      keys: ["skills", "skill", "programming", "languages", "language", "python", "c++", "code", "coding", "tools", "software", "arduino", "esp32", "pic", "ltspice", "eagle", "mplab", "matlab", "tableau", "knime", "mysql", "stack", "tech"],
      a: "<b>Programming:</b> Python, C, C++, JSON<br><b>Embedded &amp; circuits:</b> Arduino, ESP32, Raspberry Pi, PIC, LTspice, EAGLE, MPLAB<br><b>Wireless:</b> LoRa/LoRaWAN, BLE, RFID, Zigbee, Wi-Fi, GPS<br><b>Data &amp; cloud:</b> AWS (Bedrock, Lex), Pinecone, MySQL, Tableau, KNIME<br><b>Platforms:</b> MATLAB, Ubuntu, Blynk, ThingSpeak, SketchUp, Excel VBA"
    },
    {
      id: "awards", link: "#awards", label: "Awards",
      keys: ["awards", "award", "achievements", "achievement", "won", "win", "prize", "prizes", "competition", "competitions", "medal", "trophy", "recognition"],
      a: "<ul><li>IdeateCOMM Challenge 2025 – <b>Silver &amp; Best Prototype</b></li><li>Singapore RailTech Grand Challenge 2024 – <b>Bronze</b></li><li>SHEC 2024 Student Poster Competition – placed</li><li>Singapore Energy Grand Challenge (Youth) 2023 – <b>1st Runner-Up</b></li><li><b>Lee Kuan Yew Technology Award</b> (ITE, 2023)</li><li><b>Outstanding Graduate Award</b> (ITE, 2023)</li><li>The Sixth Sense Competition 2022 – <b>Silver</b></li></ul>Also Director's List (AY2021/22, AY2022/23) and several Edusave awards."
    },
    {
      id: "certs", link: "#skills", label: "Certifications",
      keys: ["certification", "certifications", "certificate", "certified", "ev", "comptia", "sustainability"],
      a: "Certifications: <b>National EV Specialist Safety Certificate</b> (2025), <b>TP Sustainability Skills Certification</b> (2025) and <b>CompTIA IT Fundamentals</b> (2022)."
    },
    {
      id: "cca", link: "#experience", label: "Leadership",
      keys: ["cca", "leadership", "leader", "lead", "interest group", "outreach", "teach", "teaching", "coach", "mentor", "volunteer", "tampines", "bedok"],
      a: "As <b>Outreach Leader of TP's Electronic Interest Group</b> (2023–2024) he ran orientation for 50+ Year 1 students, coached 30 Tampines Secondary students to build a prototype from scratch (soldering, 3D printing and coding), and set up an exhibition at Bedok Green Secondary. He also led the teams on TrackSafe, GearCharge and the Smart Trolley."
    },
    {
      id: "contact", link: "#contact", label: "Contact",
      keys: ["contact", "email", "e-mail", "mail", "reach", "hire", "hiring", "recruit", "available", "availability", "opportunity", "opportunities", "linkedin", "connect", "resume", "cv", "talk"],
      a: "He's open to internships, research and project collaborations in embedded systems, wireless networks and data.<br><br>Email: <b>gueyipeng123456@gmail.com</b><br>LinkedIn: <a href=\"https://linkedin.com/in/gue-yi-peng-0013491ba\" target=\"_blank\" rel=\"noopener\">gue-yi-peng-0013491ba</a>"
    },
    {
      id: "best", link: "#proj-tracksafe", label: "Highlights",
      keys: ["best", "favourite", "favorite", "proudest", "proud", "biggest", "most impressive", "highlight", "highlights", "strongest"],
      a: "Two stand out: <b>TrackSafe</b>, a full LoRa network from helmet hardware to the control-room dashboard that won Bronze at RailTech 2024, and <b>META-HUB</b>, an AWS + AI backend for a real company that saved over US$2,000 a year and went to Interclean Amsterdam."
    }
  ];

  var GREETING = "Hi! I'm the portfolio assistant. Ask me about Yi Peng's projects, internships, skills or awards.";
  var FALLBACK = "I'm not sure about that one. Try asking about a project (like TrackSafe or META-HUB), his internships, skills or awards. You can also email Yi Peng at <b>gueyipeng123456@gmail.com</b>.";
  var SUGGEST = ["What projects has he built?", "Tell me about TrackSafe", "What did he do at SSMC?", "Which projects use LoRa?", "How can I contact him?"];

  /* ---------- local answer engine ---------- */
  function norm(t) { return " " + t.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9+#\-. ]+/g, " ").replace(/\s+/g, " ").trim() + " "; }
  function localAnswer(q) {
    var n = norm(q).replace(/ (tell me|can you tell me|what about|tell us) (about )?/g, " ");
    if (/^ (hi|hello|hey|yo|hiya|good (morning|afternoon|evening))[ !.]*$/.test(n)) return { a: "Hello! What would you like to know about Yi Peng's work?" };
    if (/ (thanks|thank you|thx|ty) /.test(n)) return { a: "You're welcome! Anything else you'd like to know?" };
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var sc = 0;
      e.keys.forEach(function (k) {
        var kk = " " + k + " ";
        if (n.indexOf(kk) !== -1) sc += 2 + k.split(" ").length;
        else if (k.length > 4 && n.indexOf(k) !== -1) sc += 1.5;
      });
      if (e.generic) sc *= 0.45; // broad topics only win when nothing specific matches
      if (sc > bestScore) { bestScore = sc; best = e; }
    });
    return bestScore >= 0.9 ? best : null;
  }

  /* ---------- UI ---------- */
  var root = document.createElement("div");
  root.className = "cb";
  root.innerHTML =
    '<button type="button" class="cb-fab" id="cb-fab" aria-expanded="false" aria-controls="cb-panel" aria-label="Ask about my projects">' +
      '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="12" width="28" height="22" rx="4" fill="#1a1b1e" stroke="currentColor" stroke-width="2.4"/>' +
      '<path d="M14 12V7M24 12V7M34 12V7M14 34v5M24 34v5M34 34v5M10 18H5M10 28H5M38 18h5M38 28h5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="19" cy="23" r="2.6" fill="#5ee6cf"/><circle cx="29" cy="23" r="2.6" fill="#5ee6cf"/></svg>' +
      '<span class="cb-fab-label">Ask me</span><span class="cb-ping" aria-hidden="true"></span>' +
    '</button>' +
    '<section class="cb-panel" id="cb-panel" role="dialog" aria-label="Portfolio assistant" hidden>' +
      '<header class="cb-head"><span class="cb-led" aria-hidden="true"></span><div><p class="cb-title">Portfolio assistant</p>' +
      '<p class="cb-sub" id="cb-mode">Ask about projects, internships and skills</p></div>' +
      '<button type="button" class="cb-x" id="cb-x" aria-label="Close chat">✕</button></header>' +
      '<div class="cb-log" id="cb-log" aria-live="polite"></div>' +
      '<div class="cb-chips" id="cb-chips"></div>' +
      '<form class="cb-form" id="cb-form" autocomplete="off">' +
        '<label class="sr-only" for="cb-in">Your question</label>' +
        '<input id="cb-in" class="cb-in" type="text" maxlength="400" placeholder="Ask about a project…">' +
        '<button class="cb-send" type="submit" aria-label="Send">TX</button>' +
      '</form>' +
    '</section>';
  document.body.appendChild(root);

  var fab = root.querySelector("#cb-fab"), panel = root.querySelector("#cb-panel"),
      log = root.querySelector("#cb-log"), chips = root.querySelector("#cb-chips"),
      form = root.querySelector("#cb-form"), input = root.querySelector("#cb-in"),
      xbtn = root.querySelector("#cb-x");
  var history = [], started = false, busy = false;

  function scrollDown() { log.scrollTop = log.scrollHeight; }
  function addMsg(who, html, link) {
    var m = document.createElement("div");
    m.className = "cb-msg cb-" + who;
    if (who === "user") m.textContent = html; else m.innerHTML = html;
    if (link) {
      var a = document.createElement("a");
      a.className = "cb-jump"; a.href = link.href; a.textContent = "Go to " + link.label + " →";
      a.addEventListener("click", function () { if (window.innerWidth < 640) close(); });
      m.appendChild(a);
    }
    log.appendChild(m);
    // long answers: show their start, not their end
    if (who === "bot") log.scrollTop = Math.max(0, m.offsetTop - log.offsetTop - 12);
    else scrollDown();
    return m;
  }
  function typing() {
    var t = document.createElement("div");
    t.className = "cb-msg cb-bot cb-typing"; t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t); scrollDown(); return t;
  }
  function renderChips(list) {
    chips.innerHTML = "";
    list.forEach(function (q) {
      var b = document.createElement("button"); b.type = "button"; b.className = "cb-chip"; b.textContent = q;
      b.addEventListener("click", function () { ask(q); });
      chips.appendChild(b);
    });
  }
  function open() {
    panel.hidden = false; fab.setAttribute("aria-expanded", "true"); root.classList.add("is-open");
    if (!started) { started = true; addMsg("bot", GREETING); renderChips(SUGGEST); }
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() { panel.hidden = true; fab.setAttribute("aria-expanded", "false"); root.classList.remove("is-open"); fab.focus(); }
  fab.addEventListener("click", function () { panel.hidden ? open() : close(); });
  xbtn.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(); });

  function mdLite(t) { // safe formatting for AI replies
    var esc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  }
  function linkFor(text) { var hit = localAnswer(text); return hit && hit.link ? { href: hit.link, label: hit.label } : null; }

  function ask(q) {
    q = (q || "").trim(); if (!q || busy) return;
    busy = true; addMsg("user", q); input.value = ""; chips.innerHTML = "";
    var t = typing();
    function finish(html, link) {
      setTimeout(function () {
        t.remove(); addMsg("bot", html, link); busy = false;
        var follow = SUGGEST.filter(function (s) { return s !== q; }).slice(0, 3);
        renderChips(follow);
      }, 450);
    }
    function useLocal() {
      var hit = localAnswer(q);
      finish(hit ? hit.a : FALLBACK, hit && hit.link ? { href: hit.link, label: hit.label } : null);
    }
    if (!CHAT_API_URL) { useLocal(); return; }
    history.push({ role: "user", content: q });
    fetch(CHAT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-10) }) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        if (!d || !d.reply) throw new Error("empty");
        history.push({ role: "assistant", content: d.reply });
        finish(mdLite(d.reply), linkFor(q + " " + d.reply));
      })
      .catch(function () { history.pop(); useLocal(); });
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });

  if (CHAT_API_URL) root.querySelector("#cb-mode").textContent = "AI assistant · answers may be imperfect";

  // gentle nudge a few seconds after load, once per visit
  setTimeout(function () { if (panel.hidden) fab.classList.add("cb-nudge"); }, 4000);
})();
