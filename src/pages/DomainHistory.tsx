import { useState, ReactNode } from "react";
import { History } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { whoisLookup, parseRDAP } from "@/services/lookup";

const DomainHistory = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const raw = await whoisLookup(query);
      const data = parseRDAP(raw);

      // Calculate domain age
      let ageStr = 'Unknown';
      if (data.created && data.created !== 'N/A') {
        const created = new Date(data.created);
        const now = new Date();
        const years = Math.floor((now.getTime() - created.getTime()) / (365.25 * 86400000));
        const months = Math.floor(((now.getTime() - created.getTime()) % (365.25 * 86400000)) / (30 * 86400000));
        ageStr = `${years} years, ${months} months`;
      }

      // Days until expiry
      let expiryStr = 'Unknown';
      let expiryStatus: 'success' | 'warning' | 'error' = 'info' as any;
      if (data.expires && data.expires !== 'N/A') {
        const expires = new Date(data.expires);
        const daysLeft = Math.floor((expires.getTime() - Date.now()) / 86400000);
        expiryStr = `${daysLeft} days remaining`;
        expiryStatus = daysLeft > 90 ? 'success' : daysLeft > 30 ? 'warning' : 'error';
      }

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`Domain History — ${data.domainName}`}
            items={[
              { label: 'Domain Age', value: ageStr, status: 'info' },
              { label: 'Created', value: data.created !== 'N/A' ? new Date(data.created).toLocaleDateString() : 'N/A', status: 'info' },
              { label: 'Expires', value: data.expires !== 'N/A' ? new Date(data.expires).toLocaleDateString() : 'N/A', status: expiryStatus },
              { label: 'Time Until Expiry', value: expiryStr, status: expiryStatus },
              { label: 'Last Changed', value: data.lastChanged !== 'N/A' ? new Date(data.lastChanged).toLocaleDateString() : 'N/A', status: 'info' },
            ]}
          />
          <ResultsTable
            title="Registration Details"
            items={[
              { label: 'Registrar', value: data.registrar, status: 'info' },
              { label: 'Status', value: data.status, status: 'info' },
              { label: 'Name Servers', value: data.nameservers, status: 'info' },
            ]}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Domain history check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={History}
      title="Domain History Check"
      description="Check domain age, registration dates, and WHOIS registration details."
      features={[
        { title: "Domain Age", description: "How long the domain has existed — indicates trustworthiness." },
        { title: "Registration Dates", description: "Creation, expiration, and last modification dates." },
        { title: "Expiry Warning", description: "Alerts if domain is expiring soon." },
        { title: "Registrar Info", description: "Current registrar and name server details." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default DomainHistory;
