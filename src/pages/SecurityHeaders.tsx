import { ShieldCheck } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const SecurityHeaders = () => (
  <ToolPageLayout
    icon={ShieldCheck}
    title="Security Headers Check"
    description="Ensure your web server is configured with essential HTTP security headers."
    features={[
      { title: "HSTS", description: "Strict-Transport-Security — enforces HTTPS connections." },
      { title: "X-Content-Type-Options", description: "Prevents MIME type sniffing attacks." },
      { title: "X-Frame-Options", description: "Protects against clickjacking attacks." },
      { title: "X-XSS-Protection", description: "Prevents cross-site scripting attacks." },
      { title: "Content-Security-Policy", description: "Restricts resources that can be loaded on the page." },
    ]}
  />
);

export default SecurityHeaders;
