import { NextResponse } from 'next/server';

// Source 1: ip-api.com (primary, rate limited)
async function fetchFromIpApi(ip: string) {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,lat,lon,isp,org,as,asname`, {
        signal: AbortSignal.timeout(5000)
    });
    const data = await response.json();
    if (data.status === 'fail') throw new Error(data.message);
    return {
        ip,
        city: data.city,
        country: data.country,
        lat: data.lat,
        lon: data.lon,
        isp: data.isp,
        org: data.org,
        as: data.as,
        source: 'ip-api.com'
    };
}

// Source 2: ipapi.co (fallback)
async function fetchFromIpApiCo(ip: string) {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(5000)
    });
    const data = await response.json();
    if (data.error) throw new Error(data.reason);
    return {
        ip,
        city: data.city,
        country: data.country_name,
        lat: data.latitude,
        lon: data.longitude,
        isp: data.org,
        org: data.org,
        as: data.asn ? `AS${data.asn} ${data.org}` : null,
        source: 'ipapi.co'
    };
}

// Source 3: ip-whois.io (fallback)
async function fetchFromIpWhois(ip: string) {
    const response = await fetch(`https://ipwhois.app/json/${ip}`, {
        signal: AbortSignal.timeout(5000)
    });
    const data = await response.json();
    if (!data.success) throw new Error('ipwhois failed');
    return {
        ip,
        city: data.city,
        country: data.country,
        lat: data.latitude,
        lon: data.longitude,
        isp: data.isp,
        org: data.org,
        as: data.asn ? `AS${data.asn} ${data.org}` : null,
        source: 'ipwhois.app'
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target IP required' }, { status: 400 });
    }

    // Validate IP format
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(target)) {
        return NextResponse.json({ error: 'Invalid IP format' }, { status: 400 });
    }

    // Try multiple sources in order
    const sources = [
        { name: 'ip-api.com', fn: () => fetchFromIpApi(target) },
        { name: 'ipapi.co', fn: () => fetchFromIpApiCo(target) },
        { name: 'ipwhois.app', fn: () => fetchFromIpWhois(target) }
    ];

    let ipData: any = null;
    let lastError: Error | null = null;

    for (const source of sources) {
        try {
            console.log(`Trying IP source: ${source.name}`);
            ipData = await source.fn();
            break;
        } catch (error) {
            console.log(`${source.name} failed:`, error);
            lastError = error as Error;
            continue;
        }
    }

    if (!ipData) {
        return NextResponse.json({
            error: 'All IP lookup sources failed',
            details: lastError?.message
        }, { status: 503 });
    }

    // Fetch reputation data separately (optional enhancement)
    let reputationData: any = {};
    try {
        const reputationRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/reputation/abuseipdb?ip=${target}`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (reputationRes.ok) {
            reputationData = await reputationRes.json();
        }
    } catch (e) {
        console.log('Reputation lookup failed (non-critical)');
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
            reputationData.usageType || ipData.org || ''
        ].filter(tag => tag && tag !== 'Unknown'),
        source: ipData.source,
        reputationSource: reputationData.source || 'None'
    };

    return NextResponse.json(response);
}
