import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = req.headers['x-admin-key'];
  if (!admin || admin !== process.env.ADMIN_PASS) return res.status(403).json({ error: 'Forbidden' });
  try {
    const { nationality, destination } = req.body || {};
    if (!nationality || !destination) return res.status(400).json({ error: 'Missing route fields' });
    const pKey = `pending:${nationality}:${destination}`;
    const pending = await kv.get(pKey);
    if (!pending) return res.status(404).json({ error: 'No pending record' });
    const oKey = `override:${nationality}:${destination}`;
    await kv.set(oKey, pending.data);
    await kv.sadd('override:index', oKey);
    await kv.del(pKey);
    await kv.srem('pending:index', pKey);
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
