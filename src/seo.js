export function setSEO({ nationality, destination, verdict, fee, processing }) {
  const title = verdict ? `${verdict} — ${nationality} to ${destination} | Visa in 1 Click` : `Visa Requirements in 1 Click — Check Visa, Fees & Documents`;
  const desc = verdict ? `Visa from ${nationality} to ${destination}: ${verdict}. ${fee ? 'Est. fee ' + fee + '.' : ''} ${processing ? 'Processing ' + processing + '.' : ''} Documents listed.` : `Instant visa requirement check for travelers.`;
  document.title = title; setMeta('description', desc);
  setOG('og:title', title); setOG('og:description', desc);
  setOG('twitter:title', title); setOG('twitter:description', desc);
  const url = new URL(window.location.href); setCanonical(url.toString());
}
function setMeta(name, content) { let el = document.querySelector(`meta[name="${name}"]`); if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el);} el.setAttribute('content', content); }
function setOG(property, content) { let el = document.querySelector(`meta[property="${property}"]`); if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el);} el.setAttribute('content', content); }
function setCanonical(href) { let link = document.querySelector('link[rel="canonical"]'); if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link);} link.setAttribute('href', href); }
