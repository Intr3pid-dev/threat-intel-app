"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Globe, Shield, Server } from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/ui/map"), {
    ssr: false,
});

export default function IPLookupPage() {
    const searchParams = useSearchParams();
    const [ip, setIp] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setIp(query);
            handleSearchWithQuery(query);
        }
    }, []);

    const handleSearchWithQuery = async (query: string) => {
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">IP Lookup</h1>
            </div>

            <Card>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
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
                </form>
            </Card>

            {
                result && (
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
                )
            }
        </div >
    );
}
