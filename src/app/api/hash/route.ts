import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { hash } = await request.json();

        if (!hash) {
            return NextResponse.json({ error: 'Hash is required' }, { status: 400 });
        }

        const formData = new URLSearchParams();
        formData.append('query', 'get_info');
        formData.append('hash', hash);

        const response = await fetch('https://mb-api.abuse.ch/api/v1/', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.query_status === 'hash_not_found') {
            return NextResponse.json({ found: false });
        }

        if (data.query_status === 'ok') {
            const info = data.data[0];
            return NextResponse.json({
                found: true,
                verdict: 'Malicious',
                family: info.signature || 'Unknown',
                score: 90, // High confidence if found in MalwareBazaar
                engines: {
                    detected: 1,
                    total: 1,
                    details: [{ engine: 'MalwareBazaar', result: info.signature }]
                },
                tags: info.tags || []
            });
        }

        return NextResponse.json({ error: 'Unknown API response' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to analyze hash' }, { status: 500 });
    }
}
