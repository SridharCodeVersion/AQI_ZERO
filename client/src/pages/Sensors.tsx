import { useSensors } from "@/hooks/use-aqi-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { Cloud, Thermometer, Wind, Droplets } from "lucide-react";

const SENSOR_TYPES = [
  { id: 'MQ-2', label: 'Smoke/LPG', unit: 'ppm', icon: Cloud, color: 'hsl(var(--neon-red))' },
  { id: 'MQ-7', label: 'Carbon Monoxide', unit: 'ppm', icon: Wind, color: 'hsl(var(--neon-blue))' },
  { id: 'DHT22_TEMP', label: 'Temperature', unit: '°C', icon: Thermometer, color: 'hsl(var(--neon-yellow))' },
  { id: 'DHT22_HUM', label: 'Humidity', unit: '%', icon: Droplets, color: 'hsl(var(--neon-green))' },
];

export default function Sensors() {
  const { data: sensors, isLoading } = useSensors(20);

  if (isLoading) {
    return <div className="p-8 text-center font-mono animate-pulse">Initializing Sensor Array...</div>;
  }

  const getSensorData = (type: string) => {
    return sensors?.filter(s => s.type === type).reverse().map(s => ({
      time: new Date(s.timestamp!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: s.value
    })) || [];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-display">Live Sensor Telemetry</h1>
        <div className="text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded border border-green-500/20">
          ● REAL-TIME DATA STREAM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SENSOR_TYPES.map((type, idx) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel rounded-xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-800 text-white">
                  <type.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{type.label}</h3>
                  <p className="text-xs font-mono text-muted-foreground">ID: {type.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold" style={{ color: type.color }}>
                  {getSensorData(type.id)[getSensorData(type.id).length - 1]?.value?.toFixed(1) || '--'}
                </div>
                <div className="text-xs text-muted-foreground">{type.unit}</div>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getSensorData(type.id)}>
                  <defs>
                    <linearGradient id={`gradient-${type.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={type.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={type.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    hide 
                  />
                  <YAxis 
                    stroke="#475569" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#020617', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)'
                    }}
                    itemStyle={{ color: type.color }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={type.color} 
                    fillOpacity={1} 
                    fill={`url(#gradient-${type.id})`} 
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
