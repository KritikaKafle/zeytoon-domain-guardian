import { Globe } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const DnsLookup = () => (
  <ToolPageLayout
    icon={Globe}
    title="DNS Lookup"
    description="Query DNS records for any domain. Retrieve A, AAAA, MX, CNAME, NS, TXT, PTR, and SOA records."
    placeholder="Enter domain name (e.g., example.com)"
    features={[
      { title: "A Record", description: "Maps domain to an IPv4 address." },
      { title: "AAAA Record", description: "Maps domain to an IPv6 address." },
      { title: "MX Record", description: "Defines mail exchange servers for email delivery." },
      { title: "CNAME Record", description: "Alias that points one domain name to another." },
      { title: "NS Record", description: "Nameserver records for the domain." },
      { title: "TXT Record", description: "Additional info like SPF, DKIM, and DMARC records." },
      { title: "PTR Record", description: "Reverse DNS — maps IP address back to the domain." },
      { title: "SOA Record", description: "Start of Authority — specifies the primary DNS server." },
      { title: "DNS Propagation", description: "Checks if DNS changes have propagated across global servers." },
      { title: "DNSSEC Validation", description: "Validates DNS record authenticity to prevent MITM attacks." },
    ]}
  />
);

export default DnsLookup;
