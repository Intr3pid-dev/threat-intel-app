import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Note: AlienVault OTX requires an API key for full access
        // For now, we'll use mock data. User can add their API key later.
        const API_KEY = process.env.ALIENVAULT_API_KEY;

        if (!API_KEY) {
            // Return mock data if no API key
            const mockPulses = [
                {
                    id: "av-1",
                    title: "APT29 Targeting Government Agencies",
                    type: "APT",
                    date: new Date().toISOString().split('T')[0],
                    severity: "Critical",
                    description: "Advanced persistent threat group APT29 (Cozy Bear) observed targeting government agencies with spear-phishing campaigns",
                    tags: ["apt29", "cozy-bear", "government", "spear-phishing"],
                    source: "AlienVault OTX",
                    iocs: ["192.0.2.1", "malicious-domain.com", "a1b2c3d4e5f6..."]
                },
                {
                    id: "av-2",
                    title: "Ransomware Campaign Using REvil Variant",
                    type: "Ransomware",
                    date: new Date().toISOString().split('T')[0],
                    severity: "High",
                    description: "New REvil ransomware variant detected targeting healthcare and financial sectors",
                    tags: ["ransomware", "revil", "healthcare", "finance"],
                    source: "AlienVault OTX",
                    iocs: ["198.51.100.42", "ransom-c2.net"]
                }
            ];

            return NextResponse.json(mockPulses);
        }

        // If API key exists, fetch real data
        const response = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed', {
            headers: {
                'X-OTX-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`AlienVault API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform OTX pulses to our format
        const pulses = data.results.slice(0, 10).map((pulse: any) => ({
            id: pulse.id,
            title: pulse.name,
            type: pulse.tags[0] || 'Threat',
            date: pulse.created.split('T')[0],
            severity: pulse.adversary ? 'Critical' : 'High',
            description: pulse.description || 'No description available',
            tags: pulse.tags,
            source: 'AlienVault OTX',
            iocs: pulse.indicators?.slice(0, 5).map((ind: any) => ind.indicator) || []
        }));

        return NextResponse.json(pulses);
    } catch (error) {
        console.error('AlienVault API Error:', error);

        // Fallback to mock data on error
        const fallbackPulses = [
            {
                id: "av-fallback-1",
                title: "Threat Intelligence Feed Unavailable",
                type: "System",
                date: new Date().toISOString().split('T')[0],
                severity: "High",
                description: "AlienVault OTX feed temporarily unavailable. Add your API key to .env.local as ALIENVAULT_API_KEY for live data.",
                tags: ["system", "configuration"],
                source: "AlienVault OTX (Mock)"
            }
        ];

        return NextResponse.json(fallbackPulses);
    }
}
