import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json(); // Accept email instead of name for cleaner auth

        if (!email || !password) {
            return NextResponse.json(
                { message: "Missing credentials" },
                { status: 400 }
            );
        }

        // Find user by email OR name (to support legacy name login if needed, or just email)
        // Let's support both for flexibility
        const user = await db.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { name: email }
                ]
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create session
        const sessionToken = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expires,
            },
        });

        // Return user
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json(userWithoutPassword);

        response.cookies.set("session_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
