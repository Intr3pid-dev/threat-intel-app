import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) {
            return NextResponse.json(null, { status: 401 });
        }

        const session = await db.session.findUnique({
            where: { sessionToken },
            include: { user: true },
        });

        if (!session || session.expires < new Date()) {
            return NextResponse.json(null, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = session.user;
        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json(null, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (sessionToken) {
            await db.session.delete({
                where: { sessionToken }
            }).catch(() => { }); // Ignore if not found
        }

        const response = NextResponse.json({ success: true });
        response.cookies.delete("session_token");
        return response;
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
