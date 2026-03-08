import { useState, ReactNode } from "react";
import { Radio } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import DnsPropagationMap, { SERVER_COORDINATES } from "@/components/DnsPropagationMap";
import { checkPropagation, REGIONS } from "@/services/dns";

interface PropagationResult {
  server: string;
  region: string;
  response: { Answer?: { data: string }[] } | null;
  error: string | null;
}

const DnsPropagation = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapServers, setMapServers] = useState<{ name: string; coordinates: [number, number]; status: 'success' | 'error' | 'pending' }[]>([]);

  const handleSubmit = async (query: string, recordType?: string) => {
    setLoading(true);
    setResults(null);
    setMapServers([]);
    try {
      const type = recordType || 'A';
      const data: PropagationResult[] = await checkPropagation(query, type);

      // Build map data
      const servers = data.map((d) => ({
        name: d.server,
        coordinates: SERVER_COORDINATES[d.server] || [0, 0],
        status: d.response?.Answer?.length ? 'success' as const : d.error ? 'error' as const : 'pending' as const,
      }));
      setMapServers(servers);

      const groupedResults = REGIONS.map((region) => {
        const regionData = data.filter((d) => d.region === region);
        if (regionData.length === 0) return null;
        return (
          <ResultsTable
            key={region}
            title={region}
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

      setResults(
        <div className="space-y-4">
          <DnsPropagationMap servers={servers} />
          <h3 className="font-display font-bold text-foreground text-lg pt-2">{type} Record Propagation</h3>
          {groupedResults}
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
      showRecordTypeSelector
      features={[
        { title: "Global Coverage", description: "Tests DNS from 14 servers across USA, Canada, Mexico, Europe, Asia, Australia, and Africa." },
        { title: "Interactive Map", description: "Visual world map showing propagation status at each server location." },
        { title: "Record Type Selection", description: "Check A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, and more record types." },
        { title: "Regional Grouping", description: "Results organized by continent for easy comparison." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default DnsPropagation;
