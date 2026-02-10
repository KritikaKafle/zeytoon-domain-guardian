import { Star } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const DomainReputation = () => (
  <ToolPageLayout
    icon={Star}
    title="Domain Reputation Check"
    description="Analyze the overall reputation of a domain including historical use and blacklisting status."
    features={[
      { title: "Reputation Score", description: "Overall trustworthiness rating based on multiple signals." },
      { title: "Blacklist Status", description: "Checks against spam and malicious activity databases." },
    ]}
  />
);

export default DomainReputation;
