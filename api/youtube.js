export const config = { runtime: 'edge' };
export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }
  const YT_API_KEY = process.env.YT_API_KEY;
  if (!YT_API_KEY) {
    return new Response(JSON.stringify({ error: 'YT_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q');
    const maxResults = url.searchParams.get('maxResults') || '5';
    if (!q) {
      return new Response(JSON.stringify({ error: 'q is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const ytUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    ytUrl.searchParams.set('key', YT_API_KEY);
    ytUrl.searchParams.set('q', q);
    ytUrl.searchParams.set('part', 'snippet');
    ytUrl.searchParams.set('type', 'video');
    ytUrl.searchParams.set('maxResults', String(maxResults));
    ytUrl.searchParams.set('safeSearch', 'moderate');
    const response = await fetch(ytUrl.toString());
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
