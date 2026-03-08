// Central DNS server configuration
export interface DNSServer {
  name: string;
  provider: string;
  ip: string;
  country: string;
  flag: string;
  region: string;
  coordinates: [number, number]; // [longitude, latitude]
  dohUrl: string; // DoH endpoint to query through
}

export const DNS_SERVERS: DNSServer[] = [
  // North America
  { name: 'OpenDNS', provider: 'OpenDNS', ip: '208.67.222.220', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-122.4, 37.8], dohUrl: 'https://doh.opendns.com/dns-query' },
  { name: 'Google', provider: 'Google', ip: '8.8.8.8', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-122.1, 37.4], dohUrl: 'https://dns.google/resolve' },
  { name: 'Quad9', provider: 'Quad9', ip: '9.9.9.9', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-87.6, 41.9], dohUrl: 'https://dns.quad9.net/dns-query' },
  { name: 'WholeSale Internet', provider: 'WholeSale Internet, Inc.', ip: '204.12.225.227', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-94.6, 39.1], dohUrl: 'https://dns.google/resolve' },
  { name: 'Quad9 (2)', provider: 'Quad9', ip: '149.112.112.112', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-96.8, 32.8], dohUrl: 'https://dns.quad9.net/dns-query' },
  { name: 'CenturyLink', provider: 'CenturyLink', ip: '205.171.202.66', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-104.9, 39.7], dohUrl: 'https://dns.google/resolve' },
  { name: 'CleanBrowsing', provider: 'Daniel Cid', ip: '185.228.169.9', country: 'United States', flag: '🇺🇸', region: 'North America', coordinates: [-77.0, 38.9], dohUrl: 'https://doh.cleanbrowsing.org/doh/security-filter/' },
  { name: 'Fortinet', provider: 'Fortinet Inc', ip: '208.91.112.53', country: 'Canada', flag: '🇨🇦', region: 'North America', coordinates: [-75.7, 45.4], dohUrl: 'https://dns.google/resolve' },
  { name: 'Universidad LA', provider: 'Universidad LatinoAmericana S.C.', ip: '200.33.3.123', country: 'Mexico', flag: '🇲🇽', region: 'North America', coordinates: [-99.1, 19.4], dohUrl: 'https://dns.google/resolve' },

  // South America
  { name: 'Claro S.A', provider: 'Claro S.A', ip: '200.248.178.54', country: 'Brazil', flag: '🇧🇷', region: 'South America', coordinates: [-46.6, -23.5], dohUrl: 'https://dns.google/resolve' },

  // Europe
  { name: 'YANDEX', provider: 'YANDEX LLC', ip: '77.88.8.8', country: 'Russia', flag: '🇷🇺', region: 'Europe', coordinates: [37.6, 55.8], dohUrl: 'https://common.dot.dns.yandex.net/dns-query' },
  { name: 'OpenTLD', provider: 'OpenTLD BV', ip: '80.80.80.80', country: 'Netherlands', flag: '🇳🇱', region: 'Europe', coordinates: [4.9, 52.4], dohUrl: 'https://dns.google/resolve' },
  { name: 'Completel', provider: 'Completel SAS', ip: '83.145.86.7', country: 'France', flag: '🇫🇷', region: 'Europe', coordinates: [2.3, 48.9], dohUrl: 'https://dns.google/resolve' },
  { name: 'ServiHosting', provider: 'ServiHosting Networks S.L.', ip: '84.236.142.130', country: 'Spain', flag: '🇪🇸', region: 'Europe', coordinates: [-3.7, 40.4], dohUrl: 'https://dns.google/resolve' },
  { name: 'nemox.net', provider: 'nemox.net', ip: '83.137.41.9', country: 'Austria', flag: '🇦🇹', region: 'Europe', coordinates: [16.4, 48.2], dohUrl: 'https://dns.google/resolve' },
  { name: 'Wavenet', provider: 'Wavenet Limited', ip: '31.192.98.158', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', coordinates: [-0.1, 51.5], dohUrl: 'https://dns.google/resolve' },
  { name: 'Uni Leipzig', provider: 'Universitaet Leipzig', ip: '139.18.25.33', country: 'Germany', flag: '🇩🇪', region: 'Europe', coordinates: [12.4, 51.3], dohUrl: 'https://dns.google/resolve' },
  { name: 'Indigo', provider: 'Indigo', ip: '194.125.133.10', country: 'Ireland', flag: '🇮🇪', region: 'Europe', coordinates: [-6.3, 53.3], dohUrl: 'https://dns.google/resolve' },

  // Africa
  { name: 'Liquid Telecom', provider: 'Liquid Telecommunications Ltd', ip: '5.11.11.5', country: 'South Africa', flag: '🇿🇦', region: 'Africa', coordinates: [28.0, -26.2], dohUrl: 'https://dns.google/resolve' },

  // Asia
  { name: 'DigitalOcean', provider: 'DigitalOcean LLC', ip: '139.59.219.245', country: 'Singapore', flag: '🇸🇬', region: 'Asia', coordinates: [103.8, 1.3], dohUrl: 'https://dns.google/resolve' },
  { name: 'SK Telecom', provider: 'SK Telecom', ip: '203.236.1.12', country: 'South Korea', flag: '🇰🇷', region: 'Asia', coordinates: [127.0, 37.6], dohUrl: 'https://dns.google/resolve' },
  { name: 'AliDNS', provider: 'Aliyun Computing Co. Ltd', ip: '223.5.5.5', country: 'China', flag: '🇨🇳', region: 'Asia', coordinates: [121.5, 31.2], dohUrl: 'https://dns.alidns.com/dns-query' },
  { name: 'Teknet', provider: 'Teknet Yazlim', ip: '31.7.37.37', country: 'Turkey', flag: '🇹🇷', region: 'Asia', coordinates: [28.9, 41.0], dohUrl: 'https://dns.google/resolve' },
  { name: 'Skylink', provider: 'Skylink Fibernet Private Limited', ip: '103.99.150.10', country: 'India', flag: '🇮🇳', region: 'Asia', coordinates: [77.2, 28.6], dohUrl: 'https://dns.google/resolve' },
  { name: 'CMPak', provider: 'CMPak Limited', ip: '209.150.154.1', country: 'Pakistan', flag: '🇵🇰', region: 'Asia', coordinates: [73.0, 33.7], dohUrl: 'https://dns.google/resolve' },
  { name: 'Md Masud Rana', provider: 'Md Masud Rana Roni', ip: '103.157.237.34', country: 'Bangladesh', flag: '🇧🇩', region: 'Asia', coordinates: [90.4, 23.8], dohUrl: 'https://dns.google/resolve' },

  // Oceania
  { name: 'Cloudflare', provider: 'Cloudflare Inc', ip: '1.1.1.1', country: 'Australia', flag: '🇦🇺', region: 'Oceania', coordinates: [151.2, -33.9], dohUrl: 'https://cloudflare-dns.com/dns-query' },
  { name: 'Telstra', provider: 'Telstra Internet', ip: '139.130.4.4', country: 'Australia', flag: '🇦🇺', region: 'Oceania', coordinates: [144.9, -37.8], dohUrl: 'https://dns.google/resolve' },
];

export const REGIONS = ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania'] as const;
