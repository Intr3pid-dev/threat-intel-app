"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Globe, FileCode, Radio, LayoutDashboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/ui-store";
import { useEffect } from "react";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "IP Lookup", href: "/tools/ip-lookup", icon: Globe },
    { name: "Domain Lookup", href: "/tools/domain-lookup", icon: Globe },
    { name: "Hash Analysis", href: "/tools/hash-lookup", icon: FileCode },
    { name: "Threat Feeds", href: "/feeds", icon: Radio },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, closeSidebar } = useUIStore();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        closeSidebar();
    }, [pathname, closeSidebar]);

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSidebar();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [closeSidebar]);

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ease-in-out",
                    // Mobile: slide in/out
                    "md:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8 text-primary animate-pulse" />
                        <span className="font-mono text-xl font-bold tracking-tighter text-glow">
                            NETWATCH
                        </span>
                    </div>
                    {/* Close button (mobile only) */}
                    <button
                        onClick={closeSidebar}
                        className="md:hidden rounded-md p-1 hover:bg-accent transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
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

                {/* Status Indicator */}
                <div className="absolute bottom-4 left-0 w-full px-4">
                    <div className="rounded-md border border-border bg-card p-3">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono text-muted-foreground">
                                System Online
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
