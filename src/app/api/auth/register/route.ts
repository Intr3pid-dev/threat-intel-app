import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "analyst",
                // Create default profile and settings
                profile: {
                    create: {},
                },
                settings: {
                    create: {},
                },
            },
        });

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

        // Return user (without password) and session token (token should be set in cookie ideally, but for now we return it)
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json(userWithoutPassword);

        // Set cookie
        response.cookies.set("session_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
        });

        return response;

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
