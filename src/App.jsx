import React, { useEffect, useMemo, useState } from 'react';
import { defaultData } from './data';
import { loadVisaCSV } from './dataLoader';

function DocList({ docs }) {
  const items = String(docs || '').split('|').map(s => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <ul className="list">
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
    <div className="container">
      <h1>Visa Requirements in 1 Click</h1>
      <p style={{opacity:.7}}>Informational only. Always verify with official sources before travel.</p>

      <div className="card" style={{marginTop:12}}>
        <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
          <label>
            <div style={{fontSize:12, marginBottom:4}}>Your nationality</div>
            <select value={nationality} onChange={e => setNationality(e.target.value)} style={{width:'100%', padding:8}}>
              {nationalities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <div style={{fontSize:12, marginBottom:4}}>Destination</div>
            <select value={destination} onChange={e => setDestination(e.target.value)} style={{width:'100%', padding:8}}>
              {destinations.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <button style={{marginTop:12, width:'100%', padding:12, borderRadius:8, border:'1px solid #111', background:'#111', color:'#fff'}} onClick={handleCheck}>Check Visa</button>
      </div>

      {result && (
        <div className="card" style={{marginTop:16}}>
          {typeof result === 'string' ? (
            result
          ) : (
            <div>
              <div className={`badge ${result.allowed ? 'green' : 'red'}`}>
                {result.allowed ? '✅ Visa Free / VoA / ETA' : '❌ Visa Required'}
              </div>
              {!result.allowed && (
                <div style={{marginTop:8}}>Fee: ₹{Number(result.fee || 0).toLocaleString('en-IN')} · Processing: {result.processing || '—'}</div>
              )}
              {result.stayLimit && (<div style={{marginTop:4}}>Stay limit: {result.stayLimit} days</div>)}
              {result.acceptanceRate >= 0 && (<div style={{marginTop:4}}>Acceptance rate: {Number(result.acceptanceRate).toFixed(0)}%</div>)}
              {result.documents && (<div style={{marginTop:8}}><strong>Documents usually required:</strong><DocList docs={result.documents} /></div>)}
              {result.notes && (<div style={{marginTop:8, opacity:.8}}>Note: {result.notes}</div>)}
              {result.lastUpdated && (<footer>Last updated: {result.lastUpdated}</footer>)}
            </div>
          )}
        </div>
      )}

      <details style={{marginTop:16, opacity:.85}}>
        <summary>How to add 200+ routes</summary>
        <ol style={{marginLeft:18}}>
          <li>Open <code>public/visa_matrix.csv</code>.</li>
          <li>Add rows using the columns listed in README.</li>
          <li>Deploy – the app reads the CSV on load.</li>
        </ol>
      </details>
    </div>
  );
}
