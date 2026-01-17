"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Search, Globe, Calendar, Shield, Server, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function DomainLookupContent() {
    const searchParams = useSearchParams();
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [whoisData, setWhoisData] = useState<any>(null);
    const [reputation, setReputation] = useState<any>(null);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setDomain(query);
            handleSearchWithQuery(query);
        }
    }, [searchParams]);

    const handleSearchWithQuery = async (query: string) => {
        setLoading(true);
        setWhoisData(null);
        setReputation(null);

        try {
            const [whoisRes, repRes] = await Promise.allSettled([
                fetch(`/api/domain/whois?domain=${encodeURIComponent(query)}`),
                fetch(`/api/domain/reputation?domain=${encodeURIComponent(query)}`)
            ]);

            if (whoisRes.status === 'fulfilled' && whoisRes.value.ok) {
                const data = await whoisRes.value.json();
                setWhoisData(data);
            }

            if (repRes.status === 'fulfilled' && repRes.value.ok) {
                const data = await repRes.value.json();
                setReputation(data);
            }
        } catch (error) {
            console.error('Domain lookup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSearchWithQuery(domain);
    };

    const calculateDomainAge = (createdDate: string) => {
        if (createdDate === 'Unknown') return 'Unknown';
        try {
            const created = new Date(createdDate);
            const now = new Date();
            const years = Math.floor((now.getTime() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            const months = Math.floor((now.getTime() - created.getTime()) / (30 * 24 * 60 * 60 * 1000)) % 12;
            return `${years}y ${months}m`;
        } catch {
            return 'Unknown';
        }
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
                    <h1 className="text-3xl font-bold tracking-tight">Domain Intelligence</h1>
                </div>

                <Card className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="Enter domain (e.g., example.com)"
                                className="h-11 w-full rounded-md border border-border bg-background pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "Lookup"}
                        </button>
                    </form>
                </Card>

                {whoisData && reputation && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card title="Threat Intelligence" icon={<Shield className="h-4 w-4" />}>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "flex h-20 w-20 items-center justify-center rounded-full border-4",
                                        reputation.isClean
                                            ? "border-green-500/50 bg-green-500/10"
                                            : "border-red-500/50 bg-red-500/10"
                                    )}>
                                        {reputation.isClean ? (
                                            <CheckCircle className="h-10 w-10 text-green-500" />
                                        ) : (
                                            <AlertTriangle className="h-10 w-10 text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className={cn(
                                            "text-2xl font-bold",
                                            reputation.isClean ? "text-green-500" : "text-red-500"
                                        )}>
                                            {reputation.threatLevel}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Threat Score: {reputation.threatScore}/100
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card title="WHOIS Information" icon={<Globe className="h-4 w-4" />}>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Domain</p>
                                    <p className="font-mono text-sm font-medium">{whoisData.domain}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Registrar</p>
                                    <p className="text-sm">{whoisData.registrar}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created</p>
                                        <p className="text-sm">{whoisData.createdDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Domain Age</p>
                                        <p className="text-sm font-medium text-primary">
                                            {calculateDomainAge(whoisData.createdDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card title="Name Servers" icon={<Server className="h-4 w-4" />}>
                            <div className="space-y-2">
                                {whoisData.nameServers && whoisData.nameServers.length > 0 ? (
                                    whoisData.nameServers.map((ns: string, i: number) => (
                                        <div key={i} className="rounded-md border border-border/50 bg-muted/20 p-2">
                                            <p className="font-mono text-sm">{ns}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No nameserver information available</p>
                                )}
                            </div>
                        </Card>

                        <Card title="Additional Details" icon={<Calendar className="h-4 w-4" />}>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Registrant Organization</p>
                                    <p className="text-sm">{whoisData.registrantOrg}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Country</p>
                                    <p className="text-sm">{whoisData.registrantCountry}</p>
                                </div>
                                <div className="pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground">Data Source: {whoisData.source}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DomainLookupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        }>
            <DomainLookupContent />
        </Suspense>
    );
}
