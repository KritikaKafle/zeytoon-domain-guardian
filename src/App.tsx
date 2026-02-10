import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DnsLookup from "./pages/DnsLookup";
import WhoisLookup from "./pages/WhoisLookup";
import EmailBlacklist from "./pages/EmailBlacklist";
import SslCheck from "./pages/SslCheck";
import WebServerInfo from "./pages/WebServerInfo";
import UrlBlacklist from "./pages/UrlBlacklist";
import IpGeolocation from "./pages/IpGeolocation";
import EmailValidation from "./pages/EmailValidation";
import CspCheck from "./pages/CspCheck";
import SecurityHeaders from "./pages/SecurityHeaders";
import SeoAnalysis from "./pages/SeoAnalysis";
import VulnerabilityScan from "./pages/VulnerabilityScan";
import DomainReputation from "./pages/DomainReputation";
import DomainHistory from "./pages/DomainHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dns-lookup" element={<DnsLookup />} />
          <Route path="/whois-lookup" element={<WhoisLookup />} />
          <Route path="/email-blacklist" element={<EmailBlacklist />} />
          <Route path="/ssl-check" element={<SslCheck />} />
          <Route path="/web-server-info" element={<WebServerInfo />} />
          <Route path="/url-blacklist" element={<UrlBlacklist />} />
          <Route path="/ip-geolocation" element={<IpGeolocation />} />
          <Route path="/email-validation" element={<EmailValidation />} />
          <Route path="/csp-check" element={<CspCheck />} />
          <Route path="/security-headers" element={<SecurityHeaders />} />
          <Route path="/seo-analysis" element={<SeoAnalysis />} />
          <Route path="/vulnerability-scan" element={<VulnerabilityScan />} />
          <Route path="/domain-reputation" element={<DomainReputation />} />
          <Route path="/domain-history" element={<DomainHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
