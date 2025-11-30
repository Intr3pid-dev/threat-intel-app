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
            // Return mock data if no API key
            return NextResponse.json({
                ip,
                isWhitelisted: false,
                abuseConfidenceScore: 0,
                countryCode: 'US',
                usageType: 'Data Center/Web Hosting/Transit',
                isp: 'Google LLC',
                domain: 'google.com',
                totalReports: 0,
                numDistinctUsers: 0,
                lastReportedAt: null,
                isPublic: true,
                ipVersion: 4,
                isTor: false,
                source: 'AbuseIPDB (Mock - Add API key for live data)'
            });
        }

        // Fetch from AbuseIPDB
        const response = await fetch(
            `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90&verbose`,
            {
                headers: {
                    'Key': API_KEY,
                    'Accept': 'application/json'
                }
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

        return NextResponse.json({
            ip,
            abuseConfidenceScore: 0,
            totalReports: 0,
            source: 'AbuseIPDB (Error - using fallback)',
            error: 'Failed to fetch reputation data'
        });
    }
}
