import { NextResponse } from 'next/server';
import dns from 'dns';
import util from 'util';

const lookup = util.promisify(dns.lookup);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    // Parse Hostname
    let hostname = target;
    let url = target;

    // Ensure protocol for fetch, but keep hostname for DNS
    if (target.startsWith('http://') || target.startsWith('https://')) {
        try {
            const urlObj = new URL(target);
            hostname = urlObj.hostname;
            url = target;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }
    } else {
        url = `https://${target}`;
        hostname = target.split('/')[0];
    }

    try {
        // Parallel execution: Latency Check + DNS Lookup
        const start = performance.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        // DNS Lookup
        let ipInfo = { address: 'N/A', family: 0 };
        try {
            ipInfo = await lookup(hostname);
        } catch (e) {
            console.warn(`DNS lookup failed for ${hostname}`);
        }

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);

        const end = performance.now();
        const latency = Math.round(end - start);

        // Get some headers for "Network Details"
        const server = response.headers.get('server') || 'Hidden';
        const contentType = response.headers.get('content-type') || 'Unknown';

        return NextResponse.json({
            target: hostname,
            url: url,
            latency_ms: latency,
            status: response.status,
            status_text: response.statusText,
            timestamp: new Date().toISOString(),
            ip: ipInfo.address,
            ip_family: `IPv${ipInfo.family}`,
            details: {
                server: server,
                contentType: contentType,
                protocol: url.startsWith('https') ? 'HTTPS' : 'HTTP'
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Latency check failed',
            details: error.name === 'AbortError' ? 'Connection timed out' : error.message
        }, { status: 502 });
    }
}
