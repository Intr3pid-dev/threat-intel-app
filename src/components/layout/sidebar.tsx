"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Globe, FileCode, Radio, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "IP Lookup", href: "/tools/ip-lookup", icon: Globe },
    { name: "Domain Lookup", href: "/tools/domain-lookup", icon: Globe },
    { name: "Hash Analysis", href: "/tools/hash-lookup", icon: FileCode },
    { name: "Threat Feeds", href: "/feeds", icon: Radio },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center gap-2 border-b border-border px-6">
                <Shield className="h-8 w-8 text-primary animate-pulse" />
                <span className="font-mono text-xl font-bold tracking-tighter text-glow">
                    NETWATCH
                </span>
            </div>

            <nav className="space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,243,255,0.1)]"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-0 w-full px-4">
                <div className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">System Online</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground font-mono">
                        v1.0.0-alpha
                    </div>
                </div>
            </div>
        </aside>
    );
}
