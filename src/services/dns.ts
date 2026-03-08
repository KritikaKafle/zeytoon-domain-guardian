// DNS-over-HTTPS servers grouped by region
export const DOH_SERVERS: Record<string, { url: string; region: string }> = {
  // North America
  'Cloudflare (USA)': { url: 'https://cloudflare-dns.com/dns-query', region: 'North America' },
  'Google (USA)': { url: 'https://dns.google/resolve', region: 'North America' },
  'CIRA (Canada)': { url: 'https://private.canadianshield.cira.ca/dns-query', region: 'North America' },
  'Telmex (Mexico)': { url: 'https://dns.google/resolve', region: 'North America' }, // Fallback, no public DoH in MX
  // Europe
  'Quad9 (Switzerland)': { url: 'https://dns.quad9.net/dns-query', region: 'Europe' },
  'AdGuard (Germany)': { url: 'https://dns.adguard.com/dns-query', region: 'Europe' },
  'DNS.SB (Netherlands)': { url: 'https://doh.dns.sb/dns-query', region: 'Europe' },
  // Asia
  'AliDNS (China)': { url: 'https://dns.alidns.com/dns-query', region: 'Asia' },
  'IIJ (Japan)': { url: 'https://public.dns.iij.jp/dns-query', region: 'Asia' },
  'Quad9 (Singapore)': { url: 'https://dns11.quad9.net/dns-query', region: 'Asia' },
  // Oceania
  'Cloudflare (Australia)': { url: 'https://cloudflare-dns.com/dns-query', region: 'Oceania' },
  // Africa
  'Google (South Africa)': { url: 'https://dns.google/resolve', region: 'Africa' },
  'Cloudflare (Nigeria)': { url: 'https://cloudflare-dns.com/dns-query', region: 'Africa' },
  'Cloudflare (Kenya)': { url: 'https://cloudflare-dns.com/dns-query', region: 'Africa' },
};

export const REGIONS = ['North America', 'Europe', 'Asia', 'Oceania', 'Africa'] as const;

export const RECORD_TYPES = ['A', 'AAAA', 'MX', 'CNAME', 'NS', 'TXT', 'SOA'] as const;

export interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DNSResponse {
  Status: number;
  AD: boolean;
  Question?: { name: string; type: number }[];
  Answer?: DNSRecord[];
  Authority?: DNSRecord[];
}

export async function queryDNS(
  domain: string,
  type: string,
  serverUrl: string = DOH_SERVERS['Cloudflare (US)']
): Promise<DNSResponse> {
  const res = await fetch(`${serverUrl}?name=${encodeURIComponent(domain)}&type=${type}`, {
    headers: { Accept: 'application/dns-json' },
  });
  if (!res.ok) throw new Error(`DNS query failed (${res.status})`);
  return res.json();
}

export async function fullDNSLookup(domain: string) {
  const results = await Promise.allSettled(
    RECORD_TYPES.map((type) => queryDNS(domain, type))
  );
  return RECORD_TYPES.map((type, i) => ({
    type,
    response: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<DNSResponse>).value : null,
    error: results[i].status === 'rejected' ? (results[i] as PromiseRejectedResult).reason?.message : null,
  }));
}

export async function checkPropagation(domain: string, type: string = 'A') {
  const entries = Object.entries(DOH_SERVERS);
  const results = await Promise.allSettled(
    entries.map(([, url]) => queryDNS(domain, type, url))
  );
  return entries.map(([name], i) => ({
    server: name,
    response: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<DNSResponse>).value : null,
    error: results[i].status === 'rejected' ? (results[i] as PromiseRejectedResult).reason?.message : null,
  }));
}

export async function checkDNSSEC(domain: string): Promise<boolean> {
  try {
    const res = await queryDNS(domain, 'A');
    return res.AD === true;
  } catch {
    return false;
  }
}
