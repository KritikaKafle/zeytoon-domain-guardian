import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ServerLocation {
  name: string;
  coordinates: [number, number];
  status: 'success' | 'error' | 'pending';
}

interface DnsPropagationMapProps {
  servers: ServerLocation[];
}

const DnsPropagationMap = ({ servers }: DnsPropagationMapProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 h-full">
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
      <div className="w-full overflow-hidden">
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{
            scale: 160,
            center: [10, 20],
          }}
          width={800}
          height={420}
          style={{ width: "100%", height: "auto" }}
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
            <Marker key={`${server.name}-${i}`} coordinates={server.coordinates}>
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 300 }}
              >
                <path
                  d="M0,-18 C-5,-18 -8,-14 -8,-9 C-8,-3 0,0 0,0 C0,0 8,-3 8,-9 C8,-14 5,-18 0,-18Z"
                  fill={
                    server.status === 'success' ? '#22c55e' :
                    server.status === 'error' ? '#ef4444' : '#eab308'
                  }
                  stroke="#fff"
                  strokeWidth={1}
                />
                <circle
                  cy={-10}
                  r={3}
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
