import { useState, ReactNode } from "react";
import { AtSign } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { validateEmailFormat, isDisposableEmail } from "@/services/lookup";
import { queryDNS } from "@/services/dns";

const EmailValidation = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const formatValid = validateEmailFormat(query);
      const domain = query.split('@')[1];
      const disposable = isDisposableEmail(query);

      let mxValid = false;
      let domainValid = false;
      let mxRecords: string[] = [];

      if (domain) {
        const [mxResult, aResult] = await Promise.all([
          queryDNS(domain, 'MX').catch(() => null),
          queryDNS(domain, 'A').catch(() => null),
        ]);
        mxValid = !!(mxResult?.Answer?.length);
        domainValid = !!(aResult?.Answer?.length);
        mxRecords = mxResult?.Answer?.map((a) => a.data) || [];
      }

      const overallValid = formatValid && domainValid && mxValid && !disposable;

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title={`Email Validation — ${query}`}
            items={[
              { label: 'Overall', value: overallValid ? 'Valid email address' : 'Issues detected', status: overallValid ? 'success' : 'warning' },
              { label: 'Format Check', value: formatValid ? 'Valid format' : 'Invalid format', status: formatValid ? 'success' : 'error' },
              { label: 'Domain Exists', value: domainValid ? `${domain} resolves` : `${domain || 'N/A'} not found`, status: domainValid ? 'success' : 'error' },
              { label: 'MX Records', value: mxValid ? `${mxRecords.length} mail server(s)` : 'No MX records', status: mxValid ? 'success' : 'error' },
              { label: 'Disposable Email', value: disposable ? 'Disposable/temporary provider detected' : 'Not a disposable provider', status: disposable ? 'warning' : 'success' },
            ]}
          />
          {mxRecords.length > 0 && (
            <ResultsTable
              title="Mail Servers"
              items={mxRecords.map((mx) => ({ label: 'MX', value: mx, status: 'info' as const }))}
            />
          )}
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'Email validation failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={AtSign}
      title="Email Validation"
      description="Validate email addresses for format, domain existence, MX records, and disposable address detection."
      placeholder="Enter email address (e.g., user@example.com)"
      inputLabel="Email Address"
      features={[
        { title: "Format Check", description: "Validates the email follows proper username@domain.com format." },
        { title: "Domain Validation", description: "Ensures the email domain exists and can receive mail." },
        { title: "MX Record Check", description: "Confirms the domain has a valid mail server." },
        { title: "Disposable Detection", description: "Identifies temporary or disposable email services." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default EmailValidation;
