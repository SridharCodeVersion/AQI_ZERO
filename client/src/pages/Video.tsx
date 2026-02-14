import { motion } from "framer-motion";
import { Maximize2, Target, Video as VideoIcon, Radio } from "lucide-react";

export default function VideoFeed() {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <VideoIcon className="text-primary" /> Live Surveillance
        </h1>
        <div className="flex items-center gap-4 text-xs font-mono">
           <span className="text-green-500 animate-pulse flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full" /> LIVE
           </span>
           <span className="text-muted-foreground">CAM-01: DRONE-ALPHA</span>
        </div>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 bg-black group">
        {/* Placeholder for Video Stream */}
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop" 
          /* landing page hero scenic mountain landscape - using as dummy drone footage backdrop */
          alt="Drone Feed"
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-8">
          {/* Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50">
            <Target className="w-16 h-16 stroke-[1]" />
          </div>

          {/* Corners */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/50" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/50" />

          {/* Data Overlay */}
          <div className="absolute top-8 left-12 font-mono text-sm text-primary space-y-1">
            <div>ALT: 124m</div>
            <div>SPD: 45km/h</div>
            <div>BAT: 82%</div>
          </div>

          <div className="absolute bottom-8 right-12 font-mono text-xs text-white/70 text-right space-y-1">
             <div>LAT: 28.6139 N</div>
             <div>LNG: 77.2090 E</div>
             <div>HDG: 340° NW</div>
          </div>
          
          {/* Object Detection Box Simulation */}
          <motion.div 
            className="absolute border border-red-500 bg-red-500/10 px-2 py-1 text-xs text-red-500 font-bold"
            style={{ top: '40%', left: '60%', width: '100px', height: '80px' }}
            animate={{ x: [0, 10, -5, 0], y: [0, -5, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            SMOKE DETECTED
            <br />
            CONF: 98%
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-24 mt-4 grid grid-cols-4 gap-4">
         {[1, 2, 3, 4].map(id => (
           <div key={id} className={`glass-panel rounded-lg p-2 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden ${id === 1 ? 'border-primary' : 'border-white/5'}`}>
             <img 
               src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&fit=crop" 
               /* landing page hero scenic mountain landscape - thumbnail */
               className="w-full h-full object-cover opacity-50"
               alt="Thumbnail"
             />
             <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/50 px-1 rounded text-white">
               CAM-{id}
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}
