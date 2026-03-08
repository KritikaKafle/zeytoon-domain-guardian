export const DOH_SERVERS: Record<string, string> = {
  'Cloudflare (US)': 'https://cloudflare-dns.com/dns-query',
  'Google (US)': 'https://dns.google/resolve',
  'Quad9 (CH)': 'https://dns.quad9.net/dns-query',
  'AdGuard (CY)': 'https://dns.adguard.com/dns-query',
};

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
