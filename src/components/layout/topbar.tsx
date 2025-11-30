"use client";

import { Search, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "@/components/ui/notification-center";

export function TopBar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search intelligence..."
                        className="h-9 w-64 rounded-md border border-border bg-background pl-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <NotificationCenter />

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => router.push("/login")}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}
