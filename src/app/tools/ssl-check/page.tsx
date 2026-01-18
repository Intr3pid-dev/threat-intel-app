"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Search, Lock, ShieldCheck, AlertTriangle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { containsProfanity } from "@/lib/security";

function SSLCheckContent() {
    const searchParams = useSearchParams();
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setDomain(query);
            handleCheck(query);
        }
    }, [searchParams]);

    const handleCheck = async (target: string) => {
        if (!target) return;

        if (containsProfanity(target)) {
            setError("Input contains restricted keywords.");
            return;
        }

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch(`/api/ssl?target=${encodeURIComponent(target)}`);
            const data = await res.json();

            if (data.error) {
                setError(data.details || data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Failed to contact server");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCheck(domain);
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">SSL Certificate Inspector</h1>
                </div>

                <Card className="mb-6">
                    <form onSubmit={onSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => {
                                    setDomain(e.target.value);
                                    if (error === "Input contains restricted keywords.") setError(null);
                                }}
                                placeholder="Enter domain (e.g. google.com)"
                                className="h-11 w-full rounded-md bg-background border border-border pl-9 text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "CHECKING..." : "INSPECT"}
                        </button>
                    </form>
                </Card>

                {error && (
                    <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm font-mono rounded-md mb-6">
                        ERROR: {error}
                    </div>
                )}

                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="VALIDATION STATUS" icon={<ShieldCheck className="h-4 w-4" />}>
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                <div className={cn(
                                    "flex h-24 w-24 items-center justify-center rounded-full border-4",
                                    result.valid ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                                )}>
                                    {result.valid ? <Lock className="h-10 w-10 text-green-500" /> : <AlertTriangle className="h-10 w-10 text-red-500" />}
                                </div>
                                <div>
                                    <h3 className={cn("text-xl font-bold", result.valid ? "text-green-500" : "text-red-500")}>
                                        {result.valid ? "SECURE CONNECTION" : "CERTIFICATE INVALID"}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Expires in <span className="text-foreground font-mono font-bold">{result.days_remaining}</span> days
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card title="CERTIFICATE DETAILS" icon={<Lock className="h-4 w-4" />}>
                            <div className="space-y-4 font-mono text-xs">
                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase">Issued To (CN)</p>
                                    <p className="text-primary truncate" title={result.subject?.CN}>{result.subject?.CN}</p>
                                    <p className="text-muted-foreground truncate">{result.subject?.O}</p>
                                </div>

                                <div className="h-px bg-border/50" />

                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase">Issued By</p>
                                    <p className="text-foreground truncate" title={result.issuer?.CN}>{result.issuer?.CN}</p>
                                    <p className="text-muted-foreground truncate">{result.issuer?.O}</p>
                                </div>

                                <div className="h-px bg-border/50" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground text-[10px] uppercase">Valid From</p>
                                        <p>{new Date(result.valid_from).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-[10px] uppercase">Valid Until</p>
                                        <p>{new Date(result.valid_to).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="h-px bg-border/50" />

                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase">Fingerprint</p>
                                    <p className="break-all text-[10px] text-muted-foreground">{result.fingerprint}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SSLCheckPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        }>
            <SSLCheckContent />
        </Suspense>
    );
}
