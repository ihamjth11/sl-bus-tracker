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
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a helpful Sri Lanka bus transport assistant. Answer in the same language as the user (Tamil, Sinhala, or English). Be brief and helpful.

Key routes (NTC 2026 fares):
- Colombo-Kandy: Normal Rs.458 / AC Rs.830, Bus No.1
- Colombo-Galle: Normal Rs.532 / AC Rs.800, Bus No.2-1
- Colombo-Jaffna: Normal Rs.1967 / AC Rs.2620, Bus No.15/87
- Colombo-Negombo: Normal Rs.301 / AC Rs.652, Bus No.4
- Colombo-Matara: Normal Rs.797 / AC Rs.1060, Bus No.2
- Colombo-Anuradhapura: Normal Rs.1094 / AC Rs.1460, Bus No.15-1-1
- Colombo-Trincomalee: Normal Rs.1275 / AC Rs.2550, Bus No.49
- Colombo-Batticaloa: Normal Rs.1524 / AC Rs.3050, Bus No.48-1
- Colombo-Hambantota: Normal Rs.1184 / AC Rs.2180, Bus No.32-1
- Colombo-Badulla: Normal Rs.1250 / AC Rs.1690, Bus No.21-6
- Anuradhapura-Nochchiyagama: Normal Rs.98, Bus No.57/822/87`
          },
          ...(history || []),
          { role: 'user', content: message }
        ],
        max_tokens: 300,
      }),
    });

    clearTimeout(timeout);

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: data.error?.message || 'No response from AI' });
    }
    
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(500).json({ error: 'Request timed out. Please try again.' });
    }
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}