import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Basic list of known disposable domains (in a real app, use a larger source/db)
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'throwawaymail.com', 'mailinator.com', 'guerrillamail.com',
    'yopmail.com', '10minutemail.com', 'sharklasers.com', 'getnada.com',
    'dispostable.com', 'grr.la'
]);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Syntax Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                valid: false,
                reason: 'Invalid format',
                details: { syntax: false }
            });
        }

        const [user, domain] = email.split('@');

        // 2. Disposable Check
        const isDisposable = DISPOSABLE_DOMAINS.has(domain.toLowerCase());

        // 3. MX Record Lookup (Deep Validation)
        let mxRecords: dns.MxRecord[] = [];
        let canReceiveMail = false;

        try {
            mxRecords = await resolveMx(domain);
            if (mxRecords && mxRecords.length > 0) {
                canReceiveMail = true;
            }
        } catch (error: any) {
            // No MX records found
            if (error.code !== 'ENODATA' && error.code !== 'ENOTFOUND') {
                console.error('DNS Lookup Error:', error);
            }
        }

        // 4. Role-based check (OSINT heuristic)
        const roleBasedPrefixes = ['admin', 'info', 'support', 'sales', 'contact', 'webmaster', 'hr'];
        const isRoleAccount = roleBasedPrefixes.includes(user.toLowerCase());

        // Construct Risk Score
        let riskScore = 0;
        if (isDisposable) riskScore += 90;
        if (!canReceiveMail) riskScore += 80;
        if (isRoleAccount) riskScore += 10;

        return NextResponse.json({
            valid: canReceiveMail,
            email: email,
            domain: domain,
            validators: {
                syntax: true,
                mx_records: canReceiveMail,
                disposable: isDisposable,
                role_account: isRoleAccount
            },
            mx_records: mxRecords.sort((a, b) => a.priority - b.priority),
            risk_score: riskScore,
            verdict: riskScore > 50 ? 'High Risk' : riskScore > 10 ? 'Moderate' : 'Clean'
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Analysis failed: ' + error.message }, { status: 500 });
    }
}
