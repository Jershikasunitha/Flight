import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback intelligent responder when API key is not configured or in case of rate limit
function generateContextualVyraReply(message: string, tripState: any): string {
  const q = (message || "").toLowerCase();
  const hub = tripState?.activeHub || "SIN";
  const hubName = hub === "SIN" ? "Singapore Changi (SIN)" : hub === "DXB" ? "Dubai International (DXB)" : "Doha Hamad (DOH)";
  const isDisrupted = !!tripState?.disruption?.active || !!tripState?.disruption;
  const disruptionTitle = tripState?.disruption?.title || "None";
  const delay = tripState?.disruption?.delayMinutes || 0;
  const buffer = tripState?.connectionBufferMinutes ?? 135;
  const riskLevel = tripState?.decision?.riskLevel || "LOW";
  const riskScore = tripState?.decision?.riskScore ?? 12;
  const confidence = tripState?.execution?.confidence ?? 96;
  const action = tripState?.execution?.action || "Proceed on scheduled itinerary";

  const historical = tripState?.historicalData;
  const decisionLogs = tripState?.decisionLogs || [];
  const plannerLog = decisionLogs.find((l: any) => l.agentName === "Planner Agent" || l.id?.includes("PLN"));
  const decisionLog = decisionLogs.find((l: any) => l.agentName === "Decision Agent" || l.id?.includes("DEC"));

  // 1. "Why" questions targeting Planner decisions & corridor selection
  if (
    q.includes("why") || 
    q.includes("reason") || 
    q.includes("rationale") || 
    q.includes("chose") || 
    q.includes("choose") || 
    q.includes("selected") || 
    q.includes("planner") || 
    q.includes("reject") ||
    q.includes("criteria")
  ) {
    if (q.includes("dubai") || q.includes("dxb")) {
      return `The VOYA Planner Agent rejected Dubai (DXB / Emirates EK002 & EK414) due to a hazardous 45-minute curfew cushion. EK414 arrives in Sydney at 22:15 +1, just 45 minutes before Sydney's mandatory 23:00 curfew. Historical flight telemetry records an average 28.5-minute delay on the DXB corridor with 84.1% OTP. Any moderate delay triggers an automatic, costly diversion to Melbourne or Brisbane. Hence, Singapore (325m curfew margin) and Doha (200m margin) scored significantly higher.`;
    }

    if (q.includes("doha") || q.includes("qatar") || q.includes("qr") || q.includes("backup") || q.includes("contingency")) {
      return `The Planner and Decision Agents selected Doha (Hamad International / Qatar Airways QR004 & QR908) as the premier contingency route because:
1. Industry-Leading Reliability: 94.2% historical on-time arrival rate with an average en-route delay of only 8.8 minutes.
2. Curfew Protection: Landing at 19:40 +1 provides a comfortable 200-minute (3h 20m) buffer before Sydney's 23:00 curfew.
3. Traveler Preference: Guarantees Elena's VIP Tier 1 preference with a confirmed solo Qsuite (Seat 2K) and Oneworld Emerald reciprocity at Al Safwa First Lounge.`;
    }

    if (q.includes("singapore") || q.includes("sin") || hub === "SIN") {
      return `The Planner Agent selected Singapore Airlines via Changi (SQ305 & SQ231) with a 94/100 multi-criteria score based on:
1. Curfew Safeguard: Scheduled Sydney arrival at 17:35 +1 leaves a massive 325-minute (5h 25m) safety margin before the 23:00 curfew.
2. Historical On-Time Performance: 91.4% OTP with a 1.8% misconnect rate across the LHR-SIN corridor.
3. Buffer Safety: Scheduled layover of 135 minutes exceeds Changi's 45-minute MCT by 90 minutes.
4. Passenger Alignment: Matches Elena's KrisFlyer Solitaire status for A350-900 / A380-800 First Class Suites.`;
    }

    return `The VOYA Planner Agent evaluated 3 candidate corridors across 7 operational criteria (Historical OTP, Sydney Curfew Buffer, Cabin Hardware, Minimum Connection Time, Alliance Reciprocity, Baggage Integrity, and Weather Outlook). Singapore scored 94/100 and Doha scored 92/100, while Dubai scored 71/100 due to its narrow 45-minute curfew window. When disruptions breach connection thresholds, the Decision Agent automatically routes traffic to the highest-scoring alternative.`;
  }

  // 2. Questions about Historical Flight Data & On-Time Performance (OTP)
  if (
    q.includes("historical") || 
    q.includes("history") || 
    q.includes("otp") || 
    q.includes("on-time") || 
    q.includes("performance") || 
    q.includes("past") || 
    q.includes("stat")
  ) {
    return `Historical Flight Telemetry Benchmark:
• Singapore (SQ305/SQ231): 91.4% OTP, 11.2m avg delay, 1.8% misconnect rate, 325m curfew margin. Terminal transit avg: 14 mins.
• Doha (QR004/QR908): 94.2% OTP, 8.8m avg delay, 1.1% misconnect rate, 200m curfew margin. Terminal transit avg: 18 mins.
• Dubai (EK002/EK414): 84.1% OTP, 28.5m avg delay, 4.6% misconnect rate, 45m curfew margin. Terminal transit avg: 32 mins.
Elena's personal record: 8 past corridor flights, 98.2% successful connection rate, with 0 misconnects in Singapore or Doha.`;
  }

  // 3. Questions about previous Agent Decision Logs & Audit Trail
  if (
    q.includes("log") || 
    q.includes("audit") || 
    q.includes("previous decision") || 
    q.includes("trail") || 
    q.includes("tree") || 
    q.includes("step")
  ) {
    if (decisionLogs.length > 0) {
      const logsSummary = decisionLogs.slice(0, 3).map((l: any) => `• [${l.agentName} | ${l.timestamp}]: ${l.action} — Rationale: ${l.primaryRationale.slice(0, 140)}...`).join("\n");
      return `Previous VOYA Agent Decision Audit Trail:\n${logsSummary}`;
    }
    return `The VOYA Agent Audit Trail logs all operations:
• Planner Agent (T-14h): Evaluated 3 corridors against 7 criteria; selected Singapore (94/100) and designated Doha (92/100) as primary backup.
• Monitor Agent (T-6h): Telemetry and METAR ingest verified nominal weather and upper jetstream tailwinds.
• Decision Agent (Current Cycle): Evaluated the 4-stage decision tree. Curfew margin is ${tripState?.decision?.curfewMarginMinutes || 325}m and risk score is ${riskScore}/100.`;
  }

  // 4. Connection Buffer / Layover questions
  if (q.includes("buffer") || q.includes("connection") || q.includes("layover") || q.includes("miss")) {
    if (isDisrupted && buffer < 60) {
      return `Your connection buffer at ${hubName} has compressed to ${buffer} minutes due to ${disruptionTitle} (+${delay}m delay). With Changi's Minimum Connection Time (MCT) set at 45 minutes, historical data indicates an 84% failure probability under 30-minute buffers. The Decision Agent has triggered Disruption Protocol to auto-reroute to Doha QR908.`;
    }
    return `Your connection buffer at ${hubName} is currently ${buffer} minutes. Minimum Connection Time (MCT) is 45 minutes, providing a robust +${Math.max(0, buffer - 45)}m safety margin above airport minimums.`;
  }

  // 5. Sydney Curfew questions
  if (q.includes("curfew") || q.includes("sydney") || q.includes("syd")) {
    if (tripState?.decision?.curfewWarning) {
      return `Sydney Kingsford Smith (SYD) strictly enforces an operational curfew starting at 23:00 local. Inbound flights arriving past this boundary are diverted. With current delays, the Decision Agent recommends ${action} to guarantee landing at 19:40 local, safely 200 minutes ahead of curfew.`;
    }
    return `Sydney Kingsford Smith (SYD) enforces a mandatory curfew between 23:00 and 06:00 local. Under your current itinerary via ${hubName}, arrival is projected well ahead of curfew limits with a comfortable margin of safety.`;
  }

  // 6. Weather & Corridor Atmosphere
  if (q.includes("weather") || q.includes("storm") || q.includes("turbulence")) {
    const weather = tripState?.weather || {};
    return `Corridor Meteorological Ingest:\n• London Heathrow (LHR): ${weather.origin || "14°C, Wind 240/12kt, RWY 27L/27R Active"}\n• Hub (${hub}): ${weather.hub || (isDisrupted ? "Convective Supercell Alert, SIGMET Active" : "29°C, Wind 080/6kt, RWY 02L Active")}\n• Sydney (SYD): ${weather.destination || "21°C, Fresh Southerly 15kt, Optimal Ops RWY 34L"}.`;
  }

  // 7. Flight / Aircraft / Seat info
  if (q.includes("flight") || q.includes("aircraft") || q.includes("seat") || q.includes("sq") || q.includes("ek") || q.includes("qr")) {
    const leg1 = tripState?.itinerary?.leg1;
    const leg2 = tripState?.itinerary?.leg2;
    return `Itinerary & Cabin Specifications for Elena Rostova (PNR: VY-89241):\n• Leg 1: ${leg1?.flightNumber || "SQ305"} (${leg1?.aircraft || "A350-900"}) LHR → ${hub}, Seat ${leg1?.seat || "2A Suite"}\n• Leg 2: ${leg2?.flightNumber || "SQ231"} (${leg2?.aircraft || "A380-800"}) ${hub} → SYD, Seat ${leg2?.seat || "3A First Suite"}\nStatus: ${isDisrupted ? `Active Reroute: ${action}` : "Nominal, On Schedule"}.`;
  }

  // Default smart fallback
  return `Hello Elena. I am VYRA, monitoring your journey via ${hubName}. System status is ${isDisrupted ? `DISRUPTION DETECTED (+${delay}m)` : "NOMINAL"}. Connection buffer is ${buffer} minutes with risk score ${riskScore}/100. You can ask me why the Planner chose this corridor, compare historical on-time stats, or inspect the agent decision logs.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "VOYA Autonomous Flight Operations", timestamp: new Date().toISOString() });
  });

  // VYRA Chat Endpoint (Grounded in current VOYA trip state with multi-model resiliency)
  const chatHandler = async (req: express.Request, res: express.Response) => {
    const { message, tripState, conversationHistory, language } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message field" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback when GEMINI_API_KEY is not yet populated
      const reply = generateContextualVyraReply(message, tripState);
      return res.json({ reply, provider: "voya-local-ops" });
    }

    try {
      const languageInstruction = language && language !== 'en-GB' && language !== 'en-US'
        ? `\n- LANGUAGE DIRECTIVE: The user has selected the language/locale code "${language}". You MUST respond completely in this requested language (e.g. Tamil for 'ta', French for 'fr', German for 'de', Spanish for 'es', Chinese for 'zh', Japanese for 'ja', Korean for 'ko', Arabic for 'ar'), while keeping airport codes (LHR, SIN, DXB, DOH, SYD) and flight numbers recognizable.`
        : '';

      const systemInstruction = `You are VYRA (VOYA Yield & Reconnaissance Assistant), the dedicated conversational voice and operations concierge for passenger Elena Rostova (PNR: VY-89241, VIP Tier 1). Always identify yourself as VYRA.
You represent VOYA, an autonomous multi-agent travel operations platform coordinating four collaborative agents:
1. Planner Agent: Configures initial routing between LHR and SYD via Singapore (SIN), Dubai (DXB), or Doha (DOH) using a 7-criteria weighted evaluation.
2. Monitor Agent: Real-time radar polling, METAR weather ingests, airspace holds, and connection buffer surveillance.
3. Decision Agent: 4-stage decision tree evaluating MCT buffer breaches, Sydney 23:00 curfew risk, baggage transfer integrity, and passenger fatigue.
4. Execution Agent: Autonomous PNR reissue, Apple Wallet pass synchronization, SMS concierge dispatch, and airport escort coordination.

GROUNDED TRIP STATE, HISTORICAL FLIGHT DATA & AGENT DECISION LOGS:
${JSON.stringify(tripState || {}, null, 2)}

CRITICAL KNOWLEDGE FOR "WHY" & DECISION QUESTIONS:
- Why Singapore (SIN) was selected by Planner: Highest multi-criteria score (94/100). Outstanding 91.4% historical on-time performance (OTP), 325-minute buffer before Sydney 23:00 curfew (lands at 17:35 +1), and KrisFlyer Solitaire alignment with A350/A380 suites.
- Why Dubai (DXB) was REJECTED: Arrives in Sydney at 22:15 +1, leaving only a dangerous 45-minute curfew cushion. With historical en-route delays averaging 28.5 minutes (84.1% OTP), any minor ATC or weather hold forces a mandatory diversion away from Sydney to Melbourne or Brisbane.
- Why Doha (DOH) is the #1 Contingency / Backup Route: Highest historical OTP in the industry (94.2%), low 8.8m average delay, 200-minute curfew buffer (lands at 19:40 +1), and confirmed Qsuite (Seat 2K) with Oneworld Emerald reciprocity.
- Historical Flight Data: Singapore 91.4% OTP, Doha 94.2% OTP, Dubai 84.1% OTP. Changi transfer time avg 14m, Hamad 18m, Dubai 32m. Elena's connection success rate is 98.2%.
- Previous Agent Decision Logs: Always reference the chronological decision logs (e.g. LOG-PLN-01 route inception, LOG-MON-02 pre-flight sweep, LOG-DEC-03 disruption/nominal assessment) when asked about the decision trail or reasoning.

INSTRUCTIONS:
- Directly answer "why" the Planner made a specific decision by citing the multi-criteria trade-offs, historical OTP numbers, curfew margins, and passenger tier preferences.
- Ground your answers strictly in the current trip state provided above.
- Speak in the calm, poised, and articulate tone of an elite airline operations director and flight concierge.
- Mention specific numbers (e.g., "91.4% on-time rate", "325-minute curfew margin", "45-minute minimum connection time", "23:00 curfew").
- Keep replies punchy, authoritative, and conversational (typically 2-4 concise paragraphs or bullet points).${languageInstruction}`;

      // Build contents array with context
      const chatContents: any[] = [];

      if (Array.isArray(conversationHistory)) {
        for (const item of conversationHistory.slice(-6)) {
          if (item.role === "user" || item.role === "model") {
            chatContents.push({
              role: item.role,
              parts: [{ text: item.text }],
            });
          }
        }
      }

      chatContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Try primary model first, with fallback model if primary is under high demand (503)
      const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      let replyText: string | null = null;
      let usedProvider = "voya-local-ops";

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: chatContents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (response?.text) {
            replyText = response.text;
            usedProvider = model;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[VOYA AI] Model ${model} unavailable (status: ${modelErr?.status || modelErr?.code || 'error'}), attempting fallback...`);
        }
      }

      // If all cloud models were busy, seamlessly use the local ops reasoning engine
      if (!replyText) {
        replyText = generateContextualVyraReply(message, tripState);
      }

      return res.json({ reply: replyText, provider: usedProvider });
    } catch (err: any) {
      console.warn("[VOYA AI] Handled endpoint exception, using contextual ops fallback:", err?.message || err);
      const fallbackReply = generateContextualVyraReply(message, tripState);
      return res.json({ reply: fallbackReply, provider: "voya-local-ops" });
    }
  };

  app.post("/api/vyra/chat", chatHandler);
  app.post("/api/vira/chat", chatHandler);

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VOYA] Flight Operations Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start VOYA server:", err);
  process.exit(1);
});
