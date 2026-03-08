import { useState } from "react";
import { Radio, Search, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import DnsPropagationMap from "@/components/DnsPropagationMap";
import { checkPropagation, DNS_SERVERS, REGIONS } from "@/services/dns";

interface PropagationResult {
  server: string;
  provider: string;
  ip: string;
  country: string;
  flag: string;
  region: string;
  coordinates: [number, number];
  response: { Answer?: { data: string }[] } | null;
  error: string | null;
}

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SRV', 'SOA', 'TXT', 'CAA'];

const DnsPropagation = () => {
  const [query, setQuery] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PropagationResult[]>([]);
  const [mapServers, setMapServers] = useState(
    DNS_SERVERS.map((s) => ({
      name: s.name,
      coordinates: s.coordinates,
      status: 'pending' as const,
    }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const data = await checkPropagation(query.trim(), recordType);
      setResults(data);

      setMapServers(data.map((d) => ({
        name: d.server,
        coordinates: d.coordinates,
        status: d.response?.Answer?.length ? 'success' as const : d.error ? 'error' as const : 'pending' as const,
      })));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (result: PropagationResult) => {
    if (result.response?.Answer?.length) return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
    if (result.error) return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    return <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />;
  };

  const serverList = results.length > 0 ? results : DNS_SERVERS.map((s) => ({
    ...s, server: s.name, response: null, error: null,
  }));

  return (
    <Layout>
      <section className="bg-hero text-hero-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
              <Radio className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">DNS Propagation Checker</h1>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border shadow-card p-4"
              >
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter domain (e.g., example.com)"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                    <select
                      value={recordType}
                      onChange={(e) => setRecordType(e.target.value)}
                      className="px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {RECORD_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={loading || !query.trim()}
                      className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Search
                    </button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <h3 className="font-display font-semibold text-foreground text-sm">
                    Server Locations ({DNS_SERVERS.length})
                  </h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto divide-y divide-border">
                  {REGIONS.map((region) => {
                    const regionServers = serverList.filter((s) => s.region === region);
                    if (regionServers.length === 0) return null;
                    return (
                      <div key={region}>
                        <div className="px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {region}
                        </div>
                        {regionServers.map((s) => (
                          <div
                            key={`${s.server}-${s.ip}`}
                            className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                          >
                            <span className="text-xl">{s.flag}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {s.country}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {s.provider} · {s.ip}
                              </p>
                              {s.response?.Answer?.length ? (
                                <p className="text-xs text-green-600 font-mono truncate mt-0.5">
                                  {s.response.Answer.map((a) => a.data).join(', ')}
                                </p>
                              ) : s.error ? (
                                <p className="text-xs text-red-500 truncate mt-0.5">Failed</p>
                              ) : results.length > 0 ? (
                                <p className="text-xs text-yellow-600 truncate mt-0.5">No records</p>
                              ) : null}
                            </div>
                            {results.length > 0 ? getStatusIcon(s as PropagationResult) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Panel - Map */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-20 lg:self-start"
            >
              <DnsPropagationMap servers={mapServers} />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DnsPropagation;
