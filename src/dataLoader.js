// Simple CSV loader: fetches /visa_matrix.csv from /public and parses into objects
export async function loadVisaCSV() {
  try {
    const res = await fetch('/visa_matrix.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error('CSV not found');
    const text = await res.text();
    return parseCSV(text);
  } catch (e) {
    console.warn('CSV load failed, falling back to defaultData:', e.message);
    return null;
  }
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  if (!lines.length) return [];
  const header = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const parts = splitCSV(line);
    const obj = {};
    header.forEach((h, i) => { obj[h] = (parts[i] ?? '').trim(); });
    // normalize fields
    obj.allowed = String(obj.allowed).toLowerCase() === 'true';
    obj.fee = Number(obj.fee || 0);
    obj.acceptanceRate = Number(obj.acceptanceRate || 0);
    return obj;
  });
  return rows;
}

// handles quotes and commas inside quotes
function splitCSV(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { q = !q; continue; }
    if (ch === ',' && !q) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}
