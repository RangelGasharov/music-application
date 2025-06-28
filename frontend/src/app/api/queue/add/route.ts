import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { queueId, musicTrackId } = await req.json();

        if (!queueId || !musicTrackId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const backendResponse = await fetch(`${process.env.WEB_API_URL}/queue/${queueId}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ track_id: musicTrackId }),
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json({ error: data.message || "Failed to add track" }, { status: backendResponse.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}