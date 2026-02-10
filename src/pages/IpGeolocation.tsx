import { MapPin } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const IpGeolocation = () => (
  <ToolPageLayout
    icon={MapPin}
    title="IP Geolocation & ASN Lookup"
    description="Get geographic location, ASN information, and WHOIS details for any IP address."
    placeholder="Enter IP address (e.g., 8.8.8.8)"
    inputLabel="IP Address"
    features={[
      { title: "IP Geolocation", description: "Country, city, and ISP provider for the IP address." },
      { title: "ASN Lookup", description: "Identifies the Autonomous System Number and network provider." },
      { title: "WHOIS for IP", description: "Registration details for the IP address range." },
    ]}
  />
);

export default IpGeolocation;
