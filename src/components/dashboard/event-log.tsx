"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Scroll, Terminal, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
    id: number;
    type: "info" | "warning" | "error" | "success";
    message: string;
    timestamp: string;
}

export function EventLog() {
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 1, type: "info", message: "System initialization sequence started", timestamp: "14:20:05" },
        { id: 2, type: "success", message: "Database connection established (Core)", timestamp: "14:20:06" },
        { id: 3, type: "info", message: "Loading threat signatures v2025.01.03", timestamp: "14:20:07" },
        { id: 4, type: "warning", message: "Latency spike detected on Node-7", timestamp: "14:21:45" },
        { id: 5, type: "success", message: "Latency resolved. Synced.", timestamp: "14:21:50" },
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        // Simulate incoming logs
        const interval = setInterval(() => {
            const types: LogEntry["type"][] = ["info", "success", "warning"];
            const messages = [
                "Scanning subnet 192.168.1.x",
                "Packet inspected: 4096 bytes",
                "Signature match: Clean",
                "Updating reputation cache",
                "Peer connected: Frankfurt-03"
            ];

            const newLog: LogEntry = {
                id: Date.now(),
                type: types[Math.floor(Math.random() * types.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
            };

            setLogs(prev => [...prev.slice(-19), newLog]); // Keep last 20
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "error": return <ShieldAlert className="h-3 w-3 text-red-500" />;
            case "warning": return <Info className="h-3 w-3 text-orange-400" />;
            case "success": return <CheckCircle className="h-3 w-3 text-green-500" />;
            default: return <Terminal className="h-3 w-3 text-blue-400" />;
        }
    };

    return (
        <Card title="EVENT LOG" icon={<Scroll className="h-4 w-4" />} className="h-full flex flex-col">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto font-mono text-xs space-y-1 max-h-[150px] pr-1"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 border-b border-border/30 pb-1 last:border-0 hover:bg-muted/30 p-1 rounded-sm">
                        <span className="text-muted-foreground opacity-50 whitespace-nowrap">[{log.timestamp}]</span>
                        <span className="mt-0.5 shrink-0">{getIcon(log.type)}</span>
                        <span className={cn(
                            "break-all",
                            log.type === "error" ? "text-red-400" :
                                log.type === "warning" ? "text-orange-300" :
                                    log.type === "success" ? "text-green-400" : "text-muted-foreground"
                        )}>
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
