import { useState, ReactNode } from "react";
import { MapPin } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { ipGeolocation } from "@/services/lookup";

const IpGeolocation = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const data = await ipGeolocation(query);
      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`IP Geolocation — ${data.ip}`}
            items={[
              { label: 'IP Address', value: data.ip, status: 'info' },
              { label: 'Type', value: data.type || 'N/A', status: 'info' },
              { label: 'Continent', value: data.continent || 'N/A', status: 'info' },
              { label: 'Country', value: `${data.country} ${data.flag?.emoji || ''}`, status: 'info' },
              { label: 'Region', value: data.region || 'N/A', status: 'info' },
              { label: 'City', value: data.city || 'N/A', status: 'info' },
              { label: 'Postal Code', value: data.postal || 'N/A', status: 'info' },
              { label: 'Latitude', value: data.latitude?.toString() || 'N/A', status: 'info' },
              { label: 'Longitude', value: data.longitude?.toString() || 'N/A', status: 'info' },
              { label: 'Timezone', value: data.timezone?.id || 'N/A', status: 'info' },
            ]}
          />
          <ResultsTable
            title="Network / ASN Information"
            items={[
              { label: 'ISP', value: data.connection?.isp || 'N/A', status: 'info' },
              { label: 'Organization', value: data.connection?.org || 'N/A', status: 'info' },
              { label: 'ASN', value: data.connection?.asn?.toString() || 'N/A', status: 'info' },
              { label: 'ASN Domain', value: data.connection?.domain || 'N/A', status: 'info' },
            ]}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'IP geolocation failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={MapPin}
      title="IP Geolocation & ASN Lookup"
      description="Get geographic location, ASN information, and network details for any IP address."
      placeholder="Enter IP address (e.g., 8.8.8.8)"
      inputLabel="IP Address"
      features={[
        { title: "IP Geolocation", description: "Country, city, and ISP provider for the IP address." },
        { title: "ASN Lookup", description: "Identifies the Autonomous System Number and network provider." },
        { title: "Network Info", description: "ISP, organization, and domain details for the IP." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default IpGeolocation;
