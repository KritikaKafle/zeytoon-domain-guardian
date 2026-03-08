import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ServerLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  status: 'success' | 'error' | 'pending';
}

interface DnsPropagationMapProps {
  servers: ServerLocation[];
}

const DnsPropagationMap = ({ servers }: DnsPropagationMapProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground">DNS Propagation Map</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Resolved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Not Resolved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            No Records
          </span>
        </div>
      </div>
      <div className="aspect-[2/1] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [10, 30],
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", opacity: 0.7 },
                    hover: { outline: "none", opacity: 0.85 },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {servers.map((server, i) => (
            <Marker key={server.name} coordinates={server.coordinates}>
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
              >
                {/* Pin shape */}
                <path
                  d="M0,-24 C-6,-24 -10,-18 -10,-12 C-10,-4 0,0 0,0 C0,0 10,-4 10,-12 C10,-18 6,-24 0,-24Z"
                  fill={
                    server.status === 'success' ? '#22c55e' :
                    server.status === 'error' ? '#ef4444' : '#eab308'
                  }
                  stroke="#fff"
                  strokeWidth={1.5}
                />
                {/* Inner circle */}
                <circle
                  cy={-14}
                  r={4}
                  fill="#fff"
                  opacity={0.9}
                />
              </motion.g>
              <title>{server.name}</title>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default DnsPropagationMap;

// Server coordinates for the DNS servers
export const SERVER_COORDINATES: Record<string, [number, number]> = {
  // North America
  'Cloudflare (USA)': [-122.4, 37.8],
  'Google (USA)': [-122.1, 37.4],
  'CIRA (Canada)': [-75.7, 45.4],
  'Telmex (Mexico)': [-99.1, 19.4],
  // Europe
  'Quad9 (Switzerland)': [8.5, 47.4],
  'AdGuard (Germany)': [13.4, 52.5],
  'DNS.SB (Netherlands)': [4.9, 52.4],
  // Asia
  'AliDNS (China)': [121.5, 31.2],
  'IIJ (Japan)': [139.7, 35.7],
  'Quad9 (Singapore)': [103.8, 1.3],
  // Oceania
  'Cloudflare (Australia)': [151.2, -33.9],
  // Africa
  'Google (South Africa)': [28.0, -26.2],
  'Cloudflare (Nigeria)': [3.4, 6.5],
  'Cloudflare (Kenya)': [36.8, -1.3],
};
