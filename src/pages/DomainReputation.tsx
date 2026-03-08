import { useState, ReactNode } from "react";
import { Star } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { checkDNSBL, checkDomainBlacklist, checkSSL } from "@/services/lookup";
import { checkDNSSEC, queryDNS } from "@/services/dns";

const DomainReputation = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const [ipBL, domainBL, ssl, dnssec, mxRecords] = await Promise.all([
        checkDNSBL(query).catch(() => ({ ip: 'N/A', results: [] })),
        checkDomainBlacklist(query),
        checkSSL(query),
        checkDNSSEC(query),
        queryDNS(query, 'MX').catch(() => null),
      ]);

      const ipListed = ipBL.results.filter((r) => r.listed).length;
      const domainListed = domainBL.filter((r) => r.listed).length;
      const totalListed = ipListed + domainListed;
      const hasMX = !!(mxRecords?.Answer?.length);

      // Reputation score
      let score = 100;
      if (!ssl.accessible) score -= 20;
      if (!dnssec) score -= 10;
      if (totalListed > 0) score -= totalListed * 20;
      if (!hasMX) score -= 5;
      score = Math.max(0, score);

      const rating = score >= 80 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`Domain Reputation: ${score}/100 (${rating})`}
            items={[
              { label: 'Reputation Score', value: `${score}/100`, status: score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error' },
              { label: 'Rating', value: rating, status: score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error' },
              { label: 'HTTPS', value: ssl.accessible ? 'Active' : 'Not accessible', status: ssl.accessible ? 'success' : 'error' },
              { label: 'DNSSEC', value: dnssec ? 'Validated' : 'Not enabled', status: dnssec ? 'success' : 'warning' },
              { label: 'Mail Server', value: hasMX ? 'Configured' : 'No MX records', status: hasMX ? 'success' : 'warning' },
            ]}
          />
          <ResultsTable
            title="IP Blacklist Check"
            items={[
              { label: 'Resolved IP', value: ipBL.ip, status: 'info' },
              ...ipBL.results.map((r) => ({
                label: r.name,
                value: r.listed ? 'LISTED' : 'Clean',
                status: (r.listed ? 'error' : 'success') as const,
              })),
            ]}
          />
          <ResultsTable
            title="Domain Blacklist Check"
            items={domainBL.map((r) => ({
              label: r.name,
              value: r.listed ? 'LISTED' : 'Clean',
              status: r.listed ? 'error' : 'success',
            }))}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Domain reputation check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Star}
      title="Domain Reputation Check"
      description="Analyze the overall reputation of a domain including blacklisting, HTTPS, and security posture."
      features={[
        { title: "Reputation Score", description: "Overall trustworthiness rating based on multiple signals." },
        { title: "IP Blacklist Check", description: "Checks server IP against spam and malicious databases." },
        { title: "Domain Blacklist", description: "Checks domain against URL-based blacklists." },
        { title: "Security Posture", description: "Evaluates HTTPS, DNSSEC, and mail configuration." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default DomainReputation;
