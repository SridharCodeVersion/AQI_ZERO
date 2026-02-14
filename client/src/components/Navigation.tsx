import { Link, useLocation } from "wouter";
import { 
  Activity, 
  Map, 
  Crosshair, 
  AlertTriangle, 
  Video, 
  Bot, 
  LayoutDashboard 
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/sensors", label: "Sensors", icon: Activity },
  { href: "/map", label: "Heatmap", icon: Map },
  { href: "/drones", label: "Drones", icon: Crosshair },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/video", label: "Live Feed", icon: Video },
  { href: "/ai", label: "AI Assistant", icon: Bot },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Activity className="text-black w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-white">
              AQI<span className="text-primary">ZERO</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={clsx(
                      "relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer group",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-display">{item.label}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 rounded-md ring-1 ring-primary/50 shadow-[0_0_10px_rgba(0,255,157,0.2)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
