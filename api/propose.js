import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body || {};
    if (!body.nationality || !body.destination) return res.status(400).json({ error: 'Missing route fields' });
    const key = `pending:${body.nationality}:${body.destination}`;
    await kv.set(key, { ts: Date.now(), data: body });
    await kv.sadd('pending:index', key);
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
