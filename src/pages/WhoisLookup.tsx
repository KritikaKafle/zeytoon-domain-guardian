import { Search } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const WhoisLookup = () => (
  <ToolPageLayout
    icon={Search}
    title="WHOIS Lookup"
    description="Get detailed domain registration information including registrant, registrar, and contact details."
    features={[
      { title: "Domain Registrant", description: "Identifies the individual or organization that owns the domain." },
      { title: "Registrar Information", description: "The company managing the domain registration." },
      { title: "Creation & Expiry Dates", description: "When the domain was registered and when it expires." },
      { title: "Name Servers", description: "Lists the authoritative DNS servers for the domain." },
      { title: "Contact Information", description: "Administrative, technical, and billing contact details." },
      { title: "Domain Status", description: "Shows if the domain is locked, transferred, or in redemption." },
    ]}
  />
);

export default WhoisLookup;
