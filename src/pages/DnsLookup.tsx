import { useState, ReactNode } from "react";
import { Globe } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { fullDNSLookup, checkDNSSEC } from "@/services/dns";

const DNS_TYPE_NAMES: Record<string, string> = {
  A: 'IPv4 Address', AAAA: 'IPv6 Address', MX: 'Mail Exchange',
  CNAME: 'Canonical Name', NS: 'Name Server', TXT: 'Text Record', SOA: 'Start of Authority',
};

const DnsLookup = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const [data, dnssec] = await Promise.all([fullDNSLookup(query), checkDNSSEC(query)]);
      setResults(
        <div className="space-y-4">
          {data.map(({ type, response, error }) => (
            <ResultsTable
              key={type}
              title={`${type} — ${DNS_TYPE_NAMES[type] || type}`}
              items={
                response?.Answer?.length
                  ? response.Answer.map((a) => ({
                      label: a.name,
                      value: `${a.data}  (TTL: ${a.TTL}s)`,
                      status: 'success' as const,
                    }))
                  : [{ label: type, value: error || 'No records found', status: 'warning' as const }]
              }
            />
          ))}
          <ResultsTable
            title="DNSSEC Validation"
            items={[{
              label: 'DNSSEC',
              value: dnssec ? 'Authenticated (AD flag set)' : 'Not validated or not supported',
              status: dnssec ? 'success' : 'warning',
            }]}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'DNS lookup failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Globe}
      title="DNS Lookup"
      description="Query DNS records for any domain. Retrieve A, AAAA, MX, CNAME, NS, TXT, PTR, and SOA records."
      placeholder="Enter domain name (e.g., example.com)"
      features={[
        { title: "A Record", description: "Maps domain to an IPv4 address." },
        { title: "AAAA Record", description: "Maps domain to an IPv6 address." },
        { title: "MX Record", description: "Defines mail exchange servers for email delivery." },
        { title: "CNAME Record", description: "Alias that points one domain name to another." },
        { title: "NS Record", description: "Nameserver records for the domain." },
        { title: "TXT Record", description: "Additional info like SPF, DKIM, and DMARC records." },
        { title: "SOA Record", description: "Start of Authority — specifies the primary DNS server." },
        { title: "DNSSEC Validation", description: "Validates DNS record authenticity to prevent MITM attacks." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default DnsLookup;
