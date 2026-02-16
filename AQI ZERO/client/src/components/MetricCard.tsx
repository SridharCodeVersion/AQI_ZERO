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
  color = "blue",
  className,
  delay = 0
}: MetricCardProps) {

  const colorStyles = {
    green: "text-green-500 border-green-500/30",
    blue: "text-blue-500 border-blue-500/30",
    red: "text-red-500 border-red-500/30",
    yellow: "text-yellow-500 border-yellow-500/30",
  };

  const bgStyles = {
    green: "bg-green-500/5",
    blue: "bg-blue-500/5",
    red: "bg-red-500/5",
    yellow: "bg-yellow-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      className={clsx(
        "relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-md",
        colorStyles[color],
        bgStyles[color],
        className
      )}
    >
      <div className="absolute top-3 right-3 opacity-10">
        <Icon className="w-12 h-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" />
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{label}</h3>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold tracking-tight text-foreground">{value}</span>
          {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
        </div>

        {trend && (
          <div className="mt-3 flex items-center text-xs font-mono">
            {trend === "up" && <span className="text-red-500">▲ 12% vs last hr</span>}
            {trend === "down" && <span className="text-green-500">▼ 5% vs last hr</span>}
            {trend === "neutral" && <span className="text-blue-500">● Stable</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
