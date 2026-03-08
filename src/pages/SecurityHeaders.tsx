import { useState, ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { fetchPageInfo, checkSSL } from "@/services/lookup";
import { queryDNS, checkDNSSEC } from "@/services/dns";

const SecurityHeaders = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const [pageInfo, ssl, dnssec, txtRecords] = await Promise.all([
        fetchPageInfo(query).catch(() => null),
        checkSSL(query),
        checkDNSSEC(query),
        queryDNS(query, 'TXT').catch(() => null),
      ]);

      const txtData = txtRecords?.Answer?.map((a) => a.data) || [];
      const hasCSP = !!pageInfo?.cspMeta;
      const hasSPF = txtData.some((t) => t.includes('v=spf1'));
      const hasDMARC = false; // Would need _dmarc.domain check
      const hasDKIM = txtData.some((t) => t.includes('DKIM'));

      // Check _dmarc
      let dmarcFound = false;
      try {
        const dmarc = await queryDNS(`_dmarc.${query}`, 'TXT');
        dmarcFound = !!(dmarc?.Answer?.length);
      } catch {}

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title="Security Overview"
            items={[
              { label: 'HTTPS/TLS', value: ssl.accessible ? 'Active' : 'Not accessible', status: ssl.accessible ? 'success' : 'error' },
              { label: 'DNSSEC', value: dnssec ? 'Validated' : 'Not validated', status: dnssec ? 'success' : 'warning' },
              { label: 'CSP (Meta Tag)', value: hasCSP ? 'Present' : 'Not found', status: hasCSP ? 'success' : 'warning' },
            ]}
          />
          <ResultsTable
            title="Email Security (DNS)"
            items={[
              { label: 'SPF Record', value: hasSPF ? 'Found' : 'Not found', status: hasSPF ? 'success' : 'warning' },
              { label: 'DMARC Record', value: dmarcFound ? 'Found' : 'Not found', status: dmarcFound ? 'success' : 'warning' },
              { label: 'DKIM Indicator', value: hasDKIM ? 'Found in TXT' : 'Not detected in root TXT', status: hasDKIM ? 'success' : 'info' },
            ]}
          />
          <ResultsTable
            title="Note"
            items={[{
              label: 'HTTP Headers',
              value: 'HSTS, X-Frame-Options, X-Content-Type-Options headers require server-side inspection. DNS and meta-tag based checks shown above.',
              status: 'info',
            }]}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Security headers check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={ShieldCheck}
      title="Security Headers Check"
      description="Analyze your domain's security configuration including HTTPS, DNSSEC, and email security."
      features={[
        { title: "HTTPS/TLS", description: "Verifies HTTPS is accessible and TLS is configured." },
        { title: "DNSSEC", description: "Checks if DNS records are authenticated." },
        { title: "SPF Record", description: "Validates Sender Policy Framework for email security." },
        { title: "DMARC", description: "Checks Domain-based Message Authentication." },
        { title: "Content-Security-Policy", description: "Checks for CSP meta tags in the page." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default SecurityHeaders;
