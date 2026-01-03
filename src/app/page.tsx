"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, Activity, Globe, Server } from "lucide-react";
import { ThreatMap } from "@/components/ui/threat-map";
import { Card } from "@/components/ui/card"; // Assuming we want to use standard Card or rename CyberCard

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"auto" | "ip" | "hash" | "domain" | "actor">("auto");
  const [stats, setStats] = useState({
    activeThreats: 0,
    globalSensors: 0,
    monitoringStatus: "Loading..."
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const detectSearchType = (query: string): "ip" | "hash" | "domain" | "actor" => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(query)) return "ip";

    const hashPattern = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/;
    if (hashPattern.test(query)) return "hash";

    const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (domainPattern.test(query)) return "domain";

    return "actor";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const type = searchType === "auto" ? detectSearchType(searchQuery) : searchType;

    switch (type) {
      case "ip":
        router.push(`/tools/ip-lookup?q=${encodeURIComponent(searchQuery)}`);
        break;
      case "hash":
        router.push(`/tools/hash-lookup?q=${encodeURIComponent(searchQuery)}`);
        break;
      case "domain":
        router.push(`/tools/domain-lookup?q=${encodeURIComponent(searchQuery)}`);
        break;
      case "actor":
        router.push(`/feeds?q=${encodeURIComponent(searchQuery)}`);
        break;
    }
  };

  return (
    <>
      <ThreatMap />

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl space-y-12 text-center">
          {/* Logo/Title */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Shield className="h-20 w-20 text-primary" />
              <h1 className="text-6xl font-extrabold tracking-tight text-foreground">
                NETWATCH
              </h1>
            </div>
            <p className="text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
              Enterprise Grade Cyber Intelligence & Threat Monitoring
            </p>
          </div>

          {/* Search Interface */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative shadow-card rounded-xl overflow-hidden">
              <div className="flex bg-card">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className="w-40 border-r border-border bg-card px-4 py-4 text-sm font-medium focus:outline-none focus:bg-muted/20 hover:bg-muted/10 transition-colors"
                >
                  <option value="auto">Auto-Detect</option>
                  <option value="ip">IP Address</option>
                  <option value="domain">Domain</option>
                  <option value="hash">File Hash</option>
                  <option value="actor">Threat Actor</option>
                </select>

                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search intelligence database..."
                    className="h-full w-full bg-card pl-14 pr-4 py-4 text-lg focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary px-8 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  ANALYZE
                </button>
              </div>
            </form>

            {/* Quick Examples */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="text-muted-foreground font-medium">Popular Searches:</span>
              <button
                onClick={() => setSearchQuery("8.8.8.8")}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-mono text-xs"
              >
                8.8.8.8
              </button>
              <button
                onClick={() => setSearchQuery("google.com")}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-mono text-xs"
              >
                google.com
              </button>
              <button
                onClick={() => setSearchQuery("APT29")}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-mono text-xs"
              >
                APT29
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-subtle border border-border">
              <Activity className="h-8 w-8 text-primary mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">{stats.activeThreats.toLocaleString()}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Threats</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-subtle border border-border">
              <Globe className="h-8 w-8 text-primary mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">{stats.globalSensors}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Global Sensors</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-subtle border border-border">
              <Server className="h-8 w-8 text-primary mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">System Status</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
