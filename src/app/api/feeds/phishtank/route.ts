import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // PhishTank provides a JSON feed of verified phishing URLs
        const response = await fetch('http://data.phishtank.com/data/online-valid.json', {
            headers: {
                'User-Agent': 'phishtank/openthreatdata'
            },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(`PhishTank API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform to our feed format - get latest 20
        const phishingFeeds = data.slice(0, 20).map((item: any) => ({
            id: `phishtank-${item.phish_id}`,
            title: `Phishing Site Detected: ${item.target || 'Unknown Target'}`,
            type: 'Phishing',
            date: item.submission_time?.split('T')[0] || new Date().toISOString().split('T')[0],
            severity: item.verified === 'yes' ? 'Critical' : 'High',
            description: `Verified phishing URL targeting ${item.target || 'users'}. URL: ${item.url}`,
            tags: ['phishing', item.target?.toLowerCase() || 'generic', 'phishtank'],
            source: 'PhishTank',
            iocs: [item.url],
            verified: item.verified === 'yes',
            online: item.online === 'yes'
        }));

        return NextResponse.json(phishingFeeds);
    } catch (error) {
        console.error('PhishTank API Error:', error);
        // Return empty array instead of mock data for production
        return NextResponse.json([]);
    }
}
