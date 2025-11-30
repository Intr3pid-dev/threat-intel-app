import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target IP required' }, { status: 400 });
    }

    try {
        // Fetch both IP info and reputation concurrently
        const [ipApiRes, reputationRes] = await Promise.allSettled([
            fetch(`http://ip-api.com/json/${target}`),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/reputation/abuseipdb?ip=${target}`)
        ]);

        let ipData: any = {};
        let reputationData: any = {};

        // Process IP-API data
        if (ipApiRes.status === 'fulfilled' && ipApiRes.value.ok) {
            ipData = await ipApiRes.value.json();
        }

        // Process AbuseIPDB reputation data
        if (reputationRes.status === 'fulfilled' && reputationRes.value.ok) {
            reputationData = await reputationRes.value.json();
        }

        // Combine data
        const response = {
            ip: target,
            location: ipData.city && ipData.country ? `${ipData.city}, ${ipData.country}` : 'Unknown Location',
            isp: ipData.isp || reputationData.isp || 'Unknown ISP',
            asn: ipData.as || 'N/A',
            coordinates: ipData.lat && ipData.lon ? `${ipData.lat}, ${ipData.lon}` : '0, 0',
            lat: ipData.lat || 0,
            lng: ipData.lon || 0,
            // Reputation data from AbuseIPDB
            abuseScore: reputationData.abuseConfidenceScore || 0,
            totalReports: reputationData.totalReports || 0,
            lastReported: reputationData.lastReportedAt || null,
            isTor: reputationData.isTor || false,
            isPublic: reputationData.isPublic !== false,
            // Calculate overall threat score (0-100)
            score: reputationData.abuseConfidenceScore || 0,
            tags: [
                ipData.isp || 'Unknown',
                reputationData.abuseConfidenceScore > 50 ? 'High Risk' : 'Clean',
                reputationData.isTor ? 'TOR' : 'Regular',
                reputationData.usageType || 'Unknown Type'
            ].filter(tag => tag !== 'Unknown' && tag !== 'Unknown Type'),
            reputationSource: reputationData.source || 'Unknown'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('IP API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch IP information' },
            { status: 500 }
        );
    }
}
