// Submits a star rating + optional name/message as a GitHub Issue, labeled
// "rating" so api/reviews.js can find and list all of them publicly. No
// database needed — the repo's Issues list IS the reviews store.
// Requires GITHUB_TOKEN (a PAT scoped to this repo, Issues: Read & Write).

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
    const { rating, name, message, page } = req.body || {};

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Please give a rating between 1 and 5 stars.' });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'ihamjth11/sl-bus-tracker';

    if (!GITHUB_TOKEN) {
      console.log('GITHUB_TOKEN is not set — cannot submit rating');
      return res.status(500).json({ error: 'Rating system is not configured yet. Please try again later.' });
    }

    const displayName = (name || '').trim() || 'Anonymous traveler';
    const title = `${'⭐'.repeat(ratingNum)} rating from ${displayName}`.slice(0, 120);

    // Structured body so api/reviews.js can reliably parse rating/name/message
    // back out — keep these three field lines exactly in this format.
    const bodyLines = [
      `**Rating:** ${ratingNum}`,
      `**Name:** ${displayName}`,
      page ? `**Page:** ${page}` : null,
      '',
      (message || '').trim() || '_(no written comment)_',
      '',
      `_Submitted via the Lankora app — ${new Date().toISOString()}_`,
    ].filter((line) => line !== null);

    const ghResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title,
        body: bodyLines.join('\n'),
        labels: ['rating'],
      }),
    });

    const data = await ghResponse.json();

    if (!ghResponse.ok) {
      console.log('GitHub API error:', JSON.stringify(data));
      return res.status(500).json({ error: data.message || 'Could not submit your rating. Please try again.' });
    }

    return res.status(200).json({ success: true, issueUrl: data.html_url });
  } catch (error) {
    console.log('Feedback handler error:', error.message);
    return res.status(500).json({ error: error.message || 'Something went wrong. Please try again.' });
  }
}