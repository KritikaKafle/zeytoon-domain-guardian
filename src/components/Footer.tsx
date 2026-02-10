import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-hero text-hero-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">Z</span>
            </div>
            <span className="font-display font-bold text-lg">
              Zeytoon<span className="text-primary">.Dev</span>
            </span>
          </div>
          <p className="text-hero-muted text-sm leading-relaxed">
            Zeytoon Development Lab — Professional domain, DNS, and security analysis tools for developers and system administrators.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Quick Tools</h4>
          <div className="space-y-2">
            {[
              { label: "DNS Lookup", path: "/dns-lookup" },
              { label: "WHOIS Lookup", path: "/whois-lookup" },
              { label: "SSL Check", path: "/ssl-check" },
              { label: "Email Blacklist", path: "/email-blacklist" },
              { label: "Security Headers", path: "/security-headers" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-sm text-hero-muted hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">More Tools</h4>
          <div className="space-y-2">
            {[
              { label: "IP Geolocation", path: "/ip-geolocation" },
              { label: "Email Validation", path: "/email-validation" },
              { label: "SEO Analysis", path: "/seo-analysis" },
              { label: "Domain Reputation", path: "/domain-reputation" },
              { label: "Vulnerability Scan", path: "/vulnerability-scan" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-sm text-hero-muted hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-hero-muted/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-hero-muted">© 2026 Zeytoon.Dev — Zeytoon Development Lab. All rights reserved.</p>
        <a
          href="https://zeytoonict.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-hero-muted hover:text-primary transition-colors"
        >
          Powered by Zeytoon ICT
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
