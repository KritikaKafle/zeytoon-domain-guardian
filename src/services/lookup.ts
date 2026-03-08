import { queryDNS } from './dns';

// WHOIS via RDAP
export async function whoisLookup(domain: string) {
  const res = await fetch(`https://rdap.org/domain/${domain}`, {
    headers: { Accept: 'application/rdap+json' },
  });
  if (!res.ok) throw new Error('WHOIS lookup failed — domain may not exist or RDAP is unavailable');
  return res.json();
}

export function parseRDAP(data: any) {
  const events = data.events || [];
  const getEvent = (action: string) => events.find((e: any) => e.eventAction === action)?.eventDate || 'N/A';
  const nameservers = (data.nameservers || []).map((ns: any) => ns.ldhName).join(', ') || 'N/A';
  const status = (data.status || []).join(', ') || 'N/A';
  const entities = data.entities || [];
  const registrar = entities.find((e: any) => e.roles?.includes('registrar'));
  const registrarName = registrar?.vcardArray?.[1]?.find((v: any) => v[0] === 'fn')?.[3] || registrar?.handle || 'N/A';

  return {
    domainName: data.ldhName || 'N/A',
    status,
    registrar: registrarName,
    created: getEvent('registration'),
    expires: getEvent('expiration'),
    lastChanged: getEvent('last changed'),
    nameservers,
  };
}

// IP Geolocation
export async function ipGeolocation(ip: string) {
  // Try ipapi.co first (HTTPS, no key needed, 1k/day)
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      if (!data.error) {
        return {
          ip: data.ip,
          type: data.version || null,
          continent: data.continent_code || null,
          country: data.country_name,
          flag: { emoji: '' },
          region: data.region,
          city: data.city,
          postal: data.postal,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: { id: data.timezone || '' },
          connection: {
            isp: data.org || null,
            org: data.org || null,
            asn: data.asn || null,
            domain: null,
          },
        };
      }
    }
  } catch { /* fall through to backup */ }

  // Fallback: ipwho.is
  const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('IP lookup failed');
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'IP lookup failed');
  return {
    ip: data.ip,
    type: data.type || null,
    continent: data.continent || null,
    country: data.country,
    flag: { emoji: data.flag?.emoji || '' },
    region: data.region,
    city: data.city,
    postal: data.postal,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: { id: data.timezone?.id || '' },
    connection: {
      isp: data.connection?.isp || null,
      org: data.connection?.org || null,
      asn: data.connection?.asn || null,
      domain: data.connection?.domain || null,
    },
  };
}

// Email format validation
export function validateEmailFormat(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'yopmail.com',
  'sharklasers.com', 'grr.la', 'dispostable.com', 'mailnesia.com',
  'trashmail.com', 'fakeinbox.com', 'mailcatch.com', 'throwaway.email',
  'temp-mail.org', 'guerrillamailblock.com', 'tempail.com', 'maildrop.cc',
  'harakirimail.com', 'guerrillamail.info', 'guerrillamail.net',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
}

// DNSBL check
export async function checkDNSBL(ipOrDomain: string) {
  const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipOrDomain);
  let ip = ipOrDomain;

  if (!isIP) {
    try {
      const dns = await queryDNS(ipOrDomain, 'A');
      ip = dns.Answer?.[0]?.data || '';
    } catch {
      throw new Error('Could not resolve domain to IP');
    }
  }

  if (!ip) throw new Error('No IP address found');

  const reversed = ip.split('.').reverse().join('.');
  const dnsbls = [
    { name: 'Spamhaus ZEN', zone: 'zen.spamhaus.org' },
    { name: 'Barracuda', zone: 'b.barracudacentral.org' },
    { name: 'SpamCop', zone: 'bl.spamcop.net' },
    { name: 'SORBS', zone: 'dnsbl.sorbs.net' },
    { name: 'UCEPROTECT-1', zone: 'dnsbl-1.uceprotect.net' },
  ];

  const results = await Promise.allSettled(
    dnsbls.map((bl) => queryDNS(`${reversed}.${bl.zone}`, 'A'))
  );

  return {
    ip,
    results: dnsbls.map((bl, i) => ({
      name: bl.name,
      listed: results[i].status === 'fulfilled' &&
        !!(results[i] as PromiseFulfilledResult<any>).value.Answer?.length,
    })),
  };
}

// Domain blacklist check (domain-based)
export async function checkDomainBlacklist(domain: string) {
  const bls = [
    { name: 'Spamhaus DBL', zone: 'dbl.spamhaus.org' },
    { name: 'SURBL', zone: 'multi.surbl.org' },
    { name: 'URIBL', zone: 'multi.uribl.com' },
  ];

  const results = await Promise.allSettled(
    bls.map((bl) => queryDNS(`${domain}.${bl.zone}`, 'A'))
  );

  return bls.map((bl, i) => ({
    name: bl.name,
    listed: results[i].status === 'fulfilled' &&
      !!(results[i] as PromiseFulfilledResult<any>).value.Answer?.length,
  }));
}

// SSL basic check
export async function checkSSL(domain: string) {
  try {
    const start = performance.now();
    await fetch(`https://${domain}`, { mode: 'no-cors', signal: AbortSignal.timeout(10000) });
    const time = performance.now() - start;
    return { accessible: true, responseTime: Math.round(time), error: null };
  } catch (e: any) {
    return { accessible: false, responseTime: 0, error: e.message };
  }
}

// Fetch page info via CORS proxy
export async function fetchPageInfo(domain: string) {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://${domain}`)}`;
  const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error('Failed to fetch page');
  const data = await res.json();
  const html: string = data.contents || '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const getMeta = (name: string) =>
    doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
    doc.querySelector(`meta[property="${name}"]`)?.getAttribute('content') || '';

  const scripts = Array.from(doc.querySelectorAll('script[src]')).map((s) => s.getAttribute('src') || '');
  const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map((l) => l.getAttribute('href') || '');
  const allSrcs = [...scripts, ...links, html.slice(0, 5000)].join(' ').toLowerCase();

  const technologies: string[] = [];
  if (allSrcs.includes('wp-content') || allSrcs.includes('wp-includes')) technologies.push('WordPress');
  if (allSrcs.includes('react')) technologies.push('React');
  if (allSrcs.includes('vue')) technologies.push('Vue.js');
  if (allSrcs.includes('angular')) technologies.push('Angular');
  if (allSrcs.includes('jquery')) technologies.push('jQuery');
  if (allSrcs.includes('bootstrap')) technologies.push('Bootstrap');
  if (allSrcs.includes('tailwind')) technologies.push('Tailwind CSS');
  if (allSrcs.includes('next')) technologies.push('Next.js');

  return {
    title: doc.querySelector('title')?.textContent || '',
    metaDescription: getMeta('description'),
    metaKeywords: getMeta('keywords'),
    viewport: getMeta('viewport'),
    generator: getMeta('generator'),
    ogTitle: getMeta('og:title'),
    ogDescription: getMeta('og:description'),
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
    cspMeta: doc.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content') || '',
    h1Count: doc.querySelectorAll('h1').length,
    imgWithoutAlt: doc.querySelectorAll('img:not([alt])').length,
    totalImages: doc.querySelectorAll('img').length,
    totalLinks: doc.querySelectorAll('a').length,
    technologies,
    httpCode: data.status?.http_code,
    contentType: data.status?.content_type,
    responseTime: data.status?.response_time,
  };
}
