import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch from all sources concurrently
        const [urlhausRes, alienvaultRes, phishtankRes] = await Promise.allSettled([
            fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/'),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/feeds/alienvault`),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/feeds/phishtank`)
        ]);

        const feeds: any[] = [];

        // Process URLHaus data
        if (urlhausRes.status === 'fulfilled' && urlhausRes.value.ok) {
            const data = await urlhausRes.value.json();
            if (data.query_status === 'ok') {
                const urlhausFeeds = Object.values(data.urls).slice(0, 8).map((item: any) => ({
                    id: item.id,
                    title: `Malicious URL Detected: ${item.url_status}`,
                    type: 'Malware',
                    date: item.date_added,
                    severity: item.threat === 'malware_download' ? 'Critical' : 'High',
                    description: `URL: ${item.url} | Reporter: ${item.reporter}`,
                    tags: item.tags || ['urlhaus', 'malware'],
                    source: 'URLHaus',
                    iocs: [item.url]
                }));
                feeds.push(...urlhausFeeds);
            }
        }

        // Process AlienVault data
        if (alienvaultRes.status === 'fulfilled' && alienvaultRes.value.ok) {
            const avFeeds = await alienvaultRes.value.json();
            feeds.push(...avFeeds.slice(0, 5));
        }

        // Process PhishTank data
        if (phishtankRes.status === 'fulfilled' && phishtankRes.value.ok) {
            const phishFeeds = await phishtankRes.value.json();
            feeds.push(...phishFeeds.slice(0, 7));
        }

        // If all failed, return fallback mock data
        if (feeds.length === 0) {
            const mockFeeds = [
                {
                    id: "1",
                    title: "Malicious URL Detected: online",
                    type: "Malware",
                    date: new Date().toISOString().split('T')[0],
                    severity: "Critical",
                    description: "Phishing campaign targeting financial institutions",
                    tags: ["phishing", "finance", "urlhaus"],
                    source: "URLHaus (Mock)",
                    iocs: ["http://malicious-example.com"]
                },
                {
                    id: "2",
                    title: "Phishing Site Detected: PayPal",
                    type: "Phishing",
                    date: new Date().toISOString().split('T')[0],
                    severity: "Critical",
                    description: "Verified phishing URL targeting PayPal users",
                    tags: ["phishing", "paypal"],
                    source: "PhishTank (Mock)",
                    iocs: ["http://paypal-verify.fake.com"]
                },
                {
                    id: "3",
                    title: "APT29 Targeting Government Agencies",
                    type: "APT",
                    date: new Date().toISOString().split('T')[0],
                    severity: "Critical",
                    description: "Advanced persistent threat group observed",
                    tags: ["apt29", "government"],
                    source: "AlienVault OTX (Mock)"
                }
            ];

            return NextResponse.json(mockFeeds);
        }

        // Sort by date (newest first) and return
        feeds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return NextResponse.json(feeds);
    } catch (error) {
        console.error('Feeds API Handler Error:', error);

        // Fallback to mock data if API fails
        const mockFeeds = [
            {
                id: "1",
                title: "Malicious URL Detected: online",
                type: "Malware",
                date: new Date().toISOString().split('T')[0],
                severity: "Critical",
                description: "Phishing campaign targeting financial institutions",
                tags: ["phishing", "finance"],
                source: "Mock Data"
            }
        ];

        return NextResponse.json(mockFeeds);
    }
}
