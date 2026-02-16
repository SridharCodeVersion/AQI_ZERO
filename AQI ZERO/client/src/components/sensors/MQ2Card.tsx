import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Flame, AlertTriangle, CheckCircle, Droplets, Wind, Zap } from "lucide-react";

interface MQ2Data {
    smoke: number;
    lpg: number;
    methane: number;
    propane: number;
    hydrogen: number;
}

interface MQ2CardProps {
    data: MQ2Data | undefined;
    history: { time: string; value: number }[]; // Keeping history for aggregate or dominant gas if needed, or we might need to update history structure
}

export function MQ2Card({ data }: MQ2CardProps) {
    // Default values
    const smoke = data?.smoke || 0;
    const lpg = data?.lpg || 0;
    const methane = data?.methane || 0;
    const propane = data?.propane || 0;
    const hydrogen = data?.hydrogen || 0;

    // Determine overall status based on max value
    const maxVal = Math.max(smoke, lpg, methane, propane, hydrogen);

    let statusColor = "text-green-500";
    let statusBg = "bg-green-500/10";
    let borderColor = "border-green-500/20";
    let StatusIcon = CheckCircle;
    let statusText = "Air Quality Good";

    if (maxVal > 150) {
        statusColor = "text-yellow-500";
        statusBg = "bg-yellow-500/10";
        borderColor = "border-yellow-500/20";
        StatusIcon = AlertTriangle;
        statusText = "Moderate Detected";
    }
    if (maxVal > 300) {
        statusColor = "text-red-500";
        statusBg = "bg-red-500/10";
        borderColor = "border-red-500/20 animate-pulse";
        StatusIcon = Flame;
        statusText = "Hazardous Gas Levels";
    }

    // Bar Chart Data
    const gases = [
        { name: 'Smoke', value: smoke, limit: 1000, color: '#94a3b8' }, // Slate
        { name: 'LPG', value: lpg, limit: 1000, color: '#f97316' }, // Orange
        { name: 'CH4', value: methane, limit: 1000, color: '#14b8a6' }, // Teal
        { name: 'C3H8', value: propane, limit: 1000, color: '#3b82f6' }, // Blue
        { name: 'H2', value: hydrogen, limit: 1000, color: '#8b5cf6' }, // Violet
    ];

    return (
        <Card className={`bg-slate-900/50 backdrop-blur border-l-4 ${statusColor.replace('text-', 'border-l-')} border-y-white/5 border-r-white/5 shadow-lg`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    MQ-2 Combustible Gas Array
                </CardTitle>
                <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${statusBg} ${statusColor} border ${borderColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusText}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-4">
                    {/* Individual Gas Minis */}
                    {gases.map((gas) => (
                        <div key={gas.name} className="flex flex-col items-center">
                            <div className="w-full bg-slate-800 rounded-t h-16 relative overflow-hidden flex flex-col justify-end">
                                <div
                                    className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
                                    style={{ height: `${Math.min(100, (gas.value / 400) * 100)}%`, backgroundColor: gas.color, opacity: 0.5 }}
                                />
                                <div className="relative z-10 text-center pb-1">
                                    <span className="text-xs font-bold text-white block">{gas.value.toFixed(0)}</span>
                                    <span className="text-[10px] text-slate-400 uppercase">{gas.name}</span>
                                </div>
                            </div>
                            <div className="w-full h-1 mt-1 rounded bg-slate-800 overflow-hidden">
                                <div className="h-full transition-all duration-500" style={{ width: `${Math.min(100, (gas.value / 400) * 100)}%`, backgroundColor: gas.color }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed List View */}
                <div className="space-y-2">
                    {gases.map(gas => (
                        <div key={gas.name} className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 w-16">{gas.name === 'CH4' ? 'Methane' : gas.name === 'C3H8' ? 'Propane' : gas.name}</span>
                            <div className="flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(100, (gas.value / 400) * 100)}%`,
                                        backgroundColor: gas.value > 300 ? '#ef4444' : gas.color
                                    }}
                                />
                            </div>
                            <span className="text-slate-200 font-mono w-10 text-right">{gas.value.toFixed(0)}</span>
                            <span className="text-slate-600 text-[10px] w-6 text-right">ppm</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
