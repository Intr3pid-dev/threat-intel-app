"use client";

import { useState, useEffect, useRef } from "react";
import { CyberCard } from "@/components/ui/cyber-card";
import { Upload, Play, Terminal, Activity, Network, FileCode, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_LOGS = [
    "[INFO] Initializing sandbox environment...",
    "[INFO] Allocating resources: 4GB RAM, 2 vCPU",
    "[INFO] Network isolation: ENABLED",
    "[INFO] Loading sample: invoice_scan.exe",
    "[WARN] Suspicious header detected: UPX packed",
    "[EXEC] Process started: PID 4120",
    "[NET] DNS Query: c2-server.xyz",
    "[NET] HTTP POST /upload/data.bin (1024 bytes)",
    "[FILE] Created: C:\\Windows\\Temp\\payload.dll",
    "[REG] Modified: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    "[CRIT] Ransomware behavior detected: File encryption started",
    "[INFO] Analysis complete. Threat Score: 100/100",
];

export default function SandboxPage() {
    const [analyzing, setAnalyzing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const logEndRef = useRef<HTMLDivElement>(null);

    const startAnalysis = () => {
        setAnalyzing(true);
        setLogs([]);
        setProgress(0);

        let currentLog = 0;
        const interval = setInterval(() => {
            if (currentLog >= MOCK_LOGS.length) {
                clearInterval(interval);
                setAnalyzing(false);
                return;
            }

            setLogs((prev) => [...prev, MOCK_LOGS[currentLog]]);
            setProgress(((currentLog + 1) / MOCK_LOGS.length) * 100);
            currentLog++;
        }, 800);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-3xl font-bold tracking-tight text-glow">Malware Sandbox</h1>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-muted-foreground">ENV: SECURE_VM_01</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left Panel: Upload & Controls */}
                <div className="space-y-6 flex flex-col">
                    <CyberCard className="flex-1 flex flex-col justify-center items-center border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-foreground">Upload Sample</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-xs mt-2">
                            Drag & drop executable, document, or script to begin analysis.
                        </p>
                        <button className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                            Browse Files
                        </button>
                    </CyberCard>

                    <CyberCard title="Control Panel">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">OS Version</span>
                                <span className="font-mono">Windows 11 Pro</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-mono">60s (Default)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Network</span>
                                <span className="font-mono text-green-500">Tor & VPN</span>
                            </div>
                            <button
                                onClick={startAnalysis}
                                disabled={analyzing}
                                className="w-full flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                            >
                                <Play className="h-4 w-4" />
                                {analyzing ? "Running Analysis..." : "Detonate Payload"}
                            </button>
                        </div>
                    </CyberCard>
                </div>

                {/* Middle Panel: Console & Process Tree */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                    <CyberCard title="Live Execution Log" icon={<Terminal className="h-4 w-4" />} className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto bg-black/50 p-4 font-mono text-xs space-y-1 rounded-md border border-border/50 h-64">
                            {logs.length === 0 && (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Waiting for execution...
                                </div>
                            )}
                            {logs.map((log, i) => (
                                <div key={i} className={cn(
                                    "border-l-2 pl-2",
                                    log.includes("[CRIT]") ? "border-destructive text-destructive" :
                                        log.includes("[WARN]") ? "border-yellow-500 text-yellow-500" :
                                            log.includes("[NET]") ? "border-blue-500 text-blue-400" :
                                                "border-transparent text-muted-foreground"
                                )}>
                                    <span className="opacity-50 mr-2">{new Date().toLocaleTimeString()}</span>
                                    {log}
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                        {analyzing && (
                            <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
                                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                    </CyberCard>

                    <div className="grid grid-cols-2 gap-6 h-1/3 shrink-0">
                        <CyberCard title="Process Tree" icon={<Activity className="h-4 w-4" />}>
                            <div className="space-y-2 text-sm font-mono">
                                <div className="flex items-center gap-2">
                                    <FileCode className="h-4 w-4 text-muted-foreground" />
                                    <span>explorer.exe</span>
                                </div>
                                <div className="pl-4 border-l border-border ml-2 space-y-2">
                                    <div className="flex items-center gap-2 relative">
                                        <div className="absolute -left-4 top-1/2 w-3 h-px bg-border" />
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        <span className="text-destructive font-bold">invoice_scan.exe</span>
                                    </div>
                                    <div className="pl-4 border-l border-border ml-2 space-y-2">
                                        <div className="flex items-center gap-2 relative">
                                            <div className="absolute -left-4 top-1/2 w-3 h-px bg-border" />
                                            <FileCode className="h-4 w-4 text-muted-foreground" />
                                            <span>cmd.exe</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CyberCard>

                        <CyberCard title="Network Graph" icon={<Network className="h-4 w-4" />}>
                            <div className="h-full flex items-center justify-center bg-muted/10 rounded-md relative overflow-hidden">
                                {/* Mock Graph Visualization */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative h-20 w-20 rounded-full border-2 border-destructive animate-pulse flex items-center justify-center">
                                        <div className="h-3 w-3 bg-destructive rounded-full" />
                                    </div>
                                    <div className="absolute top-10 right-10 h-2 w-2 bg-blue-500 rounded-full" />
                                    <div className="absolute bottom-10 left-10 h-2 w-2 bg-green-500 rounded-full" />
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                        <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="currentColor" />
                                        <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="currentColor" />
                                    </svg>
                                </div>
                                <span className="relative z-10 text-xs font-mono bg-background/80 px-2 py-1 rounded">
                                    {analyzing ? "Traffic Detected" : "Idle"}
                                </span>
                            </div>
                        </CyberCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
