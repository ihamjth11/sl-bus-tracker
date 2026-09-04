// Creates a GitHub Issue from user-submitted feedback/reports — no database
// needed, and the user already manages this project via GitHub, so reports
// show up right where they already work. Requires a GITHUB_TOKEN env var
// (a GitHub Personal Access Token with "repo" scope, or fine-grained access
// to just this repo with Issues: Read & Write) set on Vercel.

const TYPE_INFO = {
  wrong_fare: { label: 'wrong-fare', title: 'Wrong fare reported' },
  wrong_route: { label: 'wrong-route', title: 'Wrong route info reported' },
  bug: { label: 'bug', title: 'Bug report' },
  feature: { label: 'feature-request', title: 'Feature request' },
  general: { label: 'feedback', title: 'User feedback' },
};

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
    const { type, message, routeContext, page } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please write a message before submitting.' });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'ihamjth11/sl-bus-tracker';

    if (!GITHUB_TOKEN) {
      console.log('GITHUB_TOKEN is not set — cannot submit feedback');
      return res.status(500).json({ error: 'Feedback system is not configured yet. Please try again later.' });
    }

    const info = TYPE_INFO[type] || TYPE_INFO.general;
    const contextSuffix = routeContext ? `: ${routeContext}` : '';
    const title = `[App] ${info.title}${contextSuffix}`.slice(0, 120);

    const bodyLines = [
      `**Type:** ${info.title}`,
      routeContext ? `**Route mentioned:** ${routeContext}` : null,
      page ? `**Page:** ${page}` : null,
      '',
      '**Message from user:**',
      message.trim(),
      '',
      `_Submitted via the Lankora app feedback form — ${new Date().toISOString()}_`,
    ].filter(Boolean);

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
        labels: ['user-report', info.label],
      }),
    });

    const data = await ghResponse.json();

    if (!ghResponse.ok) {
      console.log('GitHub API error:', JSON.stringify(data));
      return res.status(500).json({ error: data.message || 'Could not submit your report. Please try again.' });
    }

    return res.status(200).json({ success: true, issueUrl: data.html_url });
  } catch (error) {
    console.log('Feedback handler error:', error.message);
    return res.status(500).json({ error: error.message || 'Something went wrong. Please try again.' });
  }
}