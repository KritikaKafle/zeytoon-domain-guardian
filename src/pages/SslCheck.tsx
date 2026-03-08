import { useState, ReactNode } from "react";
import { Shield } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { checkSSL } from "@/services/lookup";
import { queryDNS } from "@/services/dns";

const SslCheck = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const [ssl, caaResult] = await Promise.all([
        checkSSL(query),
        queryDNS(query, 'CAA').catch(() => null),
      ]);

      const caaRecords = caaResult?.Answer?.map((a) => a.data).join(', ') || 'No CAA records';

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`SSL/TLS Check — ${query}`}
            items={[
              {
                label: 'HTTPS Accessible',
                value: ssl.accessible ? `Yes (${ssl.responseTime}ms)` : 'No',
                status: ssl.accessible ? 'success' : 'error',
              },
              {
                label: 'TLS Connection',
                value: ssl.accessible ? 'TLS handshake successful' : ssl.error || 'Connection failed',
                status: ssl.accessible ? 'success' : 'error',
              },
            ]}
          />
          <ResultsTable
            title="CAA Records (Certificate Authority Authorization)"
            items={[{
              label: 'CAA',
              value: caaRecords,
              status: caaResult?.Answer?.length ? 'info' : 'warning',
            }]}
          />
          {!ssl.accessible && (
            <ResultsTable
              title="Diagnostics"
              items={[{
                label: 'Error Details',
                value: ssl.error || 'Unknown error — SSL certificate may be invalid or expired',
                status: 'error',
              }]}
            />
          )}
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'SSL check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Shield}
      title="SSL Certificate Check"
      description="Verify SSL certificate validity, HTTPS accessibility, and TLS configuration."
      features={[
        { title: "HTTPS Accessibility", description: "Verifies the domain is accessible over HTTPS." },
        { title: "TLS Handshake", description: "Confirms a successful TLS connection can be established." },
        { title: "CAA Records", description: "Checks Certificate Authority Authorization DNS records." },
        { title: "Response Time", description: "Measures HTTPS response time for performance assessment." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default SslCheck;
