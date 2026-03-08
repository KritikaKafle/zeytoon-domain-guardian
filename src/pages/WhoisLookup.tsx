import { useState, ReactNode } from "react";
import { Search } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { whoisLookup, parseRDAP } from "@/services/lookup";

const WhoisLookup = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const raw = await whoisLookup(query);
      const data = parseRDAP(raw);
      setResults(
        <ResultsTable
          title={`WHOIS — ${data.domainName}`}
          items={[
            { label: 'Domain Name', value: data.domainName, status: 'info' },
            { label: 'Status', value: data.status, status: 'info' },
            { label: 'Registrar', value: data.registrar, status: 'info' },
            { label: 'Created', value: data.created !== 'N/A' ? new Date(data.created).toLocaleDateString() : 'N/A', status: 'info' },
            { label: 'Expires', value: data.expires !== 'N/A' ? new Date(data.expires).toLocaleDateString() : 'N/A', status: data.expires !== 'N/A' && new Date(data.expires) < new Date(Date.now() + 30 * 86400000) ? 'warning' : 'success' },
            { label: 'Last Changed', value: data.lastChanged !== 'N/A' ? new Date(data.lastChanged).toLocaleDateString() : 'N/A', status: 'info' },
            { label: 'Name Servers', value: data.nameservers, status: 'info' },
          ]}
        />
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'WHOIS lookup failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Search}
      title="WHOIS Lookup"
      description="Get detailed domain registration information including registrant, registrar, and contact details."
      features={[
        { title: "Domain Registrant", description: "Identifies the individual or organization that owns the domain." },
        { title: "Registrar Information", description: "The company managing the domain registration." },
        { title: "Creation & Expiry Dates", description: "When the domain was registered and when it expires." },
        { title: "Name Servers", description: "Lists the authoritative DNS servers for the domain." },
        { title: "Contact Information", description: "Administrative, technical, and billing contact details." },
        { title: "Domain Status", description: "Shows if the domain is locked, transferred, or in redemption." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default WhoisLookup;
