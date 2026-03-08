import { useState, ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ResultsTable, { ResultsError } from "@/components/ResultsTable";
import { fetchPageInfo } from "@/services/lookup";

const SeoAnalysis = () => {
  const [results, setResults] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults(null);
    try {
      const info = await fetchPageInfo(query);
      const titleLen = info.title.length;
      const descLen = info.metaDescription.length;

      setResults(
        <div className="space-y-4">
          <ResultsTable
            title="Meta Tags"
            items={[
              { label: 'Title', value: info.title || 'Missing', status: info.title ? (titleLen > 60 ? 'warning' : 'success') : 'error' },
              { label: 'Title Length', value: `${titleLen} characters ${titleLen > 60 ? '(too long)' : titleLen < 30 ? '(too short)' : '(good)'}`, status: titleLen > 60 || titleLen < 30 ? 'warning' : 'success' },
              { label: 'Meta Description', value: info.metaDescription || 'Missing', status: info.metaDescription ? 'success' : 'error' },
              { label: 'Description Length', value: `${descLen} characters ${descLen > 160 ? '(too long)' : descLen < 70 ? '(too short)' : '(good)'}`, status: descLen > 160 || descLen < 70 ? 'warning' : 'success' },
              { label: 'Keywords', value: info.metaKeywords || 'Not set', status: info.metaKeywords ? 'info' : 'info' },
              { label: 'Canonical URL', value: info.canonical || 'Not set', status: info.canonical ? 'success' : 'warning' },
            ]}
          />
          <ResultsTable
            title="Open Graph"
            items={[
              { label: 'OG Title', value: info.ogTitle || 'Not set', status: info.ogTitle ? 'success' : 'warning' },
              { label: 'OG Description', value: info.ogDescription || 'Not set', status: info.ogDescription ? 'success' : 'warning' },
            ]}
          />
          <ResultsTable
            title="On-Page SEO"
            items={[
              { label: 'H1 Tags', value: `${info.h1Count} found`, status: info.h1Count === 1 ? 'success' : 'warning' },
              { label: 'Viewport Meta', value: info.viewport || 'Missing', status: info.viewport ? 'success' : 'error' },
              { label: 'Total Images', value: info.totalImages.toString(), status: 'info' },
              { label: 'Images Without Alt', value: info.imgWithoutAlt.toString(), status: info.imgWithoutAlt === 0 ? 'success' : 'warning' },
              { label: 'Total Links', value: info.totalLinks.toString(), status: 'info' },
              { label: 'Response Time', value: info.responseTime ? `${info.responseTime}s` : 'N/A', status: 'info' },
            ]}
          />
          {info.technologies.length > 0 && (
            <ResultsTable
              title="Detected Technologies"
              items={info.technologies.map((t) => ({ label: t, value: 'Detected', status: 'info' as const }))}
            />
          )}
        </div>
      );
    } catch (e: any) {
      setResults(<ResultsError message={e.message || 'SEO analysis failed'} />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={BarChart3}
      title="SEO Analysis"
      description="Analyze meta tags, on-page SEO, mobile-friendliness, and content structure."
      features={[
        { title: "Meta Tags", description: "Analyzes title, description, and keyword meta tags." },
        { title: "Open Graph", description: "Checks OG tags for social media sharing." },
        { title: "On-Page SEO", description: "Evaluates H1 tags, images, links, and viewport." },
        { title: "Content Analysis", description: "Detects technologies and measures response time." },
      ]}
      onSubmit={handleSubmit}
      isLoading={loading}
      results={results}
    />
  );
};

export default SeoAnalysis;
