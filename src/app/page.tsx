"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, Activity, Globe, Server, Hash, LayoutGrid } from "lucide-react";
import { ThreatMap } from "@/components/ui/threat-map";
import { Card } from "@/components/ui/card";
import { SystemHealth } from "@/components/dashboard/system-health";
import { EventLog } from "@/components/dashboard/event-log";
import { QuickTools } from "@/components/dashboard/quick-tools";

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    activeThreats: 0,
    globalSensors: 0,
    monitoringStatus: "Init...",
    activeSessions: 0
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Simple auto-routing for dense UI
    router.push(`/tools/ip-lookup?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] gap-2 p-2 overflow-hidden bg-background text-foreground">
      {/* Top Section: Map & Key Stats (Approx 60% height) */}
      <div className="grid grid-cols-12 gap-2 flex-none h-[60%]">

        {/* Left Column: Stats & System (3 Cols) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-2 h-full">
          {/* Main Stats Block */}
          <div className="grid grid-cols-2 gap-2 flex-none">
            <Card className="flex flex-col items-center justify-center p-2 bg-primary/10 border-primary/20">
              <Activity className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-bold font-mono">{stats.activeSessions}</span>
              <span className="text-[10px] uppercase text-muted-foreground">Sessions</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-2 bg-primary/10 border-primary/20">
              <Globe className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-bold font-mono">{stats.globalSensors}</span>
              <span className="text-[10px] uppercase text-muted-foreground">Sensors</span>
            </Card>
          </div>

          {/* System Health Widget */}
          <div className="flex-1 min-h-0">
            <SystemHealth />
          </div>
        </div>

        {/* Center: Threat Map (6 Cols) */}
        <div className="col-span-12 md:col-span-6 h-full min-h-0">
          <div className="h-full w-full rounded border border-border overflow-hidden relative bg-black">
            <div className="absolute top-2 left-2 z-10 bg-black/70 px-2 py-1 border border-border/50 text-xs font-mono text-primary">
              LIVE THREAT FEED // GLOBAL
            </div>
            <ThreatMap />
          </div>
        </div>

        {/* Right Column: Quick Ops & Search (3 Cols) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-2 h-full">
          {/* Compact Search */}
          <Card className="flex-none p-2">
            <form onSubmit={handleSearch} className="flex gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="CMD > Search Target..."
                className="flex-1 bg-muted/20 border border-border/50 text-xs font-mono p-2 focus:border-primary focus:outline-none text-primary"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-sm">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </Card>

          {/* Quick Tools Grid */}
          <div className="flex-1 min-h-0">
            <QuickTools />
          </div>
        </div>
      </div>

      {/* Bottom Section: Logs & Analytics (Remaining height) */}
      <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
        {/* Event Log Ticker (8 Cols) */}
        <div className="col-span-12 md:col-span-8 h-full min-h-0">
          <EventLog />
        </div>

        {/* Status / Info Panel (4 Cols) */}
        <div className="col-span-12 md:col-span-4 h-full min-h-0">
          <Card title="NODE STATUS" icon={<Server className="h-4 w-4" />} className="h-full">
            <div className="grid grid-cols-2 gap-2 h-full content-start">
              <div className="flex items-center justify-between p-2 bg-muted/10 border border-border/30 rounded">
                <span className="text-[10px] text-muted-foreground">CORE</span>
                <span className="text-xs font-bold text-green-500">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/10 border border-border/30 rounded">
                <span className="text-[10px] text-muted-foreground">DB</span>
                <span className="text-xs font-bold text-green-500">SYNCED</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/10 border border-border/30 rounded">
                <span className="text-[10px] text-muted-foreground">API</span>
                <span className="text-xs font-bold text-green-500">READY</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/10 border border-border/30 rounded">
                <span className="text-[10px] text-muted-foreground">VPN</span>
                <span className="text-xs font-bold text-muted-foreground">IDLE</span>
              </div>
              <div className="col-span-2 mt-auto p-2 border-t border-border/30">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>BUILD: v2.4.0-RC1</span>
                  <span>LATENCY: 12ms</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
