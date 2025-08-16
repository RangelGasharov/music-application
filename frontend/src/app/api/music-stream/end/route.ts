import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const backendRes = await fetch(`${process.env.WEB_API_URL}/music-stream/end`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            return NextResponse.json({ error: errorText }, { status: backendRes.status });
        }

        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
    } catch (error) {
        console.error("Error in /music-stream/end:", error);
        return NextResponse.json(
            { error: "Failed to end music stream" },
            { status: 500 }
        );
    }
}