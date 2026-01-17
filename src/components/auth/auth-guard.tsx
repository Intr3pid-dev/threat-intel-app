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
        // Protected routes that ALWAYS require login
        const protectedRoutes = ["/settings", "/admin"];
        const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

        if (!isChecking && !isAuthenticated && isProtected) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isChecking, pathname, router]);

    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    // Protected routes check for rendering
    const protectedRoutes = ["/settings", "/admin"];
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    if (!isAuthenticated && isProtected) {
        return null;
    }

    return <>{children}</>;
}
