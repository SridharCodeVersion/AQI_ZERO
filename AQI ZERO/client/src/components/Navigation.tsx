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
    <div className="flex flex-col border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      {/* Main Nav Bar */}
      <nav className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left: Branding */}
          <div className="flex items-center gap-4 z-10">
            <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]">
              <Activity className="text-primary w-6 h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="border border-primary/30 bg-primary/5 px-2.5 py-0.5 rounded-md inline-flex items-center backdrop-blur-sm mb-0.5 self-start">
                <span className="font-display font-bold text-lg tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  AQI ZERO
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground font-mono font-bold tracking-wider leading-tight">
                DRONE-DRIVEN DELHI NCR AIR POLLUTION CONTROL
              </span>
            </div>
          </div>

          {/* Center: Navigation Links (Absolute Centered) */}
          <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={clsx(
                      "group relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer overflow-hidden",
                      isActive
                        ? "text-primary bg-primary/10 border border-primary/20 shadow-[0_0_10px_-5px_hsl(var(--primary))]"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                    )}
                  >
                    <Icon className={clsx("w-4 h-4 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right: Actions (Placeholder/Empty for balance or future use) */}
          <div className="w-[200px] hidden lg:block"></div>
        </div>
      </nav>

      {/* Sub-Header Banner */}
      <div className="bg-secondary/30 border-b border-border/50 py-2 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block border border-primary/20 bg-card/60 px-6 py-1.5 rounded-full shadow-sm">
            <p className="text-xs md:text-sm font-medium text-foreground tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Intelligent Air Pollution Mitigation in Delhi NCR through Real-Time Drone Surveillance
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

