import React, { useEffect, useMemo, useState } from 'react';
import { defaultData } from './data';
import { loadVisaCSV } from './dataLoader';
import { setSEO } from './seo';
import FAQ from './FAQ';

function Currency({ value, currency = 'INR' }) {
  const symbols = { INR: '₹', USD: '$', GBP: '£', EUR: '€', SGD: 'S$', AED: 'AED ' };
  const locales = { INR: 'en-IN', USD: 'en-US', GBP: 'en-GB', EUR: 'en-IE', SGD: 'en-SG', AED: 'ar-AE' };
  const symbol = symbols[currency] ?? '';
  const locale = locales[currency] ?? 'en-US';
  const n = Number(value || 0);
  return <>{symbol}{Number.isFinite(n) ? n.toLocaleString(locale) : value}</>;
}
function DocList({ docs }) {
  const items = String(docs || '').split(/\||,/).map(s => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700">{items.map((d, i) => <li key={i}>{d}</li>)}</ul>;
}
const stayLimitValue = (val) => { const n = Number(val); return Number.isFinite(n) && n > 0 ? n : null; };

export default function App() {
  const [data, setData] = useState(defaultData);
  const [overrides, setOverrides] = useState([]);
  const [nationality, setNationality] = useState('India');
  const [destination, setDestination] = useState('Thailand');
  const [urlsInput, setUrlsInput] = useState('');
  const [result, setResult] = useState(null);
  const [latest, setLatest] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [errorLatest, setErrorLatest] = useState('');

  useEffect(() => { (async () => {
    const csv = await loadVisaCSV(); if (csv && csv.length) setData(csv);
    try { const ov = await fetch('/api/overrides').then(r => r.ok ? r.json() : []); setOverrides(ov || []);} catch {}
  })(); }, []);

  const nationalities = useMemo(() => Array.from(new Set(data.map(r => r.nationality).concat(overrides.map(o=>o.nationality)))).sort(), [data, overrides]);
  const destinations = useMemo(() => Array.from(new Set(data.map(r => r.destination).concat(overrides.map(o=>o.destination)))).sort(), [data, overrides]);

  const getMerged = (n,d) => {
    const o = overrides.find(x => x.nationality===n && x.destination===d);
    const base = data.find(r => r.nationality===n && r.destination===d);
    return o ? { ...base, ...o } : base;
  };

  const handleCheck = () => {
    const match = getMerged(nationality, destination);
    setResult(match || 'No data available');
    const params = new URLSearchParams({ nationality, destination });
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
    const verdict = match ? (match.allowed ? 'Visa Free / VoA / ETA' : 'Visa Required') : 'No data';
    setSEO({ nationality, destination, verdict, fee: match?.fee, processing: match?.processing });
  };

  const runLatest = async () => {
    setErrorLatest(''); setLoadingLatest(true); setLatest(null);
    try {
      const urls = urlsInput.split(',').map(u => u.trim()).filter(Boolean);
      const payload = { nationality, destination, currency: (result && result.currency) || 'INR', urls };
      const res = await fetch('/api/scrape-parse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setLatest(data);
    } catch (e) { setErrorLatest(e.message || 'Failed to fetch latest info'); }
    finally { setLoadingLatest(false); }
  };

  const proposeLatest = async () => {
    if (!latest) return;
    const res = await fetch('/api/propose', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(latest) });
    if (res.ok) alert('Proposed update submitted for approval.'); else alert('Failed to submit proposal.');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium ring-1 ring-brand-100">Travel smarter</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Know your visa in one click</h1>
            <p className="mt-3 text-lg text-gray-600">No jargon. No hunting across websites. Choose your nationality and destination to see a clear verdict, estimated fees, processing time, optional stay limit, and a document checklist.</p>
            <p className="mt-2 text-sm text-gray-500">Built for speed. Backed by sources. Always verify with the official embassy before you book.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">India → Thailand</span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">US → Schengen</span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">UK → USA</span>
            </div>
          </div>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Your nationality</span>
                <select className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-600 focus:ring-brand-600" value={nationality} onChange={e => setNationality(e.target.value)}>
                  {nationalities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Destination</span>
                <select className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-600 focus:ring-brand-600" value={destination} onChange={e => setDestination(e.target.value)}>
                  {destinations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <button onClick={handleCheck} className="mt-5 w-full rounded-2xl bg-brand-600 px-4 py-3 text-white font-semibold transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600">Check Requirements</button>
            <p className="mt-2 text-xs text-gray-500">No login. No forms. Just the answer.</p>

            <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-800">Check latest (Beta)</div>
              <p className="text-xs text-gray-500 mt-1">Paste official source URLs (embassy/immigration) separated by commas. We parse the page and show structured results.</p>
              <textarea value={urlsInput} onChange={e => setUrlsInput(e.target.value)} rows={2} className="mt-2 w-full rounded-lg border-gray-300 focus:border-brand-600 focus:ring-brand-600 p-2" placeholder="https://immigration.go.th/... , https://www.mofa.go.jp/..."></textarea>
              <div className="flex gap-2 mt-3">
                <button onClick={runLatest} disabled={loadingLatest} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60">{loadingLatest ? 'Checking…' : 'Check latest from sources'}</button>
                <button onClick={proposeLatest} disabled={!latest} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 text-gray-800 disabled:opacity-50">Propose update</button>
              </div>
              {errorLatest && <div className="mt-2 text-sm text-red-700">{errorLatest}</div>}
            </div>
          </div>

          <aside className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700">Why travelers use this</h3>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Instant “visa free” vs “visa required” verdict</li>
              <li>Estimated fee, processing time & optional stay limit</li>
              <li>Documents checklist from official sources</li>
            </ul>
          </aside>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
            {typeof result === 'string' ? (
              <p className="text-gray-700">{result}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${result.allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.allowed ? '✅ Visa Free / VoA / ETA' : '❌ Visa Required'}
                  </span>
                  {stayLimitValue(result.stayLimit) && (
                    <span className="text-sm text-gray-600">· Stay limit: <strong>{stayLimitValue(result.stayLimit)} days</strong></span>
                  )}
                </div>

                {!result.allowed && (
                  <div className="text-gray-800">
                    <span className="font-medium">Estimated fee:</span> <Currency value={result.fee} currency={result.currency || 'INR'} />
                    <span className="mx-2">•</span>
                    <span className="font-medium">Processing:</span> {result.processing || '—'}
                  </div>
                )}

                {result.acceptanceRate && (<div className="text-gray-700">Acceptance rate: <strong>{result.acceptanceRate}</strong></div>)}
                {result.documentsRequired && (<div><div className="font-semibold">Documents usually required</div><DocList docs={result.documentsRequired} /></div>)}
                {result.notes && (<p className="text-sm text-gray-600">Note: {result.notes}</p>)}
                {result.lastUpdated && (<p className="text-xs text-gray-500">Last updated: {result.lastUpdated}</p>)}
              </div>
            )}
          </div>
        )}

        {latest && (
          <div className="mt-6 rounded-2xl bg-brand-50 ring-1 ring-brand-100 p-5">
            <div className="text-sm font-semibold text-gray-900">Parsed from sources (Beta)</div>
            <pre className="mt-2 overflow-auto text-xs text-gray-800 bg-white/60 p-3 rounded-lg">{JSON.stringify(latest, null, 2)}</pre>
            {latest.sourceUrl && <a className="text-sm text-brand-700 underline mt-2 inline-block" href={latest.sourceUrl} target="_blank" rel="noreferrer">View source</a>}
          </div>
        )}
      </section>

      <FAQ />

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-gray-500">This tool is for informational purposes only and may be outdated. Always confirm with official government or embassy sources.</div>
      </footer>
    </main>
  );
}
