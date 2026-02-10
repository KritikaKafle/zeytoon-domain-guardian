import { Server } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const WebServerInfo = () => (
  <ToolPageLayout
    icon={Server}
    title="Web Server Information"
    description="Retrieve HTTP headers, detect technology stack, check open ports, and measure response time."
    features={[
      { title: "HTTP Headers", description: "Retrieves headers returned by the web server." },
      { title: "Technology Stack", description: "Detects technologies like Apache, Nginx, PHP, WordPress." },
      { title: "Open Ports", description: "Identifies open ports that could be vulnerable." },
      { title: "Response Time", description: "Measures server response time and overall performance." },
    ]}
  />
);

export default WebServerInfo;
