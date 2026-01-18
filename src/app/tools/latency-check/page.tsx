"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, Activity, Zap, Server, Play, Square, ArrowLeft, Globe, Shield, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Link from "next/link";
import { containsProfanity } from "@/lib/security";

export default function LatencyCheckPage() {
    const [target, setTarget] = useState("");
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [currentLatency, setCurrentLatency] = useState<number | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [networkDetails, setNetworkDetails] = useState<any>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isMonitoring && target) {
            // Initial check
            checkLatency(target);

            // Detailed Loop
            interval = setInterval(() => {
                checkLatency(target);
            }, 2000);
        }

        return () => clearInterval(interval);
    }, [isMonitoring, target]);

    const checkLatency = async (url: string) => {
        try {
            const res = await fetch(`/api/latency-check?target=${encodeURIComponent(url)}`);
            const data = await res.json();

            if (!data.error) {
                const newData = {
                    time: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                    latency: data.latency_ms,
                    status: data.status
                };

                setCurrentLatency(data.latency_ms);
                setStatus(data.status);
                // Increased history retention to ~2 minutes (60 points)
                setHistory(prev => [...prev.slice(-59), newData]);

                // Update network details if available
                if (data.ip) {
                    setNetworkDetails({
                        ip: data.ip,
                        family: data.ip_family,
                        server: data.details?.server,
                        protocol: data.details?.protocol,
                        contentType: data.details?.contentType
                    });
                }
            } else {
                // Handle specific API errors
                setError(data.error);
                setIsMonitoring(false);
            }
        } catch (error) {
            console.error("Latency check error:", error);
            setIsMonitoring(false);
        }
    };

    const handleToggle = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!target) return;

        if (containsProfanity(target)) {
            setError("Input contains restricted keywords.");
            return;
        }

        if (isMonitoring) {
            setIsMonitoring(false);
        } else {
            setHistory([]);
            setNetworkDetails(null);
            setIsMonitoring(true);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Latency Monitor</h1>
                </div>

                <Card className="mb-6">
                    <form onSubmit={handleToggle} className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => {
                                        setTarget(e.target.value);
                                        setError("");
                                    }}
                                    disabled={isMonitoring}
                                    placeholder="Enter endpoint (e.g. google.com)"
                                    className="h-11 w-full rounded-md border border-border bg-background pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                className={cn(
                                    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-8 text-sm font-bold transition-colors w-32",
                                    isMonitoring
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                )}
                            >
                                {isMonitoring ? <><Square className="h-4 w-4" /> STOP</> : <><Play className="h-4 w-4" /> START</>}
                            </button>
                        </div>
                        {error && <p className="text-destructive text-sm font-bold">{error}</p>}
                    </form>
                </Card>

                {/* Results Area */}
                {history.length > 0 && (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card title="Real-Time Response" icon={<Zap className="h-4 w-4" />}>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={history}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                            <XAxis dataKey="time" hide />
                                            <YAxis domain={[0, 'auto']} hide />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                                                itemStyle={{ color: 'var(--color-primary)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="latency"
                                                stroke="var(--color-primary)"
                                                strokeWidth={2}
                                                dot={false}
                                                isAnimationActive={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card title="Metric Summary" icon={<Server className="h-4 w-4" />}>
                                <div className="flex flex-col justify-center gap-6 py-8">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground uppercase tracking-widest">Current Latency</p>
                                        <h2 className={cn(
                                            "text-6xl font-black font-mono mt-2",
                                            currentLatency && currentLatency < 100 ? "text-green-500" :
                                                currentLatency && currentLatency < 300 ? "text-orange-500" : "text-red-500"
                                        )}>
                                            {currentLatency} <span className="text-xl text-muted-foreground">ms</span>
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center border-t border-border/50 pt-6">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Status</p>
                                            <p className="text-xl font-bold text-foreground">{status}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Packets</p>
                                            <p className="text-xl font-bold text-foreground">{history.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Network Details Card */}
                        {networkDetails && (
                            <Card title="Target Analysis" icon={<Network className="h-4 w-4" />}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                                            <Globe className="h-3 w-3" />
                                            Resolved IP
                                        </div>
                                        <div className="font-mono text-lg">{networkDetails.ip}</div>
                                        <div className="text-xs text-muted-foreground">{networkDetails.family}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                                            <Shield className="h-3 w-3" />
                                            Protocol
                                        </div>
                                        <div className="font-mono text-lg">{networkDetails.protocol}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                                            <Server className="h-3 w-3" />
                                            Server Header
                                        </div>
                                        <div className="font-mono text-lg truncate" title={networkDetails.server}>
                                            {networkDetails.server}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                                            <Activity className="h-3 w-3" />
                                            Content Type
                                        </div>
                                        <div className="font-mono text-lg truncate" title={networkDetails.contentType}>
                                            {networkDetails.contentType}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
