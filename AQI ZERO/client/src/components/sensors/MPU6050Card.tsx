import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Activity, ArrowUpCircle } from "lucide-react";

interface MPU6050Data {
    accel: { x: number; y: number; z: number };
    gyro: { x: number; y: number; z: number };
}

interface MPU6050CardProps {
    data: MPU6050Data | undefined;
}

export function MPU6050Card({ data }: MPU6050CardProps) {
    const accel = data?.accel || { x: 0, y: 0, z: 0 };
    const gyro = data?.gyro || { x: 0, y: 0, z: 0 };

    // Calculate generic stability score based on gyro movement
    const movement = Math.abs(gyro.x) + Math.abs(gyro.y) + Math.abs(gyro.z);
    const stability = Math.max(0, 100 - movement * 10);

    let state = "Stable";
    if (movement > 5) state = "Moving";
    if (movement > 20) state = "Rotating";

    // Pitch calculation (simplified for visualization)
    const pitch = Math.atan2(accel.x, Math.sqrt(accel.y * accel.y + accel.z * accel.z)) * 180 / Math.PI;
    const roll = Math.atan2(accel.y, Math.sqrt(accel.x * accel.x + accel.z * accel.z)) * 180 / Math.PI;

    return (
        <Card className="bg-slate-900/50 backdrop-blur border-white/10 shadow-lg col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    IMU Telemetry (MPU6050)
                </CardTitle>
                <div className="flex gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> {state}</span>
                    <span>Stability: {stability.toFixed(0)}%</span>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Artificial Horizon (Visual Representation) */}
                <div className="relative h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
                    {/* Sky */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-sky-900/50 transition-transform duration-300"
                        style={{ transform: `translateY(${pitch}px) rotate(${roll}deg)` }} />
                    {/* Ground */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-amber-900/50 transition-transform duration-300"
                        style={{ transform: `translateY(${pitch}px) rotate(${roll}deg)` }} />

                    {/* Horizon Line */}
                    <div className="absolute w-full h-[1px] bg-white/50"
                        style={{ transform: `translateY(${pitch}px) rotate(${roll}deg)` }} />

                    {/* Crosshair (Fixed) */}
                    <div className="absolute w-24 h-[1px] bg-yellow-400" />
                    <div className="absolute h-4 w-[1px] bg-yellow-400" />

                    <span className="absolute bottom-1 right-2 text-[10px] text-slate-500 font-mono">AH-VIS</span>
                </div>

                {/* Accelerometer Data */}
                <div className="space-y-2 font-mono text-sm">
                    <h4 className="text-xs uppercase text-slate-500 font-bold mb-2">Accelerometer (g)</h4>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">X</span>
                        <span className={accel.x > 0.5 ? "text-yellow-400" : "text-white"}>{accel.x.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">Y</span>
                        <span className={accel.y > 0.5 ? "text-yellow-400" : "text-white"}>{accel.y.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">Z</span>
                        <span className="text-white">{accel.z.toFixed(3)}</span>
                    </div>
                </div>

                {/* Gyroscope Data */}
                <div className="space-y-2 font-mono text-sm">
                    <h4 className="text-xs uppercase text-slate-500 font-bold mb-2">Gyroscope (°/s)</h4>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">Pitch</span>
                        <span className="text-white">{gyro.x.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">Roll</span>
                        <span className="text-white">{gyro.y.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-400">Yaw</span>
                        <span className="text-white">{gyro.z.toFixed(1)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
