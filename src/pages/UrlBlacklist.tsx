import { useState, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { checkDomainBlacklist } from "@/services/lookup";

const UrlBlacklist = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const data = await checkDomainBlacklist(query);
      const listedCount = data.filter((r) => r.listed).length;
      setResults(
        <div className="space-y-4">
          <ResultsTable
            title="Overall Status"
            items={[{
              label: 'Blacklist Status',
              value: listedCount === 0 ? 'Clean — not found on any blacklist' : `Found on ${listedCount} blacklist(s)`,
              status: listedCount === 0 ? 'success' : 'error',
            }]}
          />
          <ResultsTable
            title="Domain Blacklist Results"
            items={data.map((r) => ({
              label: r.name,
              value: r.listed ? 'LISTED — potential phishing/malware' : 'Not listed',
              status: r.listed ? 'error' : 'success',
            }))}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'URL blacklist check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={AlertTriangle}
      title="URL Blacklist Check"
      description="Scan URLs against malware and phishing databases to detect malicious activity."
      features={[
        { title: "Phishing Detection", description: "Checks domain against phishing blacklists." },
        { title: "Malware URL Check", description: "Checks the domain against malware-related databases." },
        { title: "Spamhaus DBL", description: "Domain Block List for spam-associated domains." },
        { title: "SURBL", description: "Spam URI Realtime Blocklists." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default UrlBlacklist;
