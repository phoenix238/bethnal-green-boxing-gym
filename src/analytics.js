// Public site token only. Disabled locally and until explicitly configured.
export function initAnalytics({ token = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN ?? '', production = import.meta.env.PROD, doc = document } = {}) {
  token = token.trim();
  if (!production || !/^[a-f0-9]{32}$/i.test(token)) return false;
  if (doc.querySelector('script[src*="cloudflareinsights.com/beacon.min.js"], script[data-cf-beacon]')) return false;
  const script = doc.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.dataset.cfBeacon = JSON.stringify({ token });
  doc.head.appendChild(script);
  return true;
}
