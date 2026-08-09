import { busRoutes } from '../src/routesData.js';

// Build the route knowledge text directly from the app's own verified database, so the AI
// assistant is always consistent with what's shown elsewhere in the app — never a separately
// hand-maintained (and easily outdated) copy.
function buildRouteKnowledge() {
  const lines = Object.values(busRoutes).map((r) => {
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
  });
  return lines.join('\n');
}

function buildSystemPrompt() {
  const routeKnowledge = buildRouteKnowledge();

  return `You are an expert Sri Lanka bus transport assistant for the SL Bus Tracker app. Always answer in the same language as the user (Tamil, Sinhala, or English). Be friendly, accurate and helpful.

VERIFIED ROUTE DATABASE (this is the app's own real data — routes marked "(est.)" in fare or "(approx.)" in frequency are estimated/calibrated, not officially published; everything else is sourced from NTC records, official timetables, or confirmed operator data):

${routeKnowledge}

CRITICAL RULES:
1. For any route listed above, use those exact figures. Do not alter them.
2. For a route NOT listed above (a town pair with no direct entry), do NOT invent a specific fare, bus number, or exact time — you have no reliable source for it. Instead, suggest a sensible transfer using towns that ARE in the list above (e.g., "take a bus from Nochchiyagama to Anuradhapura, then transfer to a bus from Anuradhapura to Colombo"), and clearly tell the user to confirm the exact fare and timing at the local bus stand, since it isn't in the verified database.
3. If a fare above is marked "(est.)", mention to the user that it's an estimate, not an officially confirmed fare.
4. Never state a specific bus timetable time with confidence unless it's the value shown above.

GENERAL NOTES:
- All buses depart from Colombo Fort Bus Stand (Central Bus Stand, Pettah) unless stated otherwise.
- AC/Luxury buses are more comfortable with reserved seating; Normal buses are cheaper but crowded, no reservation needed.
- Minimum fare is Rs. 34.
- Children under 5 travel free; ages 5-12 half fare.
- Expressway (highway) AC buses exist for some long routes (e.g. Colombo-Kandy, Colombo-Matara, Colombo-Hambantota) and are faster than the regular routes above, but exact expressway fares/schedules aren't in the verified database — mention they exist but don't quote a specific fare for them unless asked, and note the rider should confirm directly.`;
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
    console.log('API Key exists:', !!process.env.GROQ_API_KEY);
    console.log('API Key first 10:', process.env.GROQ_API_KEY?.substring(0, 10));
    const { message, history } = req.body;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(),
          },
          ...(history || []),
          { role: 'user', content: message },
        ],
        max_tokens: 300,
      }),
    });

    clearTimeout(timeout);

    const data = await response.json();
    console.log('Groq status:', response.status);
    console.log('Groq response:', JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: data.error?.message || 'No response from AI' });
    }

    const reply = data.choices[0].message.content;
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