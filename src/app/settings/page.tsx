"use client";

import { useState, useEffect } from "react";
import { CyberCard } from "@/components/ui/cyber-card";
import { Palette, Monitor, BellRing } from "lucide-react";
import { toast } from "sonner";

const THEMES = [
    { name: "Neon Cyan", value: "180 100% 50%" },
    { name: "Hacker Green", value: "142 76% 36%" },
    { name: "Purple Haze", value: "270 100% 60%" },
    { name: "Alert Red", value: "0 100% 50%" },
];

export default function SettingsPage() {
    const [primaryColor, setPrimaryColor] = useState("180 100% 50%");
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        // Apply theme color
        document.documentElement.style.setProperty("--color-primary", `hsl(${primaryColor})`);
        document.documentElement.style.setProperty("--color-ring", `hsl(${primaryColor})`);
    }, [primaryColor]);

    const handleSave = () => {
        toast.success("Settings saved successfully", {
            description: "System preferences have been updated.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-glow">System Settings</h1>
                <button
                    onClick={handleSave}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Save Changes
                </button>
            </div>

            <div className="grid gap-6">
                <CyberCard title="Appearance" icon={<Palette className="h-4 w-4" />}>
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Accent Color</label>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.name}
                                    onClick={() => setPrimaryColor(theme.value)}
                                    className={`flex flex-col items-center gap-2 rounded-md border p-4 transition-all hover:bg-accent ${primaryColor === theme.value
                                            ? "border-primary bg-primary/10"
                                            : "border-border"
                                        }`}
                                >
                                    <div
                                        className="h-8 w-8 rounded-full shadow-[0_0_10px_currentColor]"
                                        style={{ backgroundColor: `hsl(${theme.value})`, color: `hsl(${theme.value})` }}
                                    />
                                    <span className="text-xs font-medium">{theme.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </CyberCard>

                <CyberCard title="Display" icon={<Monitor className="h-4 w-4" />}>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">Reduced Motion</label>
                            <p className="text-xs text-muted-foreground">
                                Disable complex animations and transitions.
                            </p>
                        </div>
                        <button
                            onClick={() => setReducedMotion(!reducedMotion)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reducedMotion ? "bg-primary" : "bg-muted"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reducedMotion ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </CyberCard>

                <CyberCard title="Notifications" icon={<BellRing className="h-4 w-4" />}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border/50 pb-4">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">Threat Alerts</label>
                                <p className="text-xs text-muted-foreground">
                                    Receive notifications for critical threat level changes.
                                </p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary relative">
                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">System Reports</label>
                                <p className="text-xs text-muted-foreground">
                                    Daily summary of network activity.
                                </p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-muted relative">
                                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
                            </div>
                        </div>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
