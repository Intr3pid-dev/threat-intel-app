"use client";

import { Search, User, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "@/components/ui/notification-center";
import { useUIStore } from "@/lib/ui-store";

export function TopBar() {
    const { user, logout } = useAuthStore();
    const { toggleSidebar } = useUIStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
                {/* Hamburger Menu (Mobile Only) */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden rounded-md p-2 hover:bg-accent transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search Bar */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search intelligence..."
                        className="h-9 w-48 md:w-64 rounded-md border border-border bg-background pl-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                {/* Search Icon Only (Mobile) */}
                <button className="sm:hidden rounded-md p-2 hover:bg-accent transition-colors">
                    <Search className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <NotificationCenter />

                {user ? (
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 md:px-3 py-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-md p-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                ) : null}
            </div>
        </header>
    );
}
