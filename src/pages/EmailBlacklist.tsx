import { useState, ReactNode } from "react";
import { Mail } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { checkDNSBL } from "@/services/lookup";

const EmailBlacklist = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const data = await checkDNSBL(query);
      const listedCount = data.results.filter((r) => r.listed).length;
      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`Blacklist Check — IP: ${data.ip}`}
            items={[
              {
                label: 'Overall Status',
                value: listedCount === 0 ? 'Clean — not listed on any blacklist' : `Listed on ${listedCount} blacklist(s)`,
                status: listedCount === 0 ? 'success' : 'error',
              },
            ]}
          />
          <ResultsTable
            title="Blacklist Results"
            items={data.results.map((r) => ({
              label: r.name,
              value: r.listed ? 'LISTED' : 'Not listed',
              status: r.listed ? 'error' : 'success',
            }))}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Blacklist check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Mail}
      title="Email Blacklist Check"
      description="Check if your email domain or IP is listed on common email blacklists that could impact deliverability."
      placeholder="Enter domain or IP address"
      features={[
        { title: "Spamhaus", description: "Checks against the Spamhaus Block List (SBL) and XBL." },
        { title: "SORBS", description: "Scans the Spam and Open Relay Blocking System." },
        { title: "Barracuda", description: "Checks Barracuda Reputation Block List." },
        { title: "SpamCop", description: "Queries the SpamCop Blocking List." },
        { title: "UCEPROTECT", description: "Checks UCEPROTECT levels 1, 2, and 3." },
        { title: "IP Reputation", description: "Assesses if IP is flagged for spam or malicious activity." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default EmailBlacklist;
