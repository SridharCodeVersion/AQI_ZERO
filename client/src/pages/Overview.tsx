import { MetricCard } from "@/components/MetricCard";
import { useLatestSensors, useRiskAnalysis, useAlerts } from "@/hooks/use-aqi-data";
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  CloudFog, 
  ShieldAlert, 
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis } from "recharts";

export default function Overview() {
  const { data: sensors } = useLatestSensors();
  const { data: risk } = useRiskAnalysis();
  const { data: alerts } = useAlerts();

  // Mock data for the mini chart
  const mockTrendData = [
    { time: '10:00', value: 45 }, { time: '10:05', value: 52 },
    { time: '10:10', value: 48 }, { time: '10:15', value: 70 },
    { time: '10:20', value: 65 }, { time: '10:25', value: 58 },
  ];

  const activeAlertsCount = alerts?.filter(a => a.status === 'active').length || 0;
  const riskScore = risk?.score || 0;
  
  const getRiskColor = (score: number) => {
    if (score < 30) return "green";
    if (score < 60) return "yellow";
    return "red";
  };

  const riskColor = getRiskColor(riskScore);

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-muted-foreground font-mono">System Status: ONLINE | Region: Delhi-NCR</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 font-mono text-sm">LIVE FEED ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Risk Score"
          value={riskScore}
          unit="/ 100"
          icon={ShieldAlert}
          color={riskColor}
          delay={1}
        />
        <MetricCard
          label="Active Alerts"
          value={activeAlertsCount}
          icon={Activity}
          color={activeAlertsCount > 0 ? "red" : "green"}
          delay={2}
        />
        <MetricCard
          label="Avg PM2.5"
          value={sensors?.MQ_2?.value?.toFixed(1) || "--"}
          unit="µg/m³"
          icon={CloudFog}
          color="blue"
          delay={3}
        />
        <MetricCard
          label="Avg Temp"
          value={sensors?.DHT22_TEMP?.value?.toFixed(1) || "--"}
          unit="°C"
          icon={Thermometer}
          color="yellow"
          delay={4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-panel rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary w-5 h-5" />
              Real-time Pollution Trend
            </h2>
            <div className="flex gap-2">
              {['1H', '24H', '7D'].map((t) => (
                <button 
                  key={t}
                  className="px-3 py-1 rounded text-xs font-mono border border-white/10 hover:bg-white/5 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'var(--font-mono)' }} 
                />
                <YAxis 
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'var(--font-mono)' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--neon-green))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "hsl(var(--neon-green))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel rounded-xl p-6 relative overflow-hidden"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldAlert className="text-[hsl(var(--neon-red))] w-5 h-5" />
            Risk Factors
          </h2>

          <div className="space-y-6">
            {risk?.factors && Object.entries(risk.factors).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1 font-mono uppercase">
                  <span>{key}</span>
                  <span className={value > 50 ? "text-red-400" : "text-green-400"}>{value}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${value > 50 ? 'bg-[hsl(var(--neon-red))]' : 'bg-[hsl(var(--neon-green))]'}`} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-white/5">
            <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">AI Recommendation</h4>
            <p className="text-sm leading-relaxed">
              {risk?.recommendation || "System analyzing environmental patterns..."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
