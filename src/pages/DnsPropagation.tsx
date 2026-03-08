import { useState, ReactNode } from "react";
import { Radio } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { checkPropagation } from "@/services/dns";

const DnsPropagation = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const [aResults, mxResults, nsResults] = await Promise.all([
        checkPropagation(query, 'A'),
        checkPropagation(query, 'MX'),
        checkPropagation(query, 'NS'),
      ]);

      const renderTable = (title: string, data: typeof aResults) => (
        <ResultsTable
          title={title}
          items={data.map(({ server, response, error }) => ({
            label: server,
            value: response?.Answer?.length
              ? response.Answer.map((a) => a.data).join(', ')
              : error || 'No records',
            status: response?.Answer?.length ? 'success' : error ? 'error' : 'warning',
          }))}
        />
      );

      setResults(
        <div className="space-y-4">
          {renderTable('A Record Propagation', aResults)}
          {renderTable('MX Record Propagation', mxResults)}
          {renderTable('NS Record Propagation', nsResults)}
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Propagation check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Radio}
      title="DNS Propagation Checker"
      description="Check if your DNS changes have propagated across global DNS servers worldwide."
      placeholder="Enter domain name (e.g., example.com)"
      features={[
        { title: "Global Server Check", description: "Tests DNS resolution from multiple global DNS providers." },
        { title: "A Record Propagation", description: "Tracks IPv4 address propagation across global resolvers." },
        { title: "MX Record Propagation", description: "Verifies mail server record updates across DNS servers." },
        { title: "NS Record Propagation", description: "Checks nameserver changes across global infrastructure." },
        { title: "TTL Analysis", description: "Shows Time-To-Live values to estimate full propagation time." },
        { title: "Real-Time Status", description: "Live status indicators showing propagated vs pending servers." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default DnsPropagation;
