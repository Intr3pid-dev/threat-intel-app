"use client";

import { Card } from "@/components/ui/card";
import { Target, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MitrePage() {
    return (
        <div className="min-h-screen p-6 md:p-12">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">MITRE ATT&CK Explorer</h1>
                </div>
                <p className="text-muted-foreground mt-2">
                    Explore adversary tactics, techniques, and procedures (TTPs)
                </p>
            </div>

            {/* MITRE Navigator Embed */}
            <div className="max-w-6xl mx-auto">
                <Card className="p-0 overflow-hidden">
                    <div className="bg-muted/20 p-4 border-b border-border flex items-center justify-between">
                        <span className="text-sm font-mono text-muted-foreground">
                            attack.mitre.org/matrices/enterprise
                        </span>
                        <a
                            href="https://attack.mitre.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                            Open in new tab <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                    <iframe
                        src="https://attack.mitre.org/matrices/enterprise/"
                        className="w-full h-[70vh] border-0"
                        title="MITRE ATT&CK Matrix"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                </Card>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p>Content provided by MITRE Corporation. This is an embedded view.</p>
                    <p className="mt-1">
                        For full interactivity, visit{" "}
                        <a href="https://attack.mitre.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            attack.mitre.org
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
