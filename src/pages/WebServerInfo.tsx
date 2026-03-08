import { useState, ReactNode } from "react";
import { Server } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { fetchPageInfo, checkSSL, ipGeolocation } from "@/services/lookup";
import { queryDNS } from "@/services/dns";

const WebServerInfo = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const [pageInfo, ssl, aRecord] = await Promise.all([
        fetchPageInfo(query).catch(() => null),
        checkSSL(query),
        queryDNS(query, 'A').catch(() => null),
      ]);

      const ip = aRecord?.Answer?.[0]?.data || '';

      // Get server location from IP
      let location = null;
      if (ip) {
        try {
          location = await ipGeolocation(ip);
        } catch { /* ignore */ }
      }

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title="Server Overview"
            items={[
              { label: 'IP Address', value: ip || 'N/A', status: 'info' },
              { label: 'HTTPS', value: ssl.accessible ? `Active (${ssl.responseTime}ms)` : 'Not accessible', status: ssl.accessible ? 'success' : 'error' },
              { label: 'HTTP Status', value: pageInfo?.httpCode?.toString() || 'N/A', status: pageInfo?.httpCode === 200 ? 'success' : 'warning' },
              { label: 'Content Type', value: pageInfo?.contentType || 'N/A', status: 'info' },
              { label: 'Response Time', value: pageInfo?.responseTime ? `${pageInfo.responseTime}s` : 'N/A', status: 'info' },
            ]}
          />
          {location && (
            <ResultsTable
              title="Server Location"
              items={[
                { label: 'Country', value: `${location.flag?.emoji || ''} ${location.country || 'N/A'}`.trim(), status: 'info' },
                { label: 'Region', value: location.region || 'N/A', status: 'info' },
                { label: 'City', value: location.city || 'N/A', status: 'info' },
                { label: 'Coordinates', value: location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : 'N/A', status: 'info' },
                { label: 'Timezone', value: location.timezone?.id || 'N/A', status: 'info' },
                { label: 'ISP / Org', value: location.connection?.isp || location.connection?.org || 'N/A', status: 'info' },
                { label: 'ASN', value: location.connection?.asn ? String(location.connection.asn) : 'N/A', status: 'info' },
              ]}
            />
          )}
          {pageInfo?.technologies && pageInfo.technologies.length > 0 && (
            <ResultsTable
              title="Detected Technologies"
              items={pageInfo.technologies.map((tech) => ({
                label: tech,
                value: 'Detected',
                status: 'info' as const,
              }))}
            />
          )}
          {pageInfo?.generator && (
            <ResultsTable
              title="Generator"
              items={[{ label: 'Generator Meta', value: pageInfo.generator, status: 'info' }]}
            />
          )}
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Failed to retrieve server info'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Server}
      title="Web Server Information"
      description="Retrieve HTTP status, detect technology stack, server location, and measure response time."
      features={[
        { title: "Server Location", description: "Geolocates the server IP showing country, city, ISP, and ASN." },
        { title: "HTTP Status", description: "Checks the HTTP response code from the server." },
        { title: "Technology Stack", description: "Detects technologies like React, WordPress, Bootstrap." },
        { title: "Response Time", description: "Measures server response time and overall performance." },
        { title: "Server IP", description: "Resolves the domain's IP address via DNS." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default WebServerInfo;
