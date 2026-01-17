import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
        return NextResponse.json({ error: 'IP address required' }, { status: 400 });
    }

    try {
        const API_KEY = process.env.ABUSEIPDB_API_KEY;

        if (!API_KEY) {
            // No API key - return minimal data indicating no reputation check was done
            return NextResponse.json({
                ip,
                abuseConfidenceScore: 0,
                totalReports: 0,
                isPublic: true,
                isTor: false,
                source: 'No AbuseIPDB API key configured'
            });
        }

        // Fetch from AbuseIPDB
        const response = await fetch(
            `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90&verbose`,
            {
                headers: {
                    'Key': API_KEY,
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(8000)
            }
        );

        if (!response.ok) {
            throw new Error(`AbuseIPDB API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            ...data.data,
            source: 'AbuseIPDB'
        });
    } catch (error) {
        console.error('AbuseIPDB API Error:', error);

        // Return minimal fallback without fake data
        return NextResponse.json({
            ip,
            abuseConfidenceScore: 0,
            totalReports: 0,
            source: 'AbuseIPDB unavailable',
            error: 'Reputation check failed'
        });
    }
}
