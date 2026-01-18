
// Basic list of common profanity and offensive terms to block
const BLACKLIST = [
    "damn", "hell", "fuck", "shit", "bitch", "bastard", "asshole", "dick", "pussy", "cunt",
    "cock", "whore", "slut", "nigger", "nigga", "faggot", "kike", "spic", "chink", "retard"
    // Add more as needed, keeping it basic for now
];

export function containsProfanity(text: string): boolean {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return BLACKLIST.some(word => lowerText.includes(word));
}

export function sanitizeInput(text: string): string {
    if (!text) return "";
    return text.replace(/[<>]/g, ""); // Basic XSS prevention
}
