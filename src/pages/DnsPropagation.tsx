import { Radio } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const DnsPropagation = () => (
  <ToolPageLayout
    icon={Radio}
    title="DNS Propagation Checker"
    description="Check if your DNS changes have propagated across global DNS servers worldwide."
    placeholder="Enter domain name (e.g., example.com)"
    features={[
      { title: "Global Server Check", description: "Tests DNS resolution from 50+ servers across all continents." },
      { title: "A Record Propagation", description: "Tracks IPv4 address propagation across global resolvers." },
      { title: "AAAA Record Propagation", description: "Monitors IPv6 address propagation worldwide." },
      { title: "MX Record Propagation", description: "Verifies mail server record updates across DNS servers." },
      { title: "NS Record Propagation", description: "Checks nameserver changes across global infrastructure." },
      { title: "CNAME Propagation", description: "Tracks alias record updates across DNS resolvers." },
      { title: "TTL Analysis", description: "Shows Time-To-Live values to estimate full propagation time." },
      { title: "Real-Time Status", description: "Live status indicators showing propagated vs pending servers." },
    ]}
  />
);

export default DnsPropagation;
