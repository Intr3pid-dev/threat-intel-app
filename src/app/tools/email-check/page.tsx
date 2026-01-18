"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, Mail, AlertTriangle, CheckCircle, ShieldAlert, Server, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { containsProfanity } from "@/lib/security";

export default function EmailCheckPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) return;

        if (containsProfanity(email)) {
            setError("Input contains restricted keywords.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/email-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <Mail className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Email Reputation</h1>
                </div>

                <Card className="mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Enter email address (e.g., target@company.com)"
                                    className="h-11 w-full rounded-md border border-border bg-background pl-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? "Analyzing..." : "Verify MX"}
                            </button>
                        </div>
                        {error && <p className="text-destructive text-sm font-bold">{error}</p>}
                    </form>
                </Card>

                {result && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Verdict Card */}
                        <Card title="Analysis Verdict" icon={<ShieldAlert className="h-4 w-4" />}>
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className={cn(
                                    "relative flex h-24 w-24 items-center justify-center rounded-full border-4",
                                    result.risk_score > 50 ? "border-red-500 bg-red-500/10" :
                                        result.risk_score > 10 ? "border-orange-500 bg-orange-500/10" :
                                            "border-green-500 bg-green-500/10"
                                )}>
                                    <span className={cn(
                                        "text-2xl font-bold",
                                        result.risk_score > 50 ? "text-red-500" :
                                            result.risk_score > 10 ? "text-orange-500" :
                                                "text-green-500"
                                    )}>
                                        {result.risk_score}%
                                    </span>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">
                                        {result.verdict}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">Risk Probability</p>
                                </div>
                            </div>
                        </Card>

                        {/* Technical Details */}
                        <Card title="Validation Checks" icon={<CheckCircle className="h-4 w-4" />}>
                            <div className="grid grid-cols-2 gap-4">
                                <ValidationItem
                                    label="Syntax"
                                    isValid={result.validators?.syntax}
                                    text={result.validators?.syntax ? "Valid Format" : "Invalid"}
                                />
                                <ValidationItem
                                    label="MX Records"
                                    isValid={result.validators?.mx_records}
                                    text={result.validators?.mx_records ? "Active Mail Server" : "No Mail Server"}
                                />
                                <ValidationItem
                                    label="Disposable"
                                    isValid={!result.validators?.disposable}
                                    warning={result.validators?.disposable}
                                    text={result.validators?.disposable ? "Burner Domain" : "Standard Domain"}
                                />
                                <ValidationItem
                                    label="Role Account"
                                    isValid={!result.validators?.role_account}
                                    warning={result.validators?.role_account}
                                    text={result.validators?.role_account ? "Role-Based (info/admin)" : "Personal"}
                                />
                            </div>
                        </Card>

                        {/* MX Records Table */}
                        {result.mx_records && result.mx_records.length > 0 && (
                            <Card className="md:col-span-2" title="MX Records (Mail Exchangers)" icon={<Server className="h-4 w-4" />}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-2">Priority</th>
                                                <th className="px-4 py-2">Exchange Server</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {result.mx_records.map((mx: any, i: number) => (
                                                <tr key={i} className="hover:bg-muted/20">
                                                    <td className="px-4 py-2 font-mono text-primary">{mx.priority}</td>
                                                    <td className="px-4 py-2 font-mono">{mx.exchange}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ValidationItem({ label, isValid, warning, text }: { label: string, isValid: boolean, warning?: boolean, text: string }) {
    return (
        <div className="p-3 bg-muted/20 rounded border border-border/50 flex flex-col gap-1">
            <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                {warning ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                ) : isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                    "text-sm font-medium",
                    warning ? "text-orange-500" :
                        isValid ? "text-green-500" : "text-red-500"
                )}>
                    {text}
                </span>
            </div>
        </div>
    );
}
