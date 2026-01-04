"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

export function SystemHealth() {
    const [stats, setStats] = useState({ cpu: 45, ram: 62, net: 12 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                cpu: Math.floor(Math.random() * (60 - 30) + 30),
                ram: Math.floor(Math.random() * (70 - 60) + 60),
                net: Math.floor(Math.random() * (50 - 5) + 5),
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Helper for progress bars
    const Bar = ({ value, color }: { value: number; color: string }) => (
        <div className="h-1.5 w-full overflow-hidden bg-muted">
            <div
                className={`h-full transition-all duration-500 ${color}`}
                style={{ width: `${value}%` }}
            />
        </div>
    );

    return (
        <Card title="SYSTEM HEALTH" icon={<Activity className="h-4 w-4" />} className="h-full">
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                        <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU Load</span>
                        <span className="font-mono text-foreground">{stats.cpu}%</span>
                    </div>
                    <Bar value={stats.cpu} color="bg-blue-500" />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                        <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> Memory</span>
                        <span className="font-mono text-foreground">{stats.ram}%</span>
                    </div>
                    <Bar value={stats.ram} color="bg-purple-500" />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                        <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> Network (Mb/s)</span>
                        <span className="font-mono text-foreground">{stats.net}</span>
                    </div>
                    <Bar value={stats.net} color="bg-emerald-500" />
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 p-2 text-center border border-border">
                        <div className="text-[10px] uppercase text-muted-foreground">Uptime</div>
                        <div className="font-mono text-sm">14:22:01</div>
                    </div>
                    <div className="bg-muted/50 p-2 text-center border border-border">
                        <div className="text-[10px] uppercase text-muted-foreground">Status</div>
                        <div className="font-mono text-sm text-green-500">OPTIMAL</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
