export default async function handler(req, res) {
  const BB_API_KEY = process.env.BROWSERBASE_API_KEY;
  if (!BB_API_KEY) return res.status(500).json({ error: 'BROWSERBASE_API_KEY not configured' });
  try {
    const { path = '', method = 'GET', body } = req.body || {};
    if (!path) return res.status(400).json({ error: 'path is required' });
    const url = `https://api.browserbase.com/v1${path.startsWith('/') ? path : '/' + path}`;
    const options = { method: method.toUpperCase(), headers: { 'Content-Type': 'application/json', 'X-BB-API-Key': BB_API_KEY } };
    if (body && method.toUpperCase() !== 'GET') options.body = typeof body === 'string' ? body : JSON.stringify(body);
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }
    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
