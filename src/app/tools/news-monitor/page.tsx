"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, Radio, ExternalLink, Calendar } from "lucide-react";

export default function NewsMonitorPage() {
    const [query, setQuery] = useState("");
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNews = async (searchTerm: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/news?q=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            if (data.articles) {
                setArticles(data.articles);
            }
        } catch (error) {
            console.error("News fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) fetchNews(query);
    };

    // Initial load
    useEffect(() => {
        fetchNews("cybersecurity threat intelligence");
    }, []);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Radio className="h-6 w-6 text-primary" />
                    Global OSINT Monitor
                </h1>
            </div>

            <Card className="flex-none">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Monitor keyword (e.g. 'APT41', 'Zero-Day', 'Company Name')"
                            className="h-11 w-full rounded-md border border-border bg-background pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Scanning..." : "Monitor"}
                    </button>
                </form>
            </Card>

            <div className="grid gap-4 md:grid-cols-1 flex-1 min-h-0 overflow-y-auto pr-2">
                {articles.map((article, i) => (
                    <Card key={i} className="hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold">
                                        {article.source}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(article.pubDate).toLocaleString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground leading-tight">
                                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-primary underline-offset-4">
                                        {article.title}
                                    </a>
                                </h3>
                            </div>
                            <a href={article.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/20 rounded hover:bg-muted/40 text-muted-foreground hover:text-primary">
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
