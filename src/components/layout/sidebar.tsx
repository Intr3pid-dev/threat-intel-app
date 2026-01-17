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
                    "fixed left-0 top-0 z-50 h-screen w-16 border-r border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ease-in-out flex flex-col items-center py-4",
                    // Mobile: slide in/out
                    "md:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header (Logo Only) */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6">
                    <Shield className="h-6 w-6 text-primary" />
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1 w-full px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.name}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 mx-auto",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-subtle"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </Link>
                        );
                    })}
                </nav>

                {/* Status Indicator (Dot Only) */}
                <div className="mt-auto pb-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" title="System Online" />
                </div>
            </aside >
        </>
    );
}
