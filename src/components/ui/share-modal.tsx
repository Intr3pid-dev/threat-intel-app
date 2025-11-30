"use client";

import { useState } from "react";
import { Share2, Copy, FileDown, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

export function ShareModal({ isOpen, onClose, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        toast.info("Generating PDF report...", {
            description: "This may take a few seconds.",
        });
        setTimeout(() => {
            toast.success("Report downloaded successfully");
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-primary/50 bg-card p-6 shadow-[0_0_40px_rgba(0,243,255,0.1)] relative">
                <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                    ✕
                </button>

                <div className="mb-6 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-glow">Share Intelligence</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Report Link</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                readOnly
                                value="https://netwatch.intel/report/8a2b-3c4d"
                                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-muted-foreground focus:outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-3 text-primary hover:bg-primary/20"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleExport}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                        >
                            <FileDown className="h-4 w-4" />
                            Export as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
