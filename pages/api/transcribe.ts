import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/transcribe?url=...&videoId=...&lang=...&text=...&chunkSize=...
 * Proxies to SupaData YouTube transcript API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Only GET is supported.' });
  }

  const { url, videoId, lang, text, chunkSize } = req.query;
  const supaApiKey = process.env.SUPADATA_API_KEY;

  if (!supaApiKey) {
    console.error('SupaData API key is not configured.');
    return res.status(500).json({ error: 'SupaData API key is not configured.' });
  }

  if (!url && !videoId) {
    return res.status(400).json({ error: 'Either url or videoId query parameter is required.' });
  }

  // Build SupaData API query
  const params = new URLSearchParams();
  if (url) params.append('url', String(url));
  if (videoId) params.append('videoId', String(videoId));
  if (lang) params.append('lang', String(lang));
  if (typeof text !== 'undefined') params.append('text', String(text));
  if (chunkSize) params.append('chunkSize', String(chunkSize));

  const apiUrl = `https://api.supadata.ai/v1/youtube/transcript?${params.toString()}`;

  try {
    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': supaApiKey,
        'Accept': 'application/json',
      },
    });

    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }
    if (!apiRes.ok) {
      console.error('SupaData error:', apiRes.status, data);
      return res.status(apiRes.status).json({ error: data.error || data.message || data.raw || 'Failed to fetch transcript from SupaData.' });
    }
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error proxying to SupaData:', error?.message || error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

