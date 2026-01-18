"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Globe, Shield, Server, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/ui/map"), {
    ssr: false,
});

import { containsProfanity } from "@/lib/security";

function IPLookupContent() {
    const searchParams = useSearchParams();
    const [ip, setIp] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setIp(query);
            handleSearchWithQuery(query);
        }
    }, [searchParams]);

    const handleSearchWithQuery = async (query: string) => {
        if (containsProfanity(query)) {
            setError("Input contains restricted keywords.");
            return;
        }
        setError("");

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`/api/ip?target=${query}`);
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setResult(data);
        } catch (error) {
            console.error(error);
            setResult({
                ip: query,
                location: "Unknown Location",
                isp: "Unknown ISP",
                asn: "N/A",
                score: 0,
                coordinates: "0, 0",
                tags: ["Scan Failed"],
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSearchWithQuery(ip);
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <Globe className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">IP Intelligence</h1>
                </div>

                <Card className="mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={ip}
                                    onChange={(e) => {
                                        setIp(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                                    className="h-11 w-full rounded-md border border-border bg-background pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? "Scanning..." : "Analyze"}
                            </button>
                        </div>
                        {error && <p className="text-destructive text-sm font-bold">{error}</p>}
                    </form>
                </Card>

                {result && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card title="Geo-Location" icon={<MapPin className="h-4 w-4" />}>
                            <div className="space-y-4">
                                <div className="aspect-video w-full rounded-md bg-muted/20 border border-border/50 overflow-hidden relative">
                                    <MapComponent lat={result.lat || 37.7749} lng={result.lng || -122.4194} popupText={result.location} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">City/Country</p>
                                        <p className="font-mono text-sm">{result.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Coordinates</p>
                                        <p className="font-mono text-sm">{result.coordinates}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <Card title="Network Info" icon={<Server className="h-4 w-4" />}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">ISP</p>
                                        <p className="font-mono text-sm">{result.isp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">ASN</p>
                                        <p className="font-mono text-sm">{result.asn}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Threat Intelligence" icon={<Shield className="h-4 w-4" />}>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-500/50 bg-green-500/10">
                                        <span className="text-xl font-bold text-green-500">{result.score}%</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Clean</p>
                                        <p className="text-xs text-muted-foreground">No malicious activity detected recently.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {result.tags.map((tag: string) => (
                                        <span key={tag} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] text-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function IPLookupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        }>
            <IPLookupContent />
        </Suspense>
    );
}
