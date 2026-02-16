import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Sun, CloudRain, CloudFog, WifiOff } from "lucide-react";

interface DHT22Data {
    temperature: number;
    humidity: number;
}

interface DHT22CardProps {
    data: DHT22Data | undefined;
}

export function DHT22Card({ data }: DHT22CardProps) {
    const temp = data?.temperature || 0;
    const humidity = data?.humidity || 0;

    // Environmental Status Logic
    let status = "Comfortable";
    let Icon = Sun;

    if (temp > 30) {
        status = "Hot";
        Icon = Sun;
    } else if (temp < 15) {
        status = "Cold";
        Icon = CloudFog;
    }

    if (humidity > 70) {
        status = "Humid";
        Icon = CloudRain;
    } else if (humidity < 30) {
        status = "Dry";
        Icon = Sun;
    }

    // Dual-metric layout
    return (
        <Card className="bg-slate-900/50 backdrop-blur border-white/10 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 flex justify-between items-center">
                    <span>Environment</span>
                    <span className="text-xs font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {status}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {/* Temperature */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <div className="p-2 rounded-full bg-orange-500/10 mb-2">
                        <Thermometer className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-3xl font-bold text-white">{temp.toFixed(1)}°</span>
                    <span className="text-xs text-orange-400/80 uppercase font-bold mt-1">Temp</span>

                    {/* Correction Factor Indicator (Conceptual) */}
                    <div className="w-full mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, Math.max(0, (temp / 50) * 100))}%` }} />
                    </div>
                </div>

                {/* Humidity */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                    <div className="p-2 rounded-full bg-cyan-500/10 mb-2">
                        <Droplets className="w-5 h-5 text-cyan-500" />
                    </div>
                    <span className="text-3xl font-bold text-white">{humidity.toFixed(1)}%</span>
                    <span className="text-xs text-cyan-400/80 uppercase font-bold mt-1">Humidity</span>

                    <div className="w-full mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, humidity)}%` }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
