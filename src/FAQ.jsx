import React from 'react';

export default function FAQ() {
  const faqs = [
    { q: 'Is this official visa advice?', a: 'No. This tool is informational. Always check the destination’s official immigration or embassy website.' },
    { q: 'Are the fees exact?', a: 'Fees shown are indicative for a typical tourist visa. They can change by embassy, duration, and extras like biometrics.' },
    { q: 'How do I update data?', a: 'Edit public/visa_matrix.csv in your repo and commit. Your site redeploys and users see the latest info.' },
  ];
  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-bold">FAQ</h2>
      <div className="mt-4 divide-y rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        {faqs.map((f, i) => (
          <details key={i} className="group p-5 open:bg-gray-50">
            <summary className="cursor-pointer list-none text-lg font-medium text-gray-800">
              {f.q}
            </summary>
            <p className="mt-2 text-gray-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
