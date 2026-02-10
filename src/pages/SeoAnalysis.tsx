import { BarChart3 } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const SeoAnalysis = () => (
  <ToolPageLayout
    icon={BarChart3}
    title="SEO Analysis"
    description="Analyze meta tags, on-page SEO, mobile-friendliness, and backlink quality."
    features={[
      { title: "Meta Tags", description: "Analyzes title, description, and keyword meta tags." },
      { title: "On-Page SEO", description: "Evaluates page load time, mobile-friendliness, and linking." },
      { title: "Backlink Check", description: "Analyzes backlinks and their quality." },
    ]}
  />
);

export default SeoAnalysis;
