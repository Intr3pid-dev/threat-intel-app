"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/lib/store";
import { Shield, UserPlus, ScanLine, Lock, UserCircle, ShieldAlert, Crosshair, Mail, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

interface SignUpFormProps {
    onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("analyst");
    const [loading, setLoading] = useState(false);
    const register = useAuthStore((state) => state.register);
    const router = useRouter();

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) return;

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const success = register({
                id: "", // ID generated in store
                name: username,
                email,
                password, // In real app, hash this!
                role,
                bio: "New Operative",
                location: "Unknown"
            });

            if (success) {
                // Persist preferences if consent given
                if (Cookies.get("cookie-consent") === "true") {
                    Cookies.set("user-role-pref", role, { expires: 30 });
                }
                router.push("/");
            } else {
                setLoading(false);
                // Simple alert for now, could be a toast
                alert("Operative identity already exists.");
            }
        }, 1500);
    };

    const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
        { id: "analyst", label: "Intel Analyst", icon: UserCircle, color: "text-primary" },
        { id: "hunter", label: "Threat Hunter", icon: Crosshair, color: "text-red-500" },
        { id: "admin", label: "System Admin", icon: ShieldAlert, color: "text-amber-500" },
    ];

    return (
        <form onSubmit={handleSignUp} className="space-y-5 animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary/70 uppercase">Operative Identity</label>
                    <div className="relative">
                        <UserCircle className="absolute left-3 top-3 h-5 w-5 text-primary/50" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="CHOOSE USERNAME..."
                            className="h-11 w-full rounded-md border border-primary/20 bg-background/50 pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary/70 uppercase">Secure Comms</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-primary/50" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="EMAIL ADDRESS..."
                            className="h-11 w-full rounded-md border border-primary/20 bg-background/50 pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary/70 uppercase">Access Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-3 h-5 w-5 text-primary/50" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="PASSWORD..."
                            className="h-11 w-full rounded-md border border-primary/20 bg-background/50 pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary/70 uppercase">Clearance Level</label>
                    <div className="grid grid-cols-3 gap-2">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 rounded-md border p-2 transition-all hover:bg-primary/5",
                                    role === r.id
                                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(255,165,0,0.2)]"
                                        : "border-primary/20 text-muted-foreground hover:border-primary/50"
                                )}
                            >
                                <r.icon className={cn("h-5 w-5", role === r.id ? "text-primary" : "text-muted-foreground")} />
                                <span className="text-[10px] font-mono font-bold uppercase">{r.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-md bg-primary px-4 py-3 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
                <div className="flex items-center justify-center gap-2 relative z-10">
                    {loading ? (
                        <>
                            <ScanLine className="h-5 w-5 animate-spin" />
                            <span className="font-mono text-sm font-bold tracking-wider">INITIALIZING PROFILE...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className="h-5 w-5" />
                            <span className="font-mono text-sm font-bold tracking-wider">CREATE IDENTITY</span>
                        </>
                    )}
                </div>
                {loading && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-[2500ms] ease-out" style={{ width: "100%" }} />
                )}
            </button>

            <div className="text-center pt-2">
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                    ALREADY HAVE CLEARANCE? <span className="underline decoration-primary/50 underline-offset-4">ACCESS TERMINAL</span>
                </button>
            </div>
        </form>
    );
}
