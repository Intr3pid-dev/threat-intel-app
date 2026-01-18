"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Globe,
  Hash,
  Radio,
  Shield,
  Lock,
  Mail,
  Activity,
  Network,
  Target,
  Cpu
} from "lucide-react";
import { GlassTile } from "@/components/ui/glass-tile";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "IP Intelligence",
    description: "Lookup IP reputation, geolocation & threat data",
    icon: Globe,
    href: "/tools/ip-lookup",
    gradient: "from-blue-500/20 to-cyan-500/5"
  },
  {
    title: "Domain Intel",
    description: "WHOIS, DNS records & domain reputation",
    icon: Network,
    href: "/tools/domain-lookup",
    gradient: "from-purple-500/20 to-pink-500/5"
  },
  {
    title: "Hash Analysis",
    description: "Check file hashes against malware databases",
    icon: Hash,
    href: "/tools/hash-lookup",
    gradient: "from-orange-500/20 to-red-500/5"
  },
  {
    title: "Threat News",
    description: "Real-time cybersecurity news & mentions",
    icon: Radio,
    href: "/tools/news-monitor",
    gradient: "from-green-500/20 to-emerald-500/5"
  },
  {
    title: "SSL Inspector",
    description: "Analyze website SSL certificates",
    icon: Lock,
    href: "/tools/ssl-check",
    gradient: "from-yellow-500/20 to-amber-500/5"
  },
  {
    title: "Email Reputation",
    description: "Verify email validity & reputation",
    icon: Mail,
    href: "/tools/email-check",
    gradient: "from-cyan-500/20 to-blue-500/5"
  },
  {
    title: "Latency Monitor",
    description: "Real-time endpoint response times",
    icon: Activity,
    href: "/tools/latency-check",
    gradient: "from-red-500/20 to-orange-500/5"
  },
  {
    title: "MITRE ATT&CK",
    description: "Explore adversary tactics & techniques",
    icon: Target,
    href: "/tools/mitre",
    gradient: "from-indigo-500/20 to-purple-500/5"
  },
  {
    title: "Threat Feeds",
    description: "Aggregated threat intelligence feeds",
    icon: Cpu,
    href: "/feeds",
    gradient: "from-pink-500/20 to-rose-500/5"
  }
];

import { containsProfanity } from "@/lib/security";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!searchQuery.trim()) return;

    if (containsProfanity(searchQuery)) {
      setError("Input contains restricted keywords.");
      return;
    }

    const query = searchQuery.trim();

    // Smart routing based on input pattern
    const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    const hashPattern = /^[a-fA-F0-9]{32,64}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;

    if (ipPattern.test(query)) {
      router.push(`/tools/ip-lookup?q=${encodeURIComponent(query)}`);
    } else if (hashPattern.test(query)) {
      router.push(`/tools/hash-lookup?q=${encodeURIComponent(query)}`);
    } else if (emailPattern.test(query)) {
      router.push(`/tools/email-check?q=${encodeURIComponent(query)}`);
    } else if (domainPattern.test(query)) {
      router.push(`/tools/domain-lookup?q=${encodeURIComponent(query)}`);
    } else {
      // Default to news search for keywords
      router.push(`/tools/news-monitor?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      {/* Hero Section */}
      <div className="w-full max-w-4xl text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Open<span className="text-primary">ThreatData</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Open Source Intelligence & Threat Analysis Platform
        </p>

        {/* Global Search */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError("");
              }}
              placeholder="Search IP, domain, hash, email, or keyword..."
              className={cn(
                "w-full h-14 pl-14 pr-32 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50",
                error && "border-destructive focus:border-destructive focus:ring-destructive/20"
              )}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              Analyze
            </button>
          </div>
          {error && <p className="text-destructive text-sm mt-2 font-bold">{error}</p>}
          <p className="text-xs text-muted-foreground mt-3">
            Auto-detects input type and routes to appropriate tool
          </p>
        </form>
      </div>

      {/* Feature Tiles Grid */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((feature) => (
            <GlassTile
              key={feature.href}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-muted-foreground">
        <p>Powered by public OSINT APIs • No login required</p>
      </footer>
    </div>
  );
}
