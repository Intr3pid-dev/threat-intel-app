import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // AlienVault OTX requires an API key for access
        const API_KEY = process.env.ALIENVAULT_API_KEY;

        if (!API_KEY) {
            // No API key configured - return empty array
            console.log('AlienVault: No API key configured');
            return NextResponse.json([]);
        }

        // If API key exists, fetch real data
        const response = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed', {
            headers: {
                'X-OTX-API-KEY': API_KEY
            },
            signal: AbortSignal.timeout(10000)
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
        // Return empty array instead of mock data for production
        return NextResponse.json([]);
    }
}
