"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Shield, Calendar, Tag } from "lucide-react";
import { FeedDetailModal } from "@/components/ui/feed-detail-modal";

interface FeedItem {
    id: string;
    title: string;
    type: string;
    date: string;
    severity: string;
    description: string;
    tags: string[];
    source?: string;
    iocs?: string[];
}

export default function FeedsPage() {
    const [feeds, setFeeds] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFeeds();
    }, []);

    const fetchFeeds = async () => {
        try {
            const res = await fetch('/api/feeds');
            const data = await res.json();
            setFeeds(data);
        } catch (error) {
            console.error('Failed to fetch feeds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReadReport = (feed: FeedItem) => {
        setSelectedFeed(feed);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-glow">Threat Intelligence Feeds</h1>
                </div>

                {loading ? (
                    <Card>
                        <div className="flex items-center justify-center py-12">
                            <div className="text-muted-foreground">Loading threat feeds...</div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {feeds.map((feed) => (
                            <Card key={feed.id}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-full px-2 py-1 text-xs font-bold ${feed.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                                                feed.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {feed.severity}
                                            </span>
                                            <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                                                {feed.type}
                                            </span>
                                            {feed.source && (
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                    {feed.source}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">{feed.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{feed.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{feed.date}</span>
                                            </div>
                                            {feed.tags && feed.tags.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Tag className="h-3 w-3" />
                                                    <span>{feed.tags.slice(0, 3).join(', ')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleReadReport(feed)}
                                        className="rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        Read Report
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <FeedDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                feed={selectedFeed}
            />
        </>
    );
}
