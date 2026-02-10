import { AlertTriangle } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const UrlBlacklist = () => (
  <ToolPageLayout
    icon={AlertTriangle}
    title="URL Blacklist Check"
    description="Scan URLs against malware and phishing databases to detect malicious activity."
    features={[
      { title: "Phishing Detection", description: "Analyzes whether the site is a phishing attempt." },
      { title: "Malware URL Check", description: "Checks domain against malware-related databases." },
    ]}
  />
);

export default UrlBlacklist;
