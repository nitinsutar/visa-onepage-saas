import React from 'react';
export default function FAQ() {
  const faqs = [
    { q: 'Is this official visa advice?', a: 'No. This tool is informational. Always check the destination’s official immigration or embassy website.' },
    { q: 'Are the fees exact?', a: 'Fees shown are indicative for a typical tourist visa and can change by embassy, duration, and biometrics.' }
  ];
  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-bold">FAQ</h2>
      <div className="mt-4 divide-y rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        {faqs.map((f, i) => (
          <details key={i} className="group p-5 open:bg-gray-50">
            <summary className="cursor-pointer list-none text-lg font-medium text-gray-800">{f.q}</summary>
            <p className="mt-2 text-gray-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
