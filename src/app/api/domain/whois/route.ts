import { NextResponse } from 'next/server';

// Multiple WHOIS data sources for redundancy
async function fetchFromWhoDat(domain: string) {
    const response = await fetch(`https://who-dat.as93.net/${domain}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`who-dat: ${response.status}`);
    const data = await response.json();
    return {
        domain,
        registrar: data.registrar || 'Unknown',
        createdDate: data.created || data.creation_date || 'Unknown',
        expiryDate: data.expires || data.expiry_date || 'Unknown',
        updatedDate: data.updated || data.updated_date || 'Unknown',
        status: data.status || [],
        nameServers: data.nameservers || data.name_servers || [],
        registrantOrg: data.registrant?.organization || data.org || 'Private',
        registrantCountry: data.registrant?.country || data.country || 'Unknown',
        dnssec: data.dnssec || 'Unsigned',
        source: 'who-dat.as93.net'
    };
}

async function fetchFromRDAP(domain: string) {
    // Use RDAP (Registration Data Access Protocol) - successor to WHOIS
    const response = await fetch(`https://rdap.org/domain/${domain}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`RDAP: ${response.status}`);
    const data = await response.json();

    // Parse RDAP response
    const nameServers = data.nameservers?.map((ns: any) => ns.ldhName || ns.unicodeName) || [];
    const registrar = data.entities?.find((e: any) => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find((v: any) => v[0] === 'fn')?.[3] || 'Unknown';

    // Find dates from events
    const created = data.events?.find((e: any) => e.eventAction === 'registration')?.eventDate || 'Unknown';
    const expires = data.events?.find((e: any) => e.eventAction === 'expiration')?.eventDate || 'Unknown';
    const updated = data.events?.find((e: any) => e.eventAction === 'last changed')?.eventDate || 'Unknown';

    return {
        domain,
        registrar,
        createdDate: created !== 'Unknown' ? created.split('T')[0] : 'Unknown',
        expiryDate: expires !== 'Unknown' ? expires.split('T')[0] : 'Unknown',
        updatedDate: updated !== 'Unknown' ? updated.split('T')[0] : 'Unknown',
        status: data.status || [],
        nameServers,
        registrantOrg: 'Private (RDAP)',
        registrantCountry: 'Unknown',
        dnssec: data.secureDNS?.delegationSigned ? 'Signed' : 'Unsigned',
        source: 'rdap.org'
    };
}

async function fetchFromWhoIsFreaks(domain: string) {
    // WhoisFreaks offers limited free lookups
    const response = await fetch(`https://api.whoisfreaks.com/v1.0/whois?whois=live&domainName=${domain}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000)
    });

    // This API may require key but returns useful data for some TLDs without
    const data = await response.json();
    if (data.status === "0" || data.error) throw new Error('WhoisFreaks unavailable');

    return {
        domain,
        registrar: data.registrar?.name || 'Unknown',
        createdDate: data.create_date || 'Unknown',
        expiryDate: data.expiry_date || 'Unknown',
        updatedDate: data.update_date || 'Unknown',
        status: data.domain_status || [],
        nameServers: data.name_servers || [],
        registrantOrg: data.registrant?.organization || 'Private',
        registrantCountry: data.registrant?.country || 'Unknown',
        dnssec: 'Unknown',
        source: 'whoisfreaks.com'
    };
}

async function fetchFromJsonWhois(domain: string) {
    // Fallback: basic DNS info via public DNS-over-HTTPS
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`, {
        signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error('DNS lookup failed');
    const data = await response.json();

    const nameServers = data.Answer?.filter((r: any) => r.type === 2).map((r: any) => r.data.replace(/\.$/, '')) || [];

    // This is minimal data but at least shows real nameservers
    return {
        domain,
        registrar: 'Unknown (DNS Only)',
        createdDate: 'Unknown',
        expiryDate: 'Unknown',
        updatedDate: 'Unknown',
        status: ['active'],
        nameServers,
        registrantOrg: 'Unknown',
        registrantCountry: 'Unknown',
        dnssec: data.AD ? 'Validated' : 'Unknown',
        source: 'dns.google (Limited Data)'
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain required' }, { status: 400 });
    }

    // Sanitize domain
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();

    // Try multiple sources in order of preference
    const sources = [
        { name: 'who-dat', fn: () => fetchFromWhoDat(cleanDomain) },
        { name: 'RDAP', fn: () => fetchFromRDAP(cleanDomain) },
        { name: 'WhoisFreaks', fn: () => fetchFromWhoIsFreaks(cleanDomain) },
        { name: 'DNS-only', fn: () => fetchFromJsonWhois(cleanDomain) }
    ];

    for (const source of sources) {
        try {
            console.log(`Trying WHOIS source: ${source.name}`);
            const result = await source.fn();
            return NextResponse.json(result);
        } catch (error) {
            console.log(`${source.name} failed:`, error);
            continue;
        }
    }

    // All sources failed - return error instead of mock data
    return NextResponse.json({
        domain: cleanDomain,
        error: 'All WHOIS sources unavailable',
        registrar: 'Unavailable',
        createdDate: 'Unavailable',
        expiryDate: 'Unavailable',
        updatedDate: 'Unavailable',
        status: [],
        nameServers: [],
        registrantOrg: 'Unavailable',
        registrantCountry: 'Unavailable',
        dnssec: 'Unknown',
        source: 'Error: No data available'
    }, { status: 503 });
}
