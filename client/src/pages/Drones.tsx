import { useDrones } from "@/hooks/use-aqi-data";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Battery, Navigation, Gauge } from "lucide-react";
import { motion } from "framer-motion";

// Custom Drone Icon using DivIcon for CSS styling
const createDroneIcon = (heading: number, status: string) => L.divIcon({
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center">
      <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
      <div class="w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_15px_#00ff9d]" style="transform: rotate(${heading}deg)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
      </div>
    </div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function Drones() {
  const { data: drones } = useDrones();
  const center = [28.6139, 77.2090] as [number, number];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-4rem)]">
      {/* Sidebar List */}
      <div className="lg:col-span-1 border-r border-white/10 bg-slate-900/50 backdrop-blur p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
          <Crosshair className="text-primary" /> Active Drones
        </h2>
        
        <div className="space-y-4">
          {drones?.map((drone) => (
            <motion.div 
              key={drone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-4 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{drone.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                  drone.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {drone.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Battery className="w-4 h-4" />
                  <span className="text-white font-mono">{drone.battery}%</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Navigation className="w-4 h-4" />
                  <span className="text-white font-mono">{drone.heading}°</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="w-4 h-4" />
                  <span className="text-white font-mono">{drone.speed} km/h</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">ALT</span>
                  <span className="text-white font-mono">{drone.altitude}m</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="text-xs text-muted-foreground font-mono">
                  Last Update: {new Date(drone.lastUpdate!).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="lg:col-span-2 relative">
        <MapContainer 
          center={center} 
          zoom={13} 
          className="h-full w-full bg-slate-950"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {drones?.map((drone) => (
            <Marker 
              key={drone.id}
              position={[drone.latitude, drone.longitude]}
              icon={createDroneIcon(drone.heading, drone.status)}
            >
              <Popup className="custom-popup">
                <div className="font-sans">
                  <strong>{drone.name}</strong>
                  <br />
                  Speed: {drone.speed} km/h
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Overlay Stats */}
        <div className="absolute bottom-6 left-6 z-[1000] flex gap-4">
          <div className="glass-panel px-4 py-2 rounded flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono">GPS SIGNAL STRONG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
