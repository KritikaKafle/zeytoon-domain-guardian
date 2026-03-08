import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

export interface ResultItem {
  label: string;
  value: string;
  status?: 'success' | 'error' | 'warning' | 'info';
}

interface ResultsTableProps {
  title?: string;
  items: ResultItem[];
}

const StatusIcon = ({ status }: { status?: string }) => {
  switch (status) {
    case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />;
    case 'info': return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    default: return null;
  }
};

const ResultsTable = ({ title, items }: ResultsTableProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl border border-border overflow-hidden"
  >
    {title && (
      <div className="px-5 py-3 border-b border-border bg-muted/30">
        <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
      </div>
    )}
    <div className="divide-y divide-border">
      {items.map((item, i) => (
        <div key={i} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <StatusIcon status={item.status} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
          <span className="text-foreground font-mono text-xs text-right break-all max-w-[60%]">
            {item.value}
          </span>
        </div>
      ))}
      {items.length === 0 && (
        <div className="px-5 py-4 text-sm text-muted-foreground text-center">No results found</div>
      )}
    </div>
  </motion.div>
);

export const ResultsError = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-4 text-sm text-destructive flex items-center gap-2"
  >
    <XCircle className="w-4 h-4 shrink-0" />
    {message}
  </motion.div>
);

export default ResultsTable;
