import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const activeThreats = await db.user.count(); // Just a placeholder for now, maybe use external API or mock real stats
        // In a real app, this would query your threat database or external SIEM
        // For now, let's randomize slightly to feel "live" but based on real DB if possible
        // We don't have a Threat model yet, so we'll simulate based on "feeds"

        // Simulate stats
        const stats = {
            activeThreats: 2450 + Math.floor(Math.random() * 100),
            globalSensors: 142,
            monitoringStatus: "Active",
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
