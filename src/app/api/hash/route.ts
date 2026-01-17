import { NextResponse } from 'next/server';

// Source 1: MalwareBazaar (abuse.ch)
async function checkMalwareBazaar(hash: string) {
    const formData = new URLSearchParams();
    formData.append('query', 'get_info');
    formData.append('hash', hash);

    const response = await fetch('https://mb-api.abuse.ch/api/v1/', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(8000)
    });

    const data = await response.json();

    if (data.query_status === 'hash_not_found') {
        return { found: false, source: 'MalwareBazaar' };
    }

    if (data.query_status === 'ok' && data.data?.[0]) {
        const info = data.data[0];
        return {
            found: true,
            verdict: 'Malicious',
            family: info.signature || 'Unknown Malware',
            score: 85,
            engines: {
                detected: 1,
                total: 1,
                details: [{ engine: 'MalwareBazaar', result: info.signature || 'Malware' }]
            },
            tags: info.tags || ['malware'],
            source: 'MalwareBazaar'
        };
    }

    throw new Error('MalwareBazaar: Invalid response');
}

// Source 2: ThreatFox (abuse.ch) - IOC database
async function checkThreatFox(hash: string) {
    const response = await fetch('https://threatfox-api.abuse.ch/api/v1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: 'search_hash',
            hash: hash
        }),
        signal: AbortSignal.timeout(8000)
    });

    const data = await response.json();

    if (data.query_status === 'no_result') {
        return { found: false, source: 'ThreatFox' };
    }

    if (data.query_status === 'ok' && data.data?.length > 0) {
        const info = data.data[0];
        return {
            found: true,
            verdict: 'Malicious',
            family: info.malware || info.malware_printable || 'Unknown',
            score: 80,
            engines: {
                detected: 1,
                total: 1,
                details: [{ engine: 'ThreatFox', result: info.malware_printable || 'IOC' }]
            },
            tags: [info.threat_type || 'threat', info.malware_printable || 'malware'],
            source: 'ThreatFox'
        };
    }

    throw new Error('ThreatFox: Invalid response');
}

// Source 3: URLhaus hash check (for hashes associated with malicious URLs)
async function checkURLhaus(hash: string) {
    const formData = new URLSearchParams();
    formData.append('md5_hash', hash);
    formData.append('sha256_hash', hash);

    const response = await fetch('https://urlhaus-api.abuse.ch/v1/payload/', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(8000)
    });

    const data = await response.json();

    if (data.query_status === 'no_results') {
        return { found: false, source: 'URLhaus' };
    }

    if (data.query_status === 'ok') {
        return {
            found: true,
            verdict: 'Malicious',
            family: data.signature || 'Malicious Payload',
            score: 75,
            engines: {
                detected: 1,
                total: 1,
                details: [{ engine: 'URLhaus', result: data.file_type || 'payload' }]
            },
            tags: [data.file_type || 'executable', 'urlhaus'],
            source: 'URLhaus'
        };
    }

    throw new Error('URLhaus: Invalid response');
}

export async function POST(request: Request) {
    try {
        const { hash } = await request.json();

        if (!hash) {
            return NextResponse.json({ error: 'Hash is required' }, { status: 400 });
        }

        // Validate hash format (MD5, SHA1, SHA256)
        const cleanHash = hash.trim().toLowerCase();
        if (!/^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/.test(cleanHash)) {
            return NextResponse.json({ error: 'Invalid hash format' }, { status: 400 });
        }

        // Try all sources concurrently for speed
        const results = await Promise.allSettled([
            checkMalwareBazaar(cleanHash),
            checkThreatFox(cleanHash),
            checkURLhaus(cleanHash)
        ]);

        // Check if ANY source found the hash as malicious
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.found) {
                return NextResponse.json(result.value);
            }
        }

        // Check if all sources returned "not found" (hash is likely clean)
        const allNotFound = results.every(
            r => r.status === 'fulfilled' && r.value.found === false
        );

        if (allNotFound) {
            // Hash not in any threat database - likely clean
            return NextResponse.json({
                found: false,
                verdict: 'Clean / Unknown',
                family: 'No threats detected in threat databases',
                score: 0,
                engines: {
                    detected: 0,
                    total: 3,
                    details: []
                },
                tags: ['Not in threat DBs'],
                sourcesChecked: ['MalwareBazaar', 'ThreatFox', 'URLhaus']
            });
        }

        // Some sources failed, some returned not found
        const successfulSources = results
            .filter(r => r.status === 'fulfilled')
            .map(r => (r as PromiseFulfilledResult<any>).value.source);

        return NextResponse.json({
            found: false,
            verdict: 'Unknown',
            family: 'Partial check completed',
            score: 0,
            engines: {
                detected: 0,
                total: successfulSources.length,
                details: []
            },
            tags: ['Partial scan'],
            sourcesChecked: successfulSources
        });

    } catch (error) {
        console.error('Hash API Error:', error);
        return NextResponse.json({ error: 'Failed to analyze hash' }, { status: 500 });
    }
}
