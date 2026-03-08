import { DNS_SERVERS, REGIONS } from './dns-servers';
export { DNS_SERVERS, REGIONS };

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
  serverUrl: string = 'https://cloudflare-dns.com/dns-query'
): Promise<DNSResponse> {
  const res = await fetch(`${serverUrl}?name=${encodeURIComponent(domain)}&type=${type}`, {
    headers: { Accept: 'application/dns-json' },
    signal: AbortSignal.timeout(10000),
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
  const results = await Promise.allSettled(
    DNS_SERVERS.map((server) => queryDNS(domain, type, server.dohUrl))
  );
  return DNS_SERVERS.map((server, i) => ({
    server: server.name,
    provider: server.provider,
    ip: server.ip,
    country: server.country,
    flag: server.flag,
    region: server.region,
    coordinates: server.coordinates,
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
