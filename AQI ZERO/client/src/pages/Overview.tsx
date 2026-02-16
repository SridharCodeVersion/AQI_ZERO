import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Wind,
  Map as MapIcon,
  AlertTriangle,
  TrendingUp,
  Zap,
  Battery,
  Server,
  Shield,
  Clock,
  Target,
  Factory,
  Car,
  Trash2,
  Construction,
  Filter,
  ChevronRight,
  Maximize2
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- Types & Mock Data ---

const COLORS = {
  navy: "#0B1220",
  card: "#121C2D",
  accent: "#2F80ED",
  cyan: "#00C2FF",
  amber: "#F2C94C",
  red: "#EB5757",
  success: "#27AE60",
  text: "#E2E8F0",
  muted: "#64748B"
};

const SOURCE_COLORS = {
  Traffic: "#2F80ED",
  Construction: "#F2C94C",
  "Waste Burning": "#EB5757",
  Industrial: "#8E44AD",
  Unknown: "#64748B"
};

const TREND_DATA = [
  { time: '06:00', pm25: 45, confidence: 88, events: 12 },
  { time: '09:00', pm25: 85, confidence: 92, events: 28 },
  { time: '12:00', pm25: 120, confidence: 95, events: 45 },
  { time: '15:00', pm25: 90, confidence: 90, events: 32 },
  { time: '18:00', pm25: 150, confidence: 96, events: 58 },
  { time: '21:00', pm25: 110, confidence: 94, events: 40 },
];

const SOURCE_DATA = [
  { name: 'Construction', value: 35 },
  { name: 'Traffic', value: 25 },
  { name: 'Waste Burning', value: 20 },
  { name: 'Industrial', value: 15 },
  { name: 'Unknown', value: 5 },
];

const RECENT_EVENTS = [
  { id: 1, type: "Waste Burning", loc: "Rohini Sec-18", risk: "CRITICAL", conf: 98, time: "2 min ago", drone: "DR-01" },
  { id: 2, type: "Industrial", loc: "Okhla Ind. Area", risk: "HIGH", conf: 94, time: "8 min ago", drone: "DR-03" },
  { id: 3, type: "Traffic", loc: "Ashram Chowk", risk: "MODERATE", conf: 85, time: "15 min ago", drone: "DR-02" },
  { id: 4, type: "Construction", loc: "Dwarka Exp", risk: "HIGH", conf: 96, time: "22 min ago", drone: "DR-01" },
];

// --- Sub-Components ---

