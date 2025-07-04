import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { user_id, queue_id, queue_item_id, progress_in_seconds } = await request.json();

        if (!user_id || !queue_id || !queue_item_id || typeof progress_in_seconds !== "number") {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const API_URL = process.env.WEB_API_URL;

        const res = await fetch(`${API_URL}/queue-progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, queue_id, queue_item_id, progress_in_seconds }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error during forwarding to the backend:", errorText);
            return NextResponse.json({ error: "Backend error" }, { status: res.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API /queue/progress error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}