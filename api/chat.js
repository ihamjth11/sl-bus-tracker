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
    const { message, history } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a helpful Sri Lanka bus transport assistant. Help people find bus routes, fares, timings across Sri Lanka. Be friendly and concise. Answer in the same language as the user (Tamil, Sinhala, or English).

Known routes with official NTC 2026 fares:
- Colombo-Kandy: Normal Rs.458 / AC Rs.830, 2.5-3hrs, Bus No.1
- Colombo-Galle: Normal Rs.532 / AC Rs.800, 2-2.5hrs, Bus No.2-1
- Colombo-Jaffna: Normal Rs.1967 / AC Rs.2620, 7-8hrs, Bus No.15/87
- Colombo-Negombo: Normal Rs.301 / AC Rs.652, 1-1.5hrs, Bus No.4
- Colombo-Matara: Normal Rs.797 / AC Rs.1060, 3-3.5hrs, Bus No.2
- Colombo-Anuradhapura: Normal Rs.1094 / AC Rs.1460, 4-5hrs, Bus No.15-1-1
- Colombo-Trincomalee: Normal Rs.1275 / AC Rs.2550, 6-7hrs, Bus No.49
- Colombo-Batticaloa: Normal Rs.1524 / AC Rs.3050, 6.5-7.5hrs, Bus No.48-1
- Colombo-Hambantota: Normal Rs.1184 / AC Rs.2180, 4-5hrs, Bus No.32-1
- Colombo-Badulla: Normal Rs.1250 / AC Rs.1690, 5-6hrs, Bus No.21-6
- Anuradhapura-Nochchiyagama: Normal Rs.98, 45mins, Bus No.57/822/87`
          },
          ...(history || []),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}