"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Search, AlertTriangle, Hash, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function HashLookupContent() {
    const searchParams = useSearchParams();
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setHash(query);
            handleSearchWithQuery(query);
        }
    }, [searchParams]);

    const handleSearchWithQuery = async (query: string) => {
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hash: query })
            });
            const data = await res.json();

            if (data.found) {
                setResult(data);
            } else {
                setResult({
                    found: false,
                    verdict: "Clean / Unknown",
                    family: "No threats detected",
                    score: 0,
                    engines: { detected: 0, total: 0, details: [] },
                    tags: ["Clean"]
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSearchWithQuery(hash);
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <Hash className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Hash Analysis</h1>
                </div>

                <Card className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={hash}
                                onChange={(e) => setHash(e.target.value)}
                                placeholder="Enter file hash (MD5, SHA-1, SHA-256)"
                                className="h-11 w-full rounded-md border border-border bg-background pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "Scan Hash"}
                        </button>
                    </form>
                </Card>

                {result && (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-1" title="Verdict">
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-destructive/50 bg-destructive/10">
                                        <div className="text-center">
                                            {result.found ? (
                                                <>
                                                    <span className="block text-3xl font-bold text-destructive">{result.score}/100</span>
                                                    <span className="text-xs text-muted-foreground">Threat Score</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="block text-3xl font-bold text-green-500">0/100</span>
                                                    <span className="text-xs text-muted-foreground">Clean</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h3 className={cn("text-xl font-bold uppercase tracking-widest", result.found ? "text-destructive" : "text-green-500")}>
                                            {result.verdict}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{result.family}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="md:col-span-2" title="File Details">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground">Hash</p>
                                        <p className="font-mono text-xs break-all text-primary">{hash}</p>
                                    </div>
                                    {result.tags && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-muted-foreground mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.tags.map((tag: string, i: number) => (
                                                    <span key={i} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {result.engines && result.engines.details && result.engines.details.length > 0 && (
                            <Card title="Engine Detection Results">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {result.engines.details.map((engine: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between rounded-md border border-border/50 bg-muted/20 p-3">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                                <span className="font-medium text-sm">{engine.engine}</span>
                                            </div>
                                            <span className="text-xs font-mono text-destructive">
                                                {engine.result}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function HashLookupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        }>
            <HashLookupContent />
        </Suspense>
    );
}
