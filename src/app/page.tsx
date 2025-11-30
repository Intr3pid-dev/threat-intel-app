"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield } from "lucide-react";
import { ThreatMap } from "@/components/ui/threat-map";

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"auto" | "ip" | "hash" | "domain" | "actor">("auto");

  const detectSearchType = (query: string): "ip" | "hash" | "domain" | "actor" => {
    // IP address pattern
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(query)) return "ip";

    // Hash patterns (MD5, SHA1, SHA256)
    const hashPattern = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/;
    if (hashPattern.test(query)) return "hash";

    // Domain pattern
    const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (domainPattern.test(query)) return "domain";

    // Default to threat actor search
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

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-8 text-center">
          {/* Logo/Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-16 w-16 text-primary" />
              <h1 className="text-6xl font-bold tracking-tight text-glow">
                THREAT<span className="text-primary">INTEL</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Real-time Cybersecurity Intelligence Platform
            </p>
          </div>

          {/* Search Interface */}
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex gap-2">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="auto">Auto-Detect</option>
                  <option value="ip">IP Address</option>
                  <option value="domain">Domain</option>
                  <option value="hash">File Hash</option>
                  <option value="actor">Threat Actor</option>
                </select>

                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search IP addresses, domains, file hashes, or threat actors..."
                    className="h-full w-full rounded-lg border border-border bg-card pl-12 pr-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Analyze
                </button>
              </div>
            </form>

            {/* Quick Examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Try:</span>
              <button
                onClick={() => setSearchQuery("8.8.8.8")}
                className="rounded-md border border-border/50 bg-muted/20 px-3 py-1 font-mono hover:border-primary/50 hover:bg-muted/40 transition-colors"
              >
                8.8.8.8
              </button>
              <button
                onClick={() => setSearchQuery("google.com")}
                className="rounded-md border border-border/50 bg-muted/20 px-3 py-1 font-mono hover:border-primary/50 hover:bg-muted/40 transition-colors"
              >
                google.com
              </button>
              <button
                onClick={() => setSearchQuery("44d88612fea8a8f36de82e1278abb02f")}
                className="rounded-md border border-border/50 bg-muted/20 px-3 py-1 font-mono text-xs hover:border-primary/50 hover:bg-muted/40 transition-colors"
              >
                44d88612...
              </button>
              <button
                onClick={() => setSearchQuery("APT29")}
                className="rounded-md border border-border/50 bg-muted/20 px-3 py-1 font-mono hover:border-primary/50 hover:bg-muted/40 transition-colors"
              >
                APT29
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">2.5K+</div>
              <div className="text-sm text-muted-foreground">Active Threats</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">142</div>
              <div className="text-sm text-muted-foreground">Global Sensors</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
