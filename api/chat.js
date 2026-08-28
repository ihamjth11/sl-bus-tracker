import { busRoutes } from '../src/routesData.js';

// Build a line of route knowledge text from one route entry, matching the
// app's own verified database — so the AI is always consistent with what's
// shown elsewhere in the app, never a separately hand-maintained copy.
function formatRouteLine(r) {
  const stops = r.stops || [];
  const from = stops[0] || '?';
  const to = stops[stops.length - 1] || '?';
  const normalFare = r.normal?.fare || 'N/A';
  const acFare = r.ac?.fare || 'N/A';
  const busNo = r.normal?.bus || '';
  const duration = r.normal?.duration || '';
  const freq = r.timing?.frequency || '';
  const first = r.timing?.first || '';
  const last = r.timing?.last || '';
  return `- ${from}→${to}: Normal ${normalFare} / AC ${acFare} | ${busNo} | ${duration} | ${freq} | First ${first} Last ${last}`;
}

// Gemini's free tier has a far higher tokens-per-minute limit than Groq's,
// so this is mainly for keeping requests small/fast rather than a hard
// necessity — still good practice to only send what's relevant.
const MAX_ROUTES_IN_PROMPT = 60;

function buildRouteKnowledge(userMessage, history) {
  const allRoutes = Object.values(busRoutes);
  const searchText = [userMessage, ...(history || []).map((h) => h.content || '')]
    .join(' ')
    .toLowerCase();

  const matched = allRoutes.filter((r) => {
    const stops = r.stops || [];
    const from = (stops[0] || '').toLowerCase();
    const to = (stops[stops.length - 1] || '').toLowerCase();
    return (from && searchText.includes(from)) || (to && searchText.includes(to));
  });

  const chosen = matched.length > 0 ? matched : allRoutes;
  const limited = chosen.slice(0, MAX_ROUTES_IN_PROMPT);
  const truncatedNote =
    matched.length === 0 && allRoutes.length > MAX_ROUTES_IN_PROMPT
      ? '\n(Note: this is only a sample of routes — not the full database. If the user asks about a town not shown here, say so rather than guessing.)'
      : '';

  return limited.map(formatRouteLine).join('\n') + truncatedNote;
}

function buildSystemPrompt(userMessage, history) {
  const routeKnowledge = buildRouteKnowledge(userMessage, history);

  return `You are an expert Sri Lanka bus transport assistant for the Lankora app. Always answer in the same language as the user (Tamil, Sinhala, or English). Be friendly, accurate and helpful.

VERIFIED ROUTE DATABASE (this is the app's own real data, filtered to what's relevant to this conversation — routes marked "(est.)" in fare or "(approx.)" in frequency are estimated/calibrated, not officially published; everything else is sourced from NTC records, official timetables, or confirmed operator data):

${routeKnowledge}

CRITICAL RULES:
1. For any route listed above, use those exact figures. Do not alter them.
2. For a route NOT listed above (a town pair with no direct entry, or not shown in this sample), you may use Google Search to find real, current information about that route (operators, approximate fare, distance) rather than inventing figures from memory. If search doesn't turn up a reliable direct answer, suggest a sensible transfer using towns that ARE in the list above (e.g., "take a bus from Nochchiyagama to Anuradhapura, then transfer to a bus from Anuradhapura to Colombo"). Always tell the user to confirm the exact fare and timing at the local bus stand when the figure didn't come from the verified database above.
3. If a fare above is marked "(est.)", mention to the user that it's an estimate, not an officially confirmed fare.
4. Never state a specific bus timetable time with confidence unless it's the value shown above.

GENERAL NOTES:
- All buses depart from Colombo Fort Bus Stand (Central Bus Stand, Pettah) unless stated otherwise.
- AC/Luxury buses are more comfortable with reserved seating; Normal buses are cheaper but crowded, no reservation needed.
- Minimum fare is Rs. 34.
- Children under 5 travel free; ages 5-12 half fare.
- Expressway (highway) AC buses exist for some long routes (e.g. Colombo-Kandy, Colombo-Matara, Colombo-Hambantota) and are faster than the regular routes above, but exact expressway fares/schedules aren't in the verified database — mention they exist but don't quote a specific fare for them unless asked, and note the rider should confirm directly.`;
}

// Convert the app's OpenAI-style history ({ role: 'user'|'assistant', content })
// into Gemini's format ({ role: 'user'|'model', parts: [{ text }] }).
function toGeminiContents(history, message) {
  const converted = (history || []).map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content || '' }],
  }));
  converted.push({ role: 'user', parts: [{ text: message }] });
  return converted;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    const { message, history } = req.body;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    // Switched from Groq to Google Gemini's free tier (much higher tokens-
    // per-minute limit, no credit card required) after hitting Groq's TPM
    // rate limit with the route database in the prompt.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: buildSystemPrompt(message, history) }],
          },
          contents: toGeminiContents(history, message),
          // Lets the model search Google when a route isn't in our local
          // database, instead of only suggesting a generic transfer — gives
          // real, current answers for towns like Nochchiyagama that aren't
          // in the verified route data. Note: Google bills this per search
          // query the model decides to run, separate from plain text usage.
          tools: [{ google_search: {} }],
          generationConfig: {
            maxOutputTokens: 600,
          },
        }),
      }
    );

    clearTimeout(timeout);

    const data = await response.json();
    console.log('Gemini status:', response.status);
    console.log('Gemini response:', JSON.stringify(data));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: data.error?.message || 'No response from AI' });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Full error:', JSON.stringify(error));
    if (error.name === 'AbortError') {
      return res.status(500).json({ error: 'Request timed out. Please try again.' });
    }
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}