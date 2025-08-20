import React, { useEffect, useMemo, useState } from 'react';
import { defaultData } from './data';
import { loadVisaCSV } from './dataLoader';

function Currency({ value, currency = 'INR' }) {
  try {
    const symbol = currency === 'INR' ? '₹' : '';
    return <>{symbol}{Number(value || 0).toLocaleString('en-IN')}</>;
  } catch {
    return <>{value}</>;
  }
}

function DocList({ docs }) {
  const items = String(docs || '')
    .split(/\||,/)
    .map(s => s.trim())
    .filter(Boolean);
  if (!items.length) return null;
  return (
    <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700">
      {items.map((d, i) => <li key={i}>{d}</li>)}
    </ul>
  );
}

export default function App() {
  const [data, setData] = useState(defaultData);
  const [nationality, setNationality] = useState('India');
  const [destination, setDestination] = useState('Thailand');
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const csv = await loadVisaCSV();
      if (csv && csv.length) setData(csv);
    })();
  }, []);

  const nationalities = useMemo(() => Array.from(new Set(data.map(r => r.nationality))).sort(), [data]);
  const destinations = useMemo(() => Array.from(new Set(data.map(r => r.destination))).sort(), [data]);

  useEffect(() => {
    if (!nationalities.includes(nationality) && nationalities.length) setNationality(nationalities[0]);
  }, [nationalities]);
  useEffect(() => {
    if (!destinations.includes(destination) && destinations.length) setDestination(destinations[0]);
  }, [destinations]);

  const handleCheck = () => {
    const match = data.find(r => r.nationality === nationality && r.destination === destination);
    setResult(match || 'No data available');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Visa Requirements in 1 Click</h1>
          <p className="mt-1 text-gray-600">Pick your nationality and destination — get a clear answer with fees, processing time, and documents required. <span className="italic">Always verify with official sources before travel.</span></p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Your nationality</span>
                <select
                  className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-600 focus:ring-brand-600"
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                >
                  {nationalities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Destination</span>
                <select
                  className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-600 focus:ring-brand-600"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                >
                  {destinations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <button
              onClick={handleCheck}
              className="mt-5 w-full rounded-2xl bg-black px-4 py-3 text-white font-semibold transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Check Requirements
            </button>
            <p className="mt-2 text-xs text-gray-500">No login. No forms. Just the answer.</p>
          </div>

          <aside className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700">Why travelers use this</h3>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Instant "Visa-Free" vs "Visa Required" verdict</li>
              <li>See estimated fee, processing time & stay limit</li>
              <li>Know documents to carry — passport, funds proof, tickets</li>
            </ul>
          </aside>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
            {typeof result === 'string' ? (
              <p className="text-gray-700">{result}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${result.allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.allowed ? '✅ Visa Free / VoA / ETA' : '❌ Visa Required'}
                  </span>
                  {result.stayLimit && (
                    <span className="text-sm text-gray-600">· Stay limit: <strong>{result.stayLimit} days</strong></span>
                  )}
                </div>

                {!result.allowed && (
                  <div className="text-gray-800">
                    <span className="font-medium">Estimated fee:</span> <Currency value={result.fee} currency={result.currency || 'INR'} />
                    <span className="mx-2">•</span>
                    <span className="font-medium">Processing:</span> {result.processing || '—'}
                  </div>
                )}

                {result.acceptanceRate && (
                  <div className="text-gray-700">Acceptance rate: <strong>{result.acceptanceRate}</strong></div>
                )}

                {result.documentsRequired && (
                  <div>
                    <div className="font-semibold">Documents usually required</div>
                    <DocList docs={result.documentsRequired} />
                  </div>
                )}

                {result.notes && (
                  <p className="text-sm text-gray-600">Note: {result.notes}</p>
                )}

                {result.lastUpdated && (
                  <p className="text-xs text-gray-500">Last updated: {result.lastUpdated}</p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-gray-500">
          This tool is for informational purposes only and may be outdated. Always confirm with the destination’s official immigration website or embassy.
        </div>
      </footer>
    </main>
  );
}
