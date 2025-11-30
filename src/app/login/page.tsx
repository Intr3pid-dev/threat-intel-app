"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/lib/store";
import { Shield, Fingerprint, ScanLine, Lock, UserCircle, ShieldAlert, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState<UserRole>("analyst");
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);

        // Simulate biometric scan delay
        setTimeout(() => {
            login(username, role);
            router.push("/");
        }, 2000);
    };

    const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
        { id: "analyst", label: "Intel Analyst", icon: UserCircle, color: "text-primary" },
        { id: "hunter", label: "Threat Hunter", icon: Crosshair, color: "text-red-500" },
        { id: "admin", label: "System Admin", icon: ShieldAlert, color: "text-amber-500" },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-40 pointer-events-none" />
            <div className="scanline" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-card/90 backdrop-blur-md p-8 shadow-[0_0_40px_rgba(255,165,0,0.1)]">
                    {/* Decorative Corners */}
                    <div className="absolute -left-1 -top-1 h-6 w-6 border-l-2 border-t-2 border-primary" />
                    <div className="absolute -right-1 -top-1 h-6 w-6 border-r-2 border-t-2 border-primary" />
                    <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-primary" />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-primary" />

                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 relative group">
                            <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20" />
                            <Shield className="h-10 w-10 text-primary animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-widest text-glow text-foreground">NETWATCH</h1>
                        <p className="text-xs text-primary/80 font-mono mt-2 tracking-[0.2em]">SECURE ACCESS TERMINAL</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-primary/70 uppercase">Operative Identity</label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-primary/50" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ENTER ID..."
                                    className="h-11 w-full rounded-md border border-primary/20 bg-background/50 pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
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

                        <button
                            type="submit"
                            disabled={loading || !username}
                            className="group relative w-full overflow-hidden rounded-md bg-primary px-4 py-3 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-center gap-2 relative z-10">
                                {loading ? (
                                    <>
                                        <ScanLine className="h-5 w-5 animate-spin" />
                                        <span className="font-mono text-sm font-bold tracking-wider">VERIFYING BIOMETRICS...</span>
                                    </>
                                ) : (
                                    <>
                                        <Fingerprint className="h-5 w-5" />
                                        <span className="font-mono text-sm font-bold tracking-wider">AUTHENTICATE</span>
                                    </>
                                )}
                            </div>
                            {loading && (
                                <div className="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-[2000ms] ease-out" style={{ width: "100%" }} />
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-primary/10 pt-4">
                        <div className="flex items-center justify-center gap-2 text-destructive/80 mb-2">
                            <Lock className="h-3 w-3" />
                            <span className="text-[10px] font-mono font-bold uppercase">Restricted Area</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono leading-relaxed opacity-60">
                            UNAUTHORIZED ACCESS IS A CLASS A FELONY.
                            <br />
                            ALL ACTIVITIES ARE MONITORED AND LOGGED.
                            <br />
                            SESSION ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
