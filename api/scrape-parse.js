import { kv } from '@vercel/kv';

const TTL_MS = 1000 * 60 * 60 * 48; // 48h cache
const WHITELIST = {
  Japan: [/mofa\.go\.jp/i, /embassy/i],
  Thailand: [/immigration\.go\.th/i, /thaiembassy\.org/i],
  'United Arab Emirates': [/icp\.gov\.ae/i, /u\.ae/i],
  'Schengen Area': [/consulate|embassy|gov/i]
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { nationality, destination, currency = 'INR', urls = [] } = req.body || {};
    if (!nationality || !destination || !urls.length) return res.status(400).json({ error: 'nationality, destination and at least one URL are required' });

    const allow = WHITELIST[destination] || [];
    const allOk = urls.every(u => allow.length ? allow.some(rx => new RegExp(rx).test(u)) : true);
    if (!allOk) return res.status(400).json({ error: 'Provide official URLs only for this destination.' });

    const cacheKey = `visa:${nationality}:${destination}`;
    const cached = await kv.get(cacheKey);
    if (cached && Date.now() - (cached.ts||0) < TTL_MS) return res.status(200).json(cached.data);

    const url = urls[0];
    const page = await fetch(url, { headers: { 'User-Agent': 'VisaCheckerBot/1.0' } });
    const html = await page.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 15000);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

    const messages = [
      { role: 'system', content: 'You are an extraction engine. ONLY use facts present in the supplied page text. If unsure, return null for that field.' },
      { role: 'user', content:
        `Extract visa requirements strictly from this page text, only if explicitly stated.\n` +
        `Nationality: ${nationality}\nDestination: ${destination}\nCurrency for any fees: ${currency}\n\n` +
        `PAGE_TEXT_START\n${text}\nPAGE_TEXT_END\n\n` +
        `Return a compact JSON object with fields: allowed(boolean|null), fee(number|null), processing(string|null), stayLimit(number|null), documentsRequired(string|null), notes(string|null), lastUpdated(YYYY-MM-DD), currency(string), sourceUrl(string). If a field is not present in the text, set it to null.`
      }
    ];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', response_format: { type: 'json_object' }, messages })
    });
    if (!resp.ok) return res.status(500).json({ error: 'OpenAI error', detail: await resp.text() });
    const data = await resp.json();
    let parsed;
    try { parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}'); }
    catch { parsed = { error: 'Failed to parse JSON from model', raw: data }; }
    parsed.nationality = nationality; parsed.destination = destination; parsed.currency = currency; parsed.sourceUrl = parsed.sourceUrl || urls[0];

    await kv.set(cacheKey, { ts: Date.now(), data: parsed });
    return res.status(200).json(parsed);
  } catch (e) { return res.status(500).json({ error: e.message || 'Unexpected error' }); }
}
