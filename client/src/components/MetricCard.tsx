import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "green" | "blue" | "red" | "yellow";
  className?: string;
  delay?: number;
}

export function MetricCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  color = "green",
  className,
  delay = 0 
}: MetricCardProps) {
  
  const colorStyles = {
    green: "text-[hsl(var(--neon-green))] border-[hsl(var(--neon-green))]/30 shadow-[hsl(var(--neon-green))]/10",
    blue: "text-[hsl(var(--neon-blue))] border-[hsl(var(--neon-blue))]/30 shadow-[hsl(var(--neon-blue))]/10",
    red: "text-[hsl(var(--neon-red))] border-[hsl(var(--neon-red))]/30 shadow-[hsl(var(--neon-red))]/10",
    yellow: "text-[hsl(var(--neon-yellow))] border-[hsl(var(--neon-yellow))]/30 shadow-[hsl(var(--neon-yellow))]/10",
  };

  const bgStyles = {
    green: "bg-[hsl(var(--neon-green))]/5",
    blue: "bg-[hsl(var(--neon-blue))]/5",
    red: "bg-[hsl(var(--neon-red))]/5",
    yellow: "bg-[hsl(var(--neon-yellow))]/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={clsx(
        "relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        colorStyles[color],
        bgStyles[color],
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Icon className="w-16 h-16" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <h3 className="font-display text-sm uppercase tracking-wider opacity-80">{label}</h3>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-4xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-sm font-medium opacity-60">{unit}</span>}
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center text-xs font-mono opacity-80">
            {trend === "up" && <span className="text-[hsl(var(--neon-red))]">▲ 12% vs last hr</span>}
            {trend === "down" && <span className="text-[hsl(var(--neon-green))]">▼ 5% vs last hr</span>}
            {trend === "neutral" && <span className="text-[hsl(var(--neon-blue))]">● Stable</span>}
          </div>
        )}
      </div>

      {/* Decorative tech lines */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
    </motion.div>
  );
}
