import { Lock } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const CspCheck = () => (
  <ToolPageLayout
    icon={Lock}
    title="Content Security Policy Check"
    description="Analyze your domain's CSP headers to prevent XSS and other injection attacks."
    features={[
      { title: "CSP Header Analysis", description: "Ensures a properly configured Content Security Policy is in place." },
    ]}
  />
);

export default CspCheck;
