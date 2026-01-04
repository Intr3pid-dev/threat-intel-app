"use client";

import { Card } from "@/components/ui/card";
import { Search, Globe, FileCode, Shield, Database, Lock, RefreshCcw, Network } from "lucide-react";
import Link from "next/link";

export function QuickTools() {
    const tools = [
        { name: "IP Scan", href: "/tools/ip-lookup", icon: Globe, color: "text-blue-400" },
        { name: "Hash Check", href: "/tools/hash-lookup", icon: FileCode, color: "text-purple-400" },
        { name: "Domain", href: "/tools/domain-lookup", icon: Network, color: "text-yellow-400" },
        { name: "Sandbox", href: "/tools/sandbox", icon: Shield, color: "text-green-400" },
        { name: "DB Query", href: "/settings", icon: Database, color: "text-cyan-400" },
        { name: "Enc. Tool", href: "/tools/crypto", icon: Lock, color: "text-red-400" },
    ];

    return (
        <Card title="QUICK OPS" icon={<RefreshCcw className="h-4 w-4" />} className="h-full">
            <div className="grid grid-cols-3 gap-2 h-full">
                {tools.map((tool) => (
                    <Link
                        key={tool.name}
                        href={tool.href}
                        className="flex flex-col items-center justify-center p-2 rounded bg-muted/20 border border-border/50 hover:bg-primary/20 hover:border-primary transition-all text-center gap-1 group"
                    >
                        <tool.icon className={`h-5 w-5 ${tool.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-medium uppercase tracking-tight text-muted-foreground group-hover:text-foreground">
                            {tool.name}
                        </span>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
