import { ReactNode, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Search, Loader2 } from "lucide-react";
import Layout from "./Layout";

interface ToolPageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  placeholder?: string;
  inputLabel?: string;
  children?: ReactNode;
  features: { title: string; description: string }[];
  onSubmit?: (query: string) => void;
  isLoading?: boolean;
  results?: ReactNode;
}

const ToolPageLayout = ({
  icon: Icon,
  title,
  description,
  placeholder = "Enter domain name (e.g., example.com)",
  inputLabel = "Domain / IP Address",
  features,
  onSubmit,
  isLoading = false,
  results,
}: ToolPageLayoutProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSubmit) {
      onSubmit(query.trim());
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero text-hero-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
              <Icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-hero-muted text-lg">{description}</p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-xl border border-border shadow-card p-6"
          >
            <label className="block text-sm font-medium text-foreground mb-2">{inputLabel}</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Check
              </button>
            </div>
          </motion.form>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {results}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">What This Tool Checks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-5 rounded-xl bg-card border border-border"
              >
                <h3 className="font-display font-semibold text-foreground mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ToolPageLayout;
