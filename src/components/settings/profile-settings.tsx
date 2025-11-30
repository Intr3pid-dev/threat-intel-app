"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { CyberCard } from "@/components/ui/cyber-card";
import { User, Mail, MapPin, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { SessionTimeoutSettings } from "./session-timeout";

export function ProfileSettings() {
    const { user, updateProfile } = useAuthStore();
    const [loading, setLoading] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        location: user?.location || "",
        bio: user?.bio || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            updateProfile(formData);
            setLoading(false);
            toast.success("Profile Updated", {
                description: "Your operative profile has been successfully updated."
            });
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CyberCard title="Operative Profile" icon={<User className="h-4 w-4" />}>
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted-foreground uppercase">Codename</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="h-9 w-full rounded-md border border-input bg-background/50 pl-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted-foreground uppercase">Clearance Level</label>
                            <div className="relative">
                                <input
                                    value={user.role === 'admin' ? 'System Admin' : user.role === 'hunter' ? 'Threat Hunter' : 'Intel Analyst'}
                                    disabled
                                    className="h-9 w-full rounded-md border border-input/50 bg-muted/30 px-3 text-sm text-muted-foreground cursor-not-allowed"
                                    title="Role cannot be changed after registration"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground/70 font-mono">
                                ⚠ Role is locked after registration
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted-foreground uppercase">Secure Comms</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="operative@netwatch.io"
                                    className="h-9 w-full rounded-md border border-input bg-background/50 pl-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted-foreground uppercase">Base of Operations</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Unknown"
                                    className="h-9 w-full rounded-md border border-input bg-background/50 pl-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-muted-foreground uppercase">Mission Statement</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-primary/50" />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief operational history..."
                                className="w-full rounded-md border border-input bg-background/50 pl-9 pt-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(255,165,0,0.2)]"
                        >
                            <Save className="h-4 w-4" />
                            {loading ? "SAVING..." : "SAVE CHANGES"}
                        </button>
                    </div>
                </div>
            </CyberCard>

            <CyberCard title="Session Security" icon={<User className="h-4 w-4" />}>
                <SessionTimeoutSettings />
            </CyberCard>
        </div>
    );
}