const KPICard = ({ title, value, unit, trend, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    className="bg-[#121C2D] border border-white/5 rounded-xl p-4 relative overflow-hidden group hover:border-white/10 transition-colors"
  >
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon className="w-16 h-16" style={{ color }} />
    </div>
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-white/5`}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend && (
        <span className={`text-xs font-mono flex items-center gap-1 ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-xs text-slate-500 font-mono">{unit}</span>
    </div>
    {/* Micro-chart decoration */}
    <div className="h-1 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.random() * 60 + 20}%`, backgroundColor: color }} />
    </div>
  </motion.div>
);

const SectionHeader = ({ title, icon: Icon }: any) => (
  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
    <Icon className="w-4 h-4 text-cyan-400" />
    <h2 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h2>
  </div>
);

// --- Main Overview Component ---

export default function Overview() {
  const [activeTab, setActiveTab] = useState('1H');
  const [mapLayer, setMapLayer] = useState("all");

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-200 font-sans selection:bg-cyan-500/30">

      {/* 1. TOP GLOBAL STATUS BAR */}
      <header className="border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">AQI ZERO <span className="text-cyan-500">INTELLIGENCE</span></h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">AI Pollution Attribution System • Delhi NCR</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-500" />
              <span>ACTIVE DRONES: <strong className="text-white">04</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>EVENTS TODAY: <strong className="text-white">128</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-red-500" />
              <span>HIGH RISK ZONES: <strong className="text-white">03</strong></span>
            </div>
            <div className="pl-4 border-l border-white/10">
              <span className="text-slate-600">LAST SYNC: </span>
              <span className="text-white">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">

        {/* 2. KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="City Risk Index" value="72" unit="/ 100" trend={+4.5} icon={Shield} color={COLORS.red} delay={1} />
          <KPICard title="Active Emissions" value="19" unit="EVENTS" trend={+12} icon={Factory} color={COLORS.amber} delay={2} />
          <KPICard title="Top Source" value="CONST." unit="DUST" icon={Construction} color={COLORS.cyan} delay={3} />
          <KPICard title="Repeat Offenders" value="07" unit="SITES" trend={-2} icon={AlertTriangle} color={COLORS.navy} delay={4} />
          <KPICard title="Avg PM2.5" value="142" unit="µg/m³" trend={+8} icon={Wind} color={COLORS.accent} delay={5} />
          <KPICard title="AI Confidence" value="94.2" unit="%" icon={Zap} color={COLORS.success} delay={6} />
        </div>

        {/* 3. CENTERPIECE: MAP & INTELLIGENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">

          {/* GIS MAP WIDGET */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-[#121C2D] border border-white/5 rounded-xl overflow-hidden relative flex flex-col"
          >
            <div className="absolute top-4 left-4 z-[500] bg-[#0B1220]/90 backdrop-blur border border-white/10 p-2 rounded-lg">
              <h3 className="text-xs font-bold text-white mb-2 px-1">SOURCE LAYERS</h3>
              <div className="flex flex-col gap-1">
                {Object.entries(SOURCE_COLORS).map(([name, color]) => (
                  <button key={name} className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded text-[10px] font-mono transition-colors text-left" onClick={() => setMapLayer(name)}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className={mapLayer === name || mapLayer === "all" ? "text-white" : "text-slate-500"}>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute top-4 right-4 z-[500] bg-[#0B1220]/90 backdrop-blur border border-white/10 p-1 rounded-lg flex gap-1">
              {['1H', '6H', '24H', '7D'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1 text-[10px] font-bold rounded ${activeTab === t ? 'bg-cyan-500 text-[#0B1220]' : 'text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>

            <MapContainer center={[28.6139, 77.2090] as [number, number]} zoom={11} className="flex-1 w-full bg-[#0B1220]">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Simulated Events */}
              {[
                { pos: [28.61, 77.23], color: SOURCE_COLORS.Construction, r: 1000 },
                { pos: [28.55, 77.27], color: SOURCE_COLORS.Industrial, r: 800 },
                { pos: [28.70, 77.10], color: SOURCE_COLORS["Waste Burning"], r: 1200 },
              ].map((h, i) => (
                <CircleMarker key={i} center={h.pos as [number, number]} radius={20} pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 0.4 }}>
                  <Popup className="bg-[#121C2D] text-white border border-white/10">
                    <div className="text-xs font-mono">
                      <strong>Risk Zone #{i + 1}</strong><br />
                      Radius: {h.r}m
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            <div className="h-10 border-t border-white/5 bg-[#0B1220] flex items-center px-4 justify-between text-[10px] font-mono text-slate-500">
              <span>LAT: 28.6139 N | LNG: 77.2090 E</span>
              <span className="flex items-center gap-2"><Wind className="w-3 h-3" /> WIND: NW 12km/h</span>
            </div>
          </motion.div>

          {/* REAL-TIME INTELLIGENCE FEED */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6 h-full">

            {/* Event Stream */}
            <div className="bg-[#121C2D] border border-white/5 rounded-xl p-4 flex flex-col overflow-hidden">
              <SectionHeader title="Live Event Intelligence" icon={Activity} />
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {RECENT_EVENTS.map((event) => (
                  <div key={event.id} className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{event.type}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${event.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          event.risk === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                        }`}>{event.risk}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                        <div>LOC: {event.loc}</div>
                        <div>DRONE: {event.drone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{event.conf}%</div>
                        <div className="text-[9px] text-slate-500">CONFIDENCE</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-[#121C2D] to-[#1e293b] border border-white/5 rounded-xl p-4 flex flex-col">
              <SectionHeader title="AI Recommendation Engine" icon={Zap} />
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
                  <h4 className="text-sm font-bold text-cyan-400 mb-1">High Priority Action</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Deploy dust control enforcement at <strong className="text-white">Dwarka Expressway</strong> construction zone.
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">IMPACT REDUCTION</span>
                    <span className="text-green-400 font-bold">18.5% ▼</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded transition-colors shadow-lg shadow-cyan-900/20">
                  GENERATE EVIDENCE REPORT
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 4. ANALYTICS DECK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-[#121C2D] border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader title="Attribution & PM2.5 Trends" icon={TrendingUp} />
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-cyan-500" /> PM2.5</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-purple-500" /> CONFIDENCE</div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #334155' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="pm25" stroke={COLORS.cyan} fillOpacity={1} fill="url(#colorPm)" strokeWidth={2} />
                  <Line type="monotone" dataKey="confidence" stroke="#8E44AD" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="bg-[#121C2D] border border-white/5 rounded-xl p-6">
            <SectionHeader title="Source Attribution Profile" icon={PieChart} />
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SOURCE_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SOURCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(SOURCE_COLORS)[index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #334155' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">4</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">Sources</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {SOURCE_DATA.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: Object.values(SOURCE_COLORS)[i] }} />
                    <span className="text-slate-300">{entry.name}</span>
                  </div>
                  <span className="font-mono text-white">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 5. SYSTEM STATUS FOOTER */}
        <div className="border-t border-white/5 pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-500 font-mono">
          <div className="flex flex-col gap-1">
            <span className="uppercase text-[10px] tracking-wider">Edge AI Status</span>
            <span className="text-green-400 flex items-center gap-2"><Server className="w-3 h-3" /> JETSON NANO: ONLINE</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="uppercase text-[10px] tracking-wider">Global Drone Fleet</span>
            <span className="text-white flex items-center gap-2"><Battery className="w-3 h-3 text-amber-500" /> AVG BATTERY: 74%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="uppercase text-[10px] tracking-wider">Model Version</span>
            <span className="text-white">v2.4.1 (YOLOv8-Custom)</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="uppercase text-[10px] tracking-wider">System ID</span>
            <span className="text-slate-600">AQI-ZERO-DEL-001</span>
          </div>
        </div>

      </main>
    </div>
  );
}
