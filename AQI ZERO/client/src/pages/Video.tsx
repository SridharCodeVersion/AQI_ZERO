import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Target, Video as VideoIcon, Radio, Battery, Signal, Navigation, Wifi } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import { Drone } from "@shared/schema";

export default function VideoFeed() {
  // Subscribe to real-time drone telemetry
  const droneData = useSocket<Drone | null>("drone_update", null);

  // Local state for connection simulation
  const [isConnected, setIsConnected] = useState(false);
  const [streamQuality, setStreamQuality] = useState(100);

  useEffect(() => {
    // Simulate connection sequence
    const timer = setTimeout(() => setIsConnected(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Telemetry defaults if no data yet
  const altitude = droneData?.altitude?.toFixed(1) || "---";
  const speed = droneData?.speed?.toFixed(1) || "---";
  const battery = droneData?.battery || 0;
  const heading = droneData?.heading?.toFixed(0) || "---";
  const lat = droneData?.latitude?.toFixed(4) || "---";
  const lng = droneData?.longitude?.toFixed(4) || "---";

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <VideoIcon className="text-blue-400 w-5 h-5" />
          </div>
          <span className="font-display">OV7670 Live Uplink</span>
        </h1>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-white/5">
            <Wifi className={`w-3 h-3 ${isConnected ? "text-green-500" : "text-slate-500"}`} />
            <span className={isConnected ? "text-green-400" : "text-slate-500"}>
              {isConnected ? "SIGNAL LOCKED (-42dBm)" : "SEARCHING..."}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-500/30 rounded-full text-red-400 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            LIVE REC
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative rounded-xl overflow-hidden border-2 border-slate-800 bg-black group shadow-2xl">

        {/* Placeholder / Simulated Stream */}
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-slate-950"
            >
              <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
              <p className="font-mono text-blue-400 text-sm animate-pulse">INITIALIZING OPTICAL SENSOR...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-full"
            >
              {/* Background Image (Simulated Video) */}
              <img
                src="https://images.unsplash.com/photo-1577017040065-29985a71a062?q=80&w=2069&auto=format&fit=crop"
                alt="Drone Feed"
                className="w-full h-full object-cover opacity-80 scale-105"
              />

              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />

              {/* Grain Noise (Optional/Subtle) */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* --- HUD OVERLAY --- */}
              <div className="absolute inset-0 p-8 pointer-events-none">

                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40">
                  <Target className="w-32 h-32 stroke-[0.5]" />
                  <div className="w-1 h-1 bg-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_10px_red]" />
                </div>

                {/* Top Left: System Stats */}
                <div className="absolute top-8 left-8 space-y-1">
                  <div className="bg-black/60 px-2 py-1 rounded border-l-2 border-blue-500 backdrop-blur-sm">
                    <p className="text-[10px] text-blue-400 font-mono">SYSTEM STATUS</p>
                    <p className="text-xl font-bold font-mono text-white">ONLINE</p>
                  </div>
                  <div className="bg-black/60 px-2 py-1 rounded border-l-2 border-blue-500 backdrop-blur-sm flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono">BATTERY</p>
                      <p className={`text-sm font-bold font-mono ${battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                        {battery}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono">LINK</p>
                      <p className="text-sm font-bold font-mono text-green-400">98%</p>
                    </div>
                  </div>
                </div>

                {/* Top Right: Compass/Location */}
                <div className="absolute top-8 right-8 text-right space-y-1">
                  <div className="bg-black/60 px-3 py-1.5 rounded border-r-2 border-orange-500 backdrop-blur-sm">
                    <p className="text-[10px] text-orange-400 font-mono mb-0.5">GEOLOCATION</p>
                    <p className="font-mono text-xs text-white">LAT: {lat}</p>
                    <p className="font-mono text-xs text-white">LNG: {lng}</p>
                  </div>
                  <div className="bg-black/60 px-3 py-1.5 rounded border-r-2 border-orange-500 backdrop-blur-sm flex items-center justify-end gap-2">
                    <Navigation className="w-4 h-4 text-orange-400" style={{ transform: `rotate(${Number(heading)}deg)` }} />
                    <span className="font-mono text-sm font-bold text-white">{heading}°</span>
                  </div>
                </div>

                {/* Bottom Left: Flight Telemetry */}
                <div className="absolute bottom-8 left-8 space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="bg-black/60 p-2 rounded border border-white/10 backdrop-blur-sm w-24">
                      <p className="text-[10px] text-slate-400 font-mono">ALTITUDE</p>
                      <p className="text-2xl font-bold font-mono text-white tracking-widest">{altitude}<span className="text-sm text-slate-500 ml-1">m</span></p>
                    </div>
                    <div className="h-full pb-1">
                      <div className="w-1 h-8 bg-slate-800 rounded-full overflow-hidden relative">
                        <div className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500" style={{ height: `${Math.min(100, Number(altitude))}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="bg-black/60 p-2 rounded border border-white/10 backdrop-blur-sm w-24">
                      <p className="text-[10px] text-slate-400 font-mono">SPEED</p>
                      <p className="text-2xl font-bold font-mono text-white tracking-widest">{speed}<span className="text-sm text-slate-500 ml-1">km/h</span></p>
                    </div>
                    <div className="h-full pb-1">
                      <div className="w-1 h-8 bg-slate-800 rounded-full overflow-hidden relative">
                        <div className="absolute bottom-0 w-full bg-emerald-500 transition-all duration-500" style={{ height: `${Math.min(100, Number(speed))}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Right: Object Detection box */}
                <motion.div
                  className="absolute border border-red-500 bg-red-500/10 px-2 py-1 text-xs text-red-500 font-bold backdrop-blur-sm"
                  style={{ top: '40%', left: '55%' }}
                  animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    SMOKE PLUME DETECTED
                  </div>
                  <div className="text-[10px] font-mono opacity-80">CONFIDENCE: 98.4%</div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Active Source Info */}
      <div className="grid grid-cols-1">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-blue-500 bg-blue-500/5 flex items-center gap-4">
          <div className="w-24 h-14 bg-black rounded overflow-hidden relative border border-white/10">
            <img src={`https://images.unsplash.com/photo-1577017040065-29985a71a062?q=80&w=200`} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold font-mono text-blue-400">CAM-01: PRIMARY OPTICAL SENSOR</p>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] text-slate-400 font-mono">LOCATION: <span className="text-white">CRAWFORD MARKET</span></p>
              <p className="text-[10px] text-slate-400 font-mono">STATUS: <span className="text-green-400">STREAMING (1080p @ 30fps)</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
