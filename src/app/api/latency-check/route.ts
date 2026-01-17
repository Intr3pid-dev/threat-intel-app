import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    // Normalize URL
    let url = target;
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    try {
        const start = performance.now();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
            method: 'HEAD', // Lightweight check
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);

        const end = performance.now();
        const latency = Math.round(end - start);

        return NextResponse.json({
            target: url,
            latency_ms: latency,
            status: response.status,
            status_text: response.statusText,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Latency check failed',
            details: error.name === 'AbortError' ? 'Connection timed out' : error.message
        }, { status: 502 });
    }
}
