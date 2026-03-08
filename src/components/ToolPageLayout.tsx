import { ReactNode, useState, useEffect, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, Search, Loader2, Clock, X, Trash2 } from "lucide-react";
import Layout from "./Layout";
import { getSearchHistory, addSearchHistory, removeSearchHistoryItem, clearSearchHistory } from "@/hooks/use-search-history";

interface ToolPageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  placeholder?: string;
  inputLabel?: string;
  toolId?: string;
  children?: ReactNode;
  features: { title: string; description: string }[];
  onSubmit?: (query: string, recordType?: string) => void;
  isLoading?: boolean;
  results?: ReactNode;
  showRecordTypeSelector?: boolean;
  recordTypes?: string[];
}

const DEFAULT_RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SRV', 'SOA', 'TXT', 'CAA', 'DS', 'DNSKEY'];

const ToolPageLayout = ({
  icon: Icon,
  title,
  description,
  placeholder = "Enter domain name (e.g., example.com)",
  inputLabel = "Domain / IP Address",
  toolId,
  features,
  onSubmit,
  isLoading = false,
  results,
  showRecordTypeSelector = false,
  recordTypes = DEFAULT_RECORD_TYPES,
}: ToolPageLayoutProps) => {
  const id = toolId || title.toLowerCase().replace(/\s+/g, "-");
  const [query, setQuery] = useState("");
  const [selectedRecordType, setSelectedRecordType] = useState(recordTypes[0]);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getSearchHistory(id));
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSubmit) {
      addSearchHistory(id, query.trim());
      setHistory(getSearchHistory(id));
      setShowHistory(false);
      onSubmit(query.trim(), showRecordTypeSelector ? selectedRecordType : undefined);
    }
  };

  const handleSelectHistory = (item: string) => {
    setQuery(item);
    setShowHistory(false);
    if (onSubmit) {
      addSearchHistory(id, item);
      setHistory(getSearchHistory(id));
      onSubmit(item);
    }
  };

  const handleRemoveItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeSearchHistoryItem(id, item);
    setHistory(getSearchHistory(id));
  };

  const handleClearAll = () => {
    clearSearchHistory(id);
    setHistory([]);
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
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => history.length > 0 && setShowHistory(true)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <AnimatePresence>
                  {showHistory && history.length > 0 && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Recent searches
                        </span>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Clear
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {history
                          .filter((h) => !query || h.toLowerCase().includes(query.toLowerCase()))
                          .map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() => handleSelectHistory(item)}
                              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors group"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                {item}
                              </span>
                              <X
                                className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
                                onClick={(e) => handleRemoveItem(e, item)}
                              />
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {showRecordTypeSelector && (
                <select
                  value={selectedRecordType}
                  onChange={(e) => setSelectedRecordType(e.target.value)}
                  className="px-3 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[90px]"
                >
                  {recordTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
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
