import { useState, ReactNode } from "react";
import { Radio } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { checkPropagation, REGIONS } from "@/services/dns";

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

      const renderByRegion = (title: string, data: typeof aResults) => {
        return REGIONS.map((region) => {
          const regionData = data.filter((d) => d.region === region);
          if (regionData.length === 0) return null;
          return (
            <ResultsTable
              key={`${title}-${region}`}
              title={`${title} — ${region}`}
              items={regionData.map(({ server, response, error }) => ({
                label: server,
                value: response?.Answer?.length
                  ? response.Answer.map((a) => a.data).join(', ')
                  : error || 'No records',
                status: response?.Answer?.length ? 'success' : error ? 'error' : 'warning',
              }))}
            />
          );
        });
      };

      setResults(
        <div className="space-y-4">
          <h3 className="font-display font-bold text-foreground text-lg">A Record Propagation</h3>
          {renderByRegion('A Records', aResults)}
          <h3 className="font-display font-bold text-foreground text-lg pt-4">MX Record Propagation</h3>
          {renderByRegion('MX Records', mxResults)}
          <h3 className="font-display font-bold text-foreground text-lg pt-4">NS Record Propagation</h3>
          {renderByRegion('NS Records', nsResults)}
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
      description="Check if your DNS changes have propagated across global DNS servers in North America, Europe, Asia, Oceania, and Africa."
      placeholder="Enter domain name (e.g., example.com)"
      features={[
        { title: "Global Coverage", description: "Tests DNS from 14 servers across USA, Canada, Mexico, Europe, Asia, Australia, and Africa." },
        { title: "A Record Propagation", description: "Tracks IPv4 address propagation across all global resolvers." },
        { title: "MX Record Propagation", description: "Verifies mail server record updates worldwide." },
        { title: "NS Record Propagation", description: "Checks nameserver changes across global infrastructure." },
        { title: "Regional Grouping", description: "Results organized by continent for easy comparison." },
        { title: "Real-Time Status", description: "Live status indicators showing propagated vs pending servers." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default DnsPropagation;
