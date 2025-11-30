"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

const THREAT_TYPES = [
    { title: "Intrusion Attempt", message: "Failed SSH login attempt from 192.168.1.105", type: "alert" as const, actionUrl: "/tools/ip-lookup?q=192.168.1.105" },
    { title: "Malware Detected", message: "Trojan.Win32.Generic blocked by firewall", type: "alert" as const, actionUrl: "/tools/hash-lookup?q=Trojan.Win32.Generic" },
    { title: "System Update", message: "Security definitions updated successfully", type: "success" as const, actionUrl: "/feeds" },
    { title: "Network Scan", message: "Port scan detected on external interface", type: "warning" as const, actionUrl: "/dashboard" },
    { title: "New Intel", message: "New threat feed data available from AlienVault", type: "info" as const, actionUrl: "/feeds" },
    { title: "High Traffic", message: "Unusual outbound traffic spike detected", type: "warning" as const, actionUrl: "/dashboard" },
];

export function ThreatSimulator() {
    const { addNotification, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) return;

        // Randomly generate notifications
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                const threat = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];

                addNotification({
                    title: threat.title,
                    message: threat.message,
                    type: threat.type,
                    actionUrl: threat.actionUrl
                });

                // Also show toast
                toast(threat.title, {
                    description: threat.message,
                    duration: 4000,
                    // Style based on type
                    className: threat.type === 'alert' ? 'border-red-500/50 bg-red-500/10' : undefined
                });
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [isAuthenticated, addNotification]);

    return null; // Invisible component
}
