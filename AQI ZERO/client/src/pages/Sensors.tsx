import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { MQ2Card, MQ7Card, DHT22Card, MPU6050Card } from "@/components/sensors";
import { AnimatePresence, motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

interface SensorPayload {
  timestamp: string;
  mq2: {
    smoke: number;
    lpg: number;
    methane: number;
    propane: number;
    hydrogen: number;
  };
  mq7: { raw: number };
  dht22: { temperature: number; humidity: number };
  mpu6050: { accel: { x: number; y: number; z: number }; gyro: { x: number; y: number; z: number } };
}

export default function Sensors() {
  // Real-time data subscription
  const latestData = useSocket<SensorPayload | null>("sensor_update", null);

  // Historical data state (rolling buffer)
  const [history, setHistory] = useState<{
    mq2: { time: string; value: number }[];
    mq7: { time: string; value: number }[];
  }>({ mq2: [], mq7: [] });

  // Update history buffer when new data arrives
  useEffect(() => {
    if (latestData) {
      const time = new Date(latestData.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

      setHistory(prev => {
        // For MQ2 history, let's track Smoke as the primary indicator for the chart
        const mq2Val = latestData.mq2.smoke;
        const newMq2 = [...prev.mq2, { time, value: mq2Val }].slice(-60);
        const newMq7 = [...prev.mq7, { time, value: latestData.mq7.raw }].slice(-60);
        return { mq2: newMq2, mq7: newMq7 };
      });
    }
  }, [latestData]);

  if (!latestData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-slate-400 font-mono animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Live Sensor Telemetry</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            UPLINK ACTIVE • ID: DRONE-ALPHA • {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            Real-Time Data Stream
          </div>
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
            <Wifi className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {/* Row 1: Gas Sensors */}
          <MQ2Card data={latestData.mq2} history={history.mq2} />
          <MQ7Card data={latestData.mq7} history={history.mq7} />

          {/* Row 2: Environment */}
          <DHT22Card data={latestData.dht22} />

          {/* Row 2/3: IMU (Full width on smaller screens, part of grid on large) */}
          <div className="md:col-span-2 lg:col-span-1">
            <MPU6050Card data={latestData.mpu6050} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Debug/Raw Data Viewer (Optional, kept subtle) */}
      <div className="mt-8 pt-4 border-t border-white/5">
        <details className="text-xs text-slate-600 font-mono cursor-pointer">
          <summary>View Raw Telemetry Payload</summary>
          <pre className="mt-2 p-4 bg-black/50 rounded border border-white/5 overflow-x-auto">
            {JSON.stringify(latestData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
