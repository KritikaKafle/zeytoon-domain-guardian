import { motion } from "framer-motion";
import {
  Globe, Search, Shield, Mail, Server, AlertTriangle, AtSign,
  Lock, ShieldCheck, BarChart3, Bug, Star, History, Radio
} from "lucide-react";
import Layout from "@/components/Layout";
import ToolCard from "@/components/ToolCard";

const tools = [
  { icon: Globe, title: "DNS Lookup", description: "Query DNS records including A, AAAA, MX, CNAME, NS, TXT, PTR, and SOA records.", path: "/dns-lookup" },
  { icon: Radio, title: "DNS Propagation", description: "Check if DNS changes have propagated across 50+ global DNS servers worldwide.", path: "/dns-propagation" },
  { icon: Search, title: "WHOIS Lookup", description: "Get domain registration details including registrant, registrar, creation/expiry dates, and name servers.", path: "/whois-lookup" },
  { icon: Mail, title: "Email Blacklist Check", description: "Check if your domain or IP is listed on major email blacklists like Spamhaus, SORBS, and Barracuda.", path: "/email-blacklist" },
  { icon: Shield, title: "SSL Certificate Check", description: "Validate SSL certificates, check expiration, certificate chain, and TLS configuration.", path: "/ssl-check" },
  { icon: Server, title: "Web Server Info", description: "Retrieve HTTP headers, detect technology stack, check open ports, and measure response time.", path: "/web-server-info" },
  { icon: AlertTriangle, title: "URL Blacklist Check", description: "Scan URLs against malware and phishing databases to detect malicious activity.", path: "/url-blacklist" },
  
  { icon: AtSign, title: "Email Validation", description: "Validate email format, check domain existence, MX records, and detect disposable addresses.", path: "/email-validation" },
  { icon: Lock, title: "CSP Check", description: "Analyze Content Security Policy headers to prevent XSS and injection attacks.", path: "/csp-check" },
  { icon: ShieldCheck, title: "Security Headers", description: "Check HSTS, X-Content-Type-Options, X-Frame-Options, XSS Protection, and CSP headers.", path: "/security-headers" },
  { icon: BarChart3, title: "SEO Analysis", description: "Analyze meta tags, on-page SEO factors, mobile-friendliness, and page performance.", path: "/seo-analysis" },
  { icon: Bug, title: "Vulnerability Scan", description: "Detect open ports, SQL injection, XSS, CSRF, and other web application vulnerabilities.", path: "/vulnerability-scan" },
  { icon: Star, title: "Domain Reputation", description: "Analyze overall domain reputation including historical use and blacklist status.", path: "/domain-reputation" },
  { icon: History, title: "Domain History", description: "Check domain age, historical WHOIS data, and registration change tracking.", path: "/domain-history" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero text-hero-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/20 text-sm text-primary mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Zeytoon Development Lab
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Domain & Network
                <br />
                <span className="text-gradient-primary">Analysis Tools</span>
              </h1>

              <p className="text-lg md:text-xl text-hero-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                Professional-grade DNS, WHOIS, SSL, security, and SEO analysis tools.
                Everything you need to diagnose, monitor, and secure your domains.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#tools"
                  className="px-8 py-3.5 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity shadow-hero"
                >
                  Explore Tools
                </a>
                <a
                  href="https://zeytoonict.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-lg border border-hero-muted/30 text-hero-foreground font-display font-semibold hover:bg-hero-foreground/5 transition-colors"
                >
                  Visit Zeytoon ICT
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "14+", label: "Analysis Tools" },
              { value: "50+", label: "DNS Servers Checked" },
              { value: "100+", label: "Blacklists Scanned" },
              { value: "24/7", label: "Available" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-display font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              All <span className="text-gradient-primary">Tools</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive suite of domain and network analysis tools for professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <ToolCard key={tool.path} {...tool} index={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
