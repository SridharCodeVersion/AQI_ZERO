import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSensors } from '@/hooks/use-aqi-data';

export default function Heatmap() {
  const { data: sensors } = useSensors(100);

  // Default center (Delhi)
  const center = [28.6139, 77.2090] as [number, number];

  // Helper to get color based on value intensity
  const getColor = (value: number) => {
    if (value > 80) return '#ff0055'; // Red - High
    if (value > 50) return '#fbbf24'; // Yellow - Medium
    return '#00ff9d'; // Green - Low
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute top-4 left-4 z-[1000] glass-panel p-4 rounded-lg max-w-xs">
        <h2 className="text-lg font-bold text-white mb-2">Pollution Heatmap</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Visualizing real-time particulate matter density across the monitored sectors.
        </p>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff0055]" />
            <span>CRITICAL (&gt;80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
            <span>MODERATE (50-80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff9d]" />
            <span>SAFE (&lt;50)</span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0 bg-slate-900"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {sensors?.filter(s => s.coordinates).map((sensor) => (
          <CircleMarker
            key={sensor.id}
            center={[
              (sensor.coordinates as any).lat, 
              (sensor.coordinates as any).lng
            ]}
            pathOptions={{ 
              color: getColor(sensor.value), 
              fillColor: getColor(sensor.value), 
              fillOpacity: 0.6,
              weight: 1
            }}
            radius={20}
          >
            <Popup>
              <div className="font-mono text-xs">
                <strong>{sensor.type}</strong><br/>
                Value: {sensor.value} {sensor.unit}<br/>
                Loc: {(sensor.coordinates as any).lat.toFixed(4)}, {(sensor.coordinates as any).lng.toFixed(4)}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
