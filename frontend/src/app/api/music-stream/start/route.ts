import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch(`${process.env.WEB_API_URL}/music-stream/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const text = await response.text();

        if (!response.ok) {
            console.error("Backend error (start):", response.status, text);
            return NextResponse.json({ error: text }, { status: response.status });
        }

        const data = JSON.parse(text);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error in /music-stream/start route:", error);
        return NextResponse.json(
            { error: "Failed to start music stream" },
            { status: 500 }
        );
    }
}