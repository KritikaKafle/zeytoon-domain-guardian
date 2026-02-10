import { Shield } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const SslCheck = () => (
  <ToolPageLayout
    icon={Shield}
    title="SSL Certificate Check"
    description="Verify SSL certificate validity, expiration, certificate chain, and TLS configuration."
    features={[
      { title: "Certificate Validation", description: "Checks expiration date, issuer, and associated domain." },
      { title: "Certificate Chain", description: "Ensures the certificate is trusted via intermediate certificates." },
      { title: "TLS Configuration", description: "Evaluates TLS handshake security and cryptographic algorithms." },
    ]}
  />
);

export default SslCheck;
