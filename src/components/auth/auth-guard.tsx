"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useSessionManager } from "@/lib/session-manager";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, checkSession } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // Initialize session manager
    useSessionManager();

    // Check session on mount
    useEffect(() => {
        const initAuth = async () => {
            await checkSession();
            setIsChecking(false);
        };
        initAuth();
    }, [checkSession]);

    useEffect(() => {
        if (!isChecking && !isAuthenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [isAuthenticated, isChecking, pathname, router]);

    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    // Don't render children if not authenticated (unless on login page)
    if (!isAuthenticated && pathname !== "/login") {
        return null;
    }

    return <>{children}</>;
}
