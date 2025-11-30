"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/lib/store";
import { Shield, Fingerprint, ScanLine, Lock, UserCircle } from "lucide-react";

import { SignUpForm } from "@/components/auth/signup-form";

export default function LoginPage() {
    const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setLoading(true);

        // Simulate biometric scan delay
        setTimeout(() => {
            const success = login(username, password);
            if (success) {
                router.push("/");
            } else {
                setLoading(false);
                alert("Access Denied: Invalid Credentials");
            }
        }, 1500);
    };

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

                    {mode === "LOGIN" ? (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-500">
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
                                <label className="text-xs font-mono text-primary/70 uppercase">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-primary/50" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="ENTER PASSWORD..."
                                        className="h-11 w-full rounded-md border border-primary/20 bg-background/50 pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !username || !password}
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

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setMode("REGISTER")}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                                >
                                    NEW OPERATIVE? <span className="underline decoration-primary/50 underline-offset-4">REQUEST CLEARANCE</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <SignUpForm onToggleMode={() => setMode("LOGIN")} />
                    )}

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
