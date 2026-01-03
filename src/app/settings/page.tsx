"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Palette, Monitor, BellRing, User, Activity, Settings } from "lucide-react";
import { toast } from "sonner";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { UsageStats } from "@/components/settings/usage-stats";
import { cn } from "@/lib/utils";

const THEMES = [
    { name: "Neon Cyan", value: "180 100% 50%" },
    { name: "Hacker Green", value: "142 76% 36%" },
    { name: "Purple Haze", value: "270 100% 60%" },
    { name: "Alert Red", value: "0 100% 50%" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"system" | "profile" | "usage">("system");
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

    const tabs = [
        { id: "system", label: "System", icon: Settings },
        { id: "profile", label: "Profile", icon: User },
        { id: "usage", label: "Usage Stats", icon: Activity },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-glow">Settings</h1>
                {activeTab === "system" && (
                    <button
                        onClick={handleSave}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(255,165,0,0.3)] transition-all"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 rounded-lg bg-muted/20 p-1 border border-primary/20 w-full md:w-fit overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === "system" && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card title="Appearance" icon={<Palette className="h-4 w-4" />}>
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
                        </Card>

                        <Card title="Display" icon={<Monitor className="h-4 w-4" />}>
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
                        </Card>

                        <Card title="Notifications" icon={<BellRing className="h-4 w-4" />}>
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
                        </Card>
                    </div>
                )}

                {activeTab === "profile" && <ProfileSettings />}

                {activeTab === "usage" && <UsageStats />}
            </div>
        </div>
    );
}
