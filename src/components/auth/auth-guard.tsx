"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useSessionManager } from "@/lib/session-manager";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();
    const pathname = usePathname();

    // Initialize session manager
    useSessionManager();

    useEffect(() => {
        if (!isAuthenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [isAuthenticated, pathname, router]);

    // Don't render children if not authenticated (unless on login page)
    if (!isAuthenticated && pathname !== "/login") {
        return null;
    }

    return <>{children}</>;
}
