import { Mail } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const EmailBlacklist = () => (
  <ToolPageLayout
    icon={Mail}
    title="Email Blacklist Check"
    description="Check if your email domain or IP is listed on common email blacklists that could impact deliverability."
    placeholder="Enter domain or IP address"
    features={[
      { title: "Spamhaus", description: "Checks against the Spamhaus Block List (SBL) and XBL." },
      { title: "SORBS", description: "Scans the Spam and Open Relay Blocking System." },
      { title: "Barracuda", description: "Checks Barracuda Reputation Block List." },
      { title: "SpamCop", description: "Queries the SpamCop Blocking List." },
      { title: "UCEPROTECT", description: "Checks UCEPROTECT levels 1, 2, and 3." },
      { title: "IP Reputation", description: "Assesses if IP is flagged for spam or malicious activity." },
    ]}
  />
);

export default EmailBlacklist;
