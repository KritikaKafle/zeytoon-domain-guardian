import { useState, ReactNode } from "react";
import { Lock } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { fetchPageInfo } from "@/services/lookup";

const CspCheck = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const pageInfo = await fetchPageInfo(query);
      const hasCSP = !!pageInfo.cspMeta;

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`CSP Check — ${query}`}
            items={[
              {
                label: 'CSP Meta Tag',
                value: hasCSP ? 'Found' : 'Not found in HTML meta tags',
                status: hasCSP ? 'success' : 'warning',
              },
              ...(hasCSP ? [{
                label: 'Policy Content',
                value: pageInfo.cspMeta,
                status: 'info' as const,
              }] : []),
            ]}
          />
          <ResultsTable
            title="Note"
            items={[{
              label: 'CSP Header',
              value: 'HTTP header-based CSP cannot be checked client-side. This checks only the meta tag. For full analysis, check server-side.',
              status: 'info',
            }]}
          />
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'CSP check failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={Lock}
      title="Content Security Policy Check"
      description="Analyze your domain's CSP configuration to prevent XSS and injection attacks."
      features={[
        { title: "CSP Meta Tag", description: "Checks for Content-Security-Policy meta tags in the HTML." },
        { title: "Policy Analysis", description: "Displays the CSP policy content for review." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default CspCheck;
