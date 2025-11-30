"use client";

import { useAuthStore } from "@/lib/store";
import { CyberCard } from "@/components/ui/cyber-card";
import { Activity, Search, ShieldAlert, FileText, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function UsageStats() {
    const { usageStats } = useAuthStore();

    const data = [
        { name: "API Calls", value: usageStats.apiCalls, color: "#0ea5e9" }, // Sky Blue
        { name: "Threats", value: usageStats.threatsAnalyzed, color: "#ef4444" }, // Red
        { name: "Reports", value: usageStats.reportsGenerated, color: "#eab308" }, // Yellow
    ];

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="rounded-md border border-border/50 bg-background/50 p-4 flex items-center gap-4 transition-all hover:bg-accent/50 hover:border-primary/30">
            <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
                <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">{title}</p>
                <p className="text-2xl font-bold font-mono tracking-wider">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total API Calls"
                    value={usageStats.apiCalls}
                    icon={Activity}
                    color="#0ea5e9"
                />
                <StatCard
                    title="Threats Analyzed"
                    value={usageStats.threatsAnalyzed}
                    icon={ShieldAlert}
                    color="#ef4444"
                />
                <StatCard
                    title="Reports Generated"
                    value={usageStats.reportsGenerated}
                    icon={FileText}
                    color="#eab308"
                />
                <StatCard
                    title="Last Active"
                    value={new Date(usageStats.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    icon={Clock}
                    color="#10b981"
                />
            </div>

            <CyberCard title="Activity Visualization" icon={<Activity className="h-4 w-4" />}>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CyberCard>
        </div>
    );
}
