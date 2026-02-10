import { History } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const DomainHistory = () => (
  <ToolPageLayout
    icon={History}
    title="Domain History Check"
    description="Check domain age, historical WHOIS data, and registration change tracking."
    features={[
      { title: "Domain Age", description: "How long the domain has existed — indicates trustworthiness." },
      { title: "Historical WHOIS", description: "Tracks ownership and registration changes over time." },
    ]}
  />
);

export default DomainHistory;
