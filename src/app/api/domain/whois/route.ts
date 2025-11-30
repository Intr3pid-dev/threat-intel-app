import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain required' }, { status: 400 });
    }

    try {
        // Use who-dat API (free, no API key required)
        const response = await fetch(`https://who-dat.as93.net/${domain}`);

        if (!response.ok) {
            throw new Error(`WHOIS API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform to our format
        const whoisData = {
            domain: domain,
            registrar: data.registrar || 'Unknown',
            createdDate: data.created || data.creation_date || 'Unknown',
            expiryDate: data.expires || data.expiry_date || 'Unknown',
            updatedDate: data.updated || data.updated_date || 'Unknown',
            status: data.status || [],
            nameServers: data.nameservers || data.name_servers || [],
            registrantOrg: data.registrant?.organization || data.org || 'Private',
            registrantCountry: data.registrant?.country || data.country || 'Unknown',
            dnssec: data.dnssec || 'Unsigned',
            source: 'who-dat API'
        };

        return NextResponse.json(whoisData);
    } catch (error) {
        console.error('WHOIS API Error:', error);

        // Return mock data as fallback
        const mockData = {
            domain: domain,
            registrar: 'Example Registrar Inc.',
            createdDate: '2020-01-15',
            expiryDate: '2025-01-15',
            updatedDate: '2024-01-15',
            status: ['clientTransferProhibited'],
            nameServers: ['ns1.example.com', 'ns2.example.com'],
            registrantOrg: 'Private Registration',
            registrantCountry: 'US',
            dnssec: 'Unsigned',
            source: 'Mock Data (WHOIS API unavailable)'
        };

        return NextResponse.json(mockData);
    }
}
