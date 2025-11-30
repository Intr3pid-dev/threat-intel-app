"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = Cookies.get("cookie-consent");
        if (!consent) {
            // Delay showing slightly for better UX
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        Cookies.set("cookie-consent", "true", { expires: 365 });
        setShow(false);
    };

    const decline = () => {
        Cookies.set("cookie-consent", "false", { expires: 365 });
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-primary/20 bg-background/95 backdrop-blur-md shadow-2xl p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            Privacy & Data Protection
                            <span className="text-[10px] uppercase tracking-wider border border-primary/30 px-2 py-0.5 rounded text-primary/70">GDPR Compliant</span>
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use cookies to enhance your operational experience, persist your terminal preferences, and analyze threat intelligence usage patterns.
                            By continuing to access this secure terminal, you consent to our data collection protocols.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={decline}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border rounded-md"
                        >
                            Decline
                        </button>
                        <button
                            onClick={accept}
                            className="px-6 py-2 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,165,0,0.3)] rounded-md whitespace-nowrap"
                        >
                            Accept Protocols
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
