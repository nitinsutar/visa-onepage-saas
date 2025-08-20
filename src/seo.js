export function setSEO({ nationality, destination, verdict, fee, processing }) {
  // Update title & description for shareability + SEO
  const title = verdict
    ? `${verdict} — ${nationality} to ${destination} | Visa in 1 Click`
    : `Visa Requirements in 1 Click — Check Visa, Fees & Documents`;
  const desc = verdict
    ? `Visa from ${nationality} to ${destination}: ${verdict}. ${fee ? 'Est. fee ₹' + fee + '.' : ''} ${processing ? 'Processing ' + processing + '.' : ''} Documents listed.`
    : `Instant visa requirement check for travelers. Choose nationality and destination to see visa-free or required, fee, processing time, and documents.`;

  document.title = title;
  setMeta('description', desc);
  setOG('og:title', title);
  setOG('og:description', desc);
  setOG('twitter:title', title);
  setOG('twitter:description', desc);

  // Canonical with parameters for LLMs/search engines
  const url = new URL(window.location.href);
  setCanonical(url.toString());

  // Structured data (WebSite + Dataset)
  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Visa Requirements Dataset',
    description: 'Indicative visa requirements for popular routes, with fees, processing and documents. Verify with official sources.',
    url: window.location.origin + '/visa_matrix.csv',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Visa Requirements in 1 Click',
    url: window.location.origin + '/',
    inLanguage: 'en-IN',
  };
  setJSONLD([website, dataset]);
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
function setOG(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}
function setJSONLD(json) {
  let script = document.getElementById('ld-json');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(json);
}
