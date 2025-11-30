"use client";

import { X, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface FeedDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    feed: {
        id: string;
        title: string;
        type: string;
        date: string;
        severity: string;
        description: string;
        tags: string[];
        source?: string;
        iocs?: string[];
    } | null;
}

export function FeedDetailModal({ isOpen, onClose, feed }: FeedDetailModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !feed) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
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
                        <h2 className="text-2xl font-bold text-glow">{feed.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{feed.date}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{feed.description}</p>
                </div>

                {/* Tags */}
                {feed.tags && feed.tags.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {feed.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* IOCs */}
                {feed.iocs && feed.iocs.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Indicators of Compromise (IOCs)</h3>
                        <div className="space-y-2">
                            {feed.iocs.map((ioc, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-3"
                                >
                                    <code className="text-sm font-mono text-primary">{ioc}</code>
                                    <button
                                        onClick={() => copyToClipboard(ioc)}
                                        className="rounded-md p-1.5 hover:bg-muted transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {copied && (
                            <p className="text-sm text-green-500 mt-2">Copied to clipboard!</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => copyToClipboard(JSON.stringify(feed, null, 2))}
                        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Copy className="h-4 w-4" />
                        Copy Report
                    </button>
                </div>
            </div>
        </div>
    );
}
