import { NextResponse } from 'next/server';
import tls from 'tls';
import { URL } from 'url';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target domain is required' }, { status: 400 });
    }

    // Clean domain
    let domain = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    // Validate domain format (basic)
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
        return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
    }

    try {
        const certInfo = await new Promise((resolve, reject) => {
            const socket = tls.connect({
                host: domain,
                port: 443,
                servername: domain,
                timeout: 5000,
                rejectUnauthorized: false
            }, () => {
                const cert = socket.getPeerCertificate();
                if (!cert || Object.keys(cert).length === 0) {
                    reject(new Error('No certificate found'));
                    return;
                }
                socket.end();
                resolve(cert);
            });

            socket.on('error', (err) => {
                reject(err);
            });

            socket.on('timeout', () => {
                socket.destroy();
                reject(new Error('Connection timed out'));
            });
        });

        const cert = certInfo as any;

        // Calculate days remaining
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const diffTime = Math.abs(validTo.getTime() - now.getTime());
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isValid = now < validTo && now > new Date(cert.valid_from);

        return NextResponse.json({
            subject: cert.subject,
            issuer: cert.issuer,
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            days_remaining: daysRemaining,
            valid: isValid,
            serialNumber: cert.serialNumber,
            fingerprint: cert.fingerprint
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to retrieve certificate',
            details: error.message
        }, { status: 500 });
    }
}
