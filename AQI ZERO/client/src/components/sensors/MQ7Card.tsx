import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Wind, ArrowUp, ArrowDown, ArrowRight, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";

interface MQ7Data {
    raw: number;
}

interface MQ7CardProps {
    data: MQ7Data | undefined;
    history: { time: string; value: number }[];
}

export function MQ7Card({ data, history }: MQ7CardProps) {
    const value = data?.raw || 0;

    // Health Risk Logic
    let riskLevel = "Safe";
    let colorClass = "text-blue-500";
    let pulseAnimation = "";

    if (value > 9) {
        riskLevel = "Risk";
        colorClass = "text-orange-500";
    }
    if (value > 35) {
        riskLevel = "Dangerous";
        colorClass = "text-red-600";
        pulseAnimation = "animate-pulse";
    }

    // Trend Logic (Simple last vs previous comparison)
    const lastVal = history[history.length - 2]?.value || 0;
    const trend = value > lastVal ? "rising" : value < lastVal ? "falling" : "stable";

    return (
        <Card className={`bg-slate-900/50 backdrop-blur border-white/10 overflow-hidden relative ${value > 35 ? 'ring-2 ring-red-500/50' : ''}`}>
            {value > 35 && (
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse" />
            )}

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    MQ-7 Carbon Monoxide
                </CardTitle>
                <div className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${colorClass} border-current bg-transparent`}>
                    {riskLevel}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-4xl font-bold ${colorClass} tracking-tighter ${pulseAnimation}`}>
                        {value.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500">ppm</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 h-5">
                    {trend === 'rising' && <><ArrowUp className="w-3 h-3 text-red-400" /> Rising Trend</>}
                    {trend === 'falling' && <><ArrowDown className="w-3 h-3 text-green-400" /> Falling Trend</>}
                    {trend === 'stable' && <><ArrowRight className="w-3 h-3 text-slate-400" /> Stable</>}
                </div>

                <div className="h-[60px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorMq7" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <YAxis hide domain={[0, 50]} />
                            <Tooltip cursor={false} content={<></>} />
                            <Area
                                type="step"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill="url(#colorMq7)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
