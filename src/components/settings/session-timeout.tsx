"use client";

import { useAuthStore } from "@/lib/store";
import { Clock } from "lucide-react";
import { toast } from "sonner";

const TIMEOUT_OPTIONS = [
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
];

function SessionTimeoutSettings() {
    const { preferences, setPreferences } = useAuthStore();

    const handleTimeoutChange = (value: number) => {
        setPreferences({ sessionTimeout: value });
        toast.success("Session Timeout Updated", {
            description: `Your session will now expire after ${value} minutes of inactivity.`
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-mono font-bold text-foreground">Idle Timeout</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Automatically log out after period of inactivity for enhanced security.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {TIMEOUT_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleTimeoutChange(option.value)}
                        className={`
                            px-3 py-2 rounded-md border text-xs font-mono font-bold transition-all
                            ${preferences.sessionTimeout === option.value
                                ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(255,165,0,0.2)]"
                                : "border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }
                        `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground/70 font-mono">
                <span>ℹ</span>
                <span>Current: {preferences.sessionTimeout} min idle timeout</span>
            </div>
        </div>
    );
}

export { SessionTimeoutSettings };
