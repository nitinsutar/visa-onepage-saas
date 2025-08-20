import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  try {
    const keys = await kv.smembers('override:index');
    const results = [];
    for (const k of keys || []) {
      const v = await kv.get(k);
      if (v?.destination && v?.nationality) results.push(v);
    }
    return res.status(200).json(results);
  } catch (e) { return res.status(200).json([]); }
}
