import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain required' }, { status: 400 });
    }

    try {
        // Fetch current threat feeds to check for domain
        const feedsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/feeds`);

        if (!feedsRes.ok) {
            throw new Error('Failed to fetch threat feeds');
        }

        const feeds = await feedsRes.json();

        // Check if domain appears in any feeds
        const domainLower = domain.toLowerCase();
        const matchingFeeds = feeds.filter((feed: any) => {
            // Check in IOCs
            if (feed.iocs) {
                return feed.iocs.some((ioc: string) =>
                    ioc.toLowerCase().includes(domainLower)
                );
            }
            // Check in description
            if (feed.description) {
                return feed.description.toLowerCase().includes(domainLower);
            }
            return false;
        });

        // Calculate threat score based on matches
        let threatScore = 0;
        let threatLevel = 'Clean';

        if (matchingFeeds.length > 0) {
            threatScore = Math.min(matchingFeeds.length * 25, 100);

            const hasCritical = matchingFeeds.some((f: any) => f.severity === 'Critical');
            if (hasCritical) {
                threatLevel = 'Critical';
                threatScore = Math.max(threatScore, 75);
            } else if (matchingFeeds.length > 2) {
                threatLevel = 'High';
            } else {
                threatLevel = 'Medium';
            }
        }

        return NextResponse.json({
            domain,
            threatScore,
            threatLevel,
            matchCount: matchingFeeds.length,
            matches: matchingFeeds.slice(0, 5).map((feed: any) => ({
                title: feed.title,
                type: feed.type,
                severity: feed.severity,
                source: feed.source,
                date: feed.date
            })),
            isClean: matchingFeeds.length === 0
        });
    } catch (error) {
        console.error('Domain Reputation API Error:', error);

        // Return clean status as fallback
        return NextResponse.json({
            domain,
            threatScore: 0,
            threatLevel: 'Unknown',
            matchCount: 0,
            matches: [],
            isClean: true,
            error: 'Unable to check reputation'
        });
    }
}
