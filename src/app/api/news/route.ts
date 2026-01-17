import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'cybersecurity';

    // Google News RSS URL
    // hl=en-US&gl=US&ceid=US:en sets the region/language
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

    try {
        const response = await fetch(rssUrl);
        const xmlText = await response.text();

        // Simple XML Regex Parser (to avoid adding xml2js dependency for now)
        // Extract items: <item>...</item>
        const itemRegex = /<item>[\s\S]*?<\/item>/g;
        const items = xmlText.match(itemRegex) || [];

        const parsedItems = items.slice(0, 15).map(item => {
            const getTag = (tag: string) => {
                const match = item.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
                return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : '';
            };

            // Extract pubDate
            const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
            const pubDate = dateMatch ? dateMatch[1] : '';

            // Extract Link (sometimes generic in RSS, but usually workable)
            const linkMatch = item.match(/<link>(.*?)<\/link>/);
            const link = linkMatch ? linkMatch[1] : '';

            return {
                title: getTag('title').replace(` - ${getTag('source')}`, ''), // Clean title
                source: getTag('source') || 'Google News',
                link: link,
                pubDate: pubDate,
                timestamp: new Date(pubDate).getTime()
            };
        });

        return NextResponse.json({
            topic: query,
            count: parsedItems.length,
            articles: parsedItems
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
