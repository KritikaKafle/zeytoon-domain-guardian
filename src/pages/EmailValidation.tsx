import { AtSign } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const EmailValidation = () => (
  <ToolPageLayout
    icon={AtSign}
    title="Email Validation"
    description="Validate email addresses for format, domain existence, MX records, and disposable address detection."
    placeholder="Enter email address (e.g., user@example.com)"
    inputLabel="Email Address"
    features={[
      { title: "Format Check", description: "Validates the email follows proper username@domain.com format." },
      { title: "Domain Validation", description: "Ensures the email domain exists and can receive mail." },
      { title: "MX Record Check", description: "Confirms the domain has a valid mail server." },
      { title: "Disposable Detection", description: "Identifies temporary or disposable email services." },
    ]}
  />
);

export default EmailValidation;
