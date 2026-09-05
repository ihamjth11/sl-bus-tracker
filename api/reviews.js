// Public, read-only endpoint: fetches every "rating" issue from the repo
// and returns them as clean JSON (average rating + individual reviews) for
// <TrustSection /> to display live — no manual curation step needed.

function parseIssue(issue) {
  const body = issue.body || '';
  const lines = body.split('\n');
  let rating = null;
  let name = 'Anonymous traveler';
  let i = 0;

  // Consume the header block (lines starting with **Label:**) — handles
  // Rating/Name/Page in any combination, so extra header fields never leak
  // into the message text below.
  while (i < lines.length && lines[i].trim().startsWith('**')) {
    const line = lines[i];
    const ratingMatch = line.match(/\*\*Rating:\*\*\s*(\d)/);
    const nameMatch = line.match(/\*\*Name:\*\*\s*(.+)/);
    if (ratingMatch) rating = parseInt(ratingMatch[1], 10);
    if (nameMatch) name = nameMatch[1].trim();
    i++;
  }
  while (i < lines.length && lines[i].trim() === '') i++;

  const rest = lines.slice(i).join('\n');
  let message = rest.split(/\n_Submitted via/)[0].trim();
  if (!message || message === '_(no written comment)_') message = '';

  return {
    id: issue.id,
    rating,
    name,
    message,
    date: issue.created_at,
    url: issue.html_url,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'ihamjth11/sl-bus-tracker';

    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    // A token isn't strictly required for public repos, but raises the
    // rate limit from 60/hr to 5000/hr — use it if available.
    if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;

    const ghResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues?labels=rating&state=all&per_page=100&sort=created&direction=desc`,
      { headers }
    );

    if (!ghResponse.ok) {
      const errData = await ghResponse.json().catch(() => ({}));
      console.log('GitHub API error:', JSON.stringify(errData));
      return res.status(500).json({ error: 'Could not load reviews right now.' });
    }

    const issues = await ghResponse.json();
    const reviews = issues
      .map(parseIssue)
      .filter((r) => r.rating !== null && r.rating >= 1 && r.rating <= 5);

    const count = reviews.length;
    const averageRating = count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ averageRating, count, reviews });
  } catch (error) {
    console.log('Reviews handler error:', error.message);
    return res.status(500).json({ error: error.message || 'Something went wrong.' });
  }
}