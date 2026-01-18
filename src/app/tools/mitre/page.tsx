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
                {/* MITRE Navigator Launcher */}
                <div className="max-w-6xl mx-auto">
                    <Card className="p-12 text-center bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center border-dashed border-2">
                        <div className="bg-primary/10 p-4 rounded-full mb-6">
                            <Target className="h-16 w-16 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Launch Interactive Matrix</h2>
                        <p className="text-muted-foreground max-w-lg mb-8">
                            The MITRE ATT&CK Matrix requires a full browser window for the best experience.
                            Security policies prevent embedding the interactive view directly.
                        </p>
                        <a
                            href="https://attack.mitre.org/matrices/enterprise/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                        >
                            Open Enterprise Matrix <ExternalLink className="h-5 w-5" />
                        </a>
                    </Card>

                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                        <Card className="p-4 hover:bg-muted/50 transition-colors">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <ExternalLink className="h-4 w-4 text-primary" /> Enterprise
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Adversary behavior in Windows, macOS, Linux, and Cloud environments.
                            </p>
                            <a href="https://attack.mitre.org/matrices/enterprise/" target="_blank" className="text-xs text-primary mt-2 block hover:underline">Launch Enterprise &rarr;</a>
                        </Card>
                        <Card className="p-4 hover:bg-muted/50 transition-colors">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <ExternalLink className="h-4 w-4 text-purple-500" /> Mobile
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Techniques used against iOS and Android devices.
                            </p>
                            <a href="https://attack.mitre.org/matrices/mobile/" target="_blank" className="text-xs text-primary mt-2 block hover:underline">Launch Mobile &rarr;</a>
                        </Card>
                        <Card className="p-4 hover:bg-muted/50 transition-colors">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <ExternalLink className="h-4 w-4 text-orange-500" /> ICS
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Industrial Control Systems behavior and tradecraft.
                            </p>
                            <a href="https://attack.mitre.org/matrices/ics/" target="_blank" className="text-xs text-primary mt-2 block hover:underline">Launch ICS &rarr;</a>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
