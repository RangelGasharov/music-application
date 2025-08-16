import { NextResponse } from "next/server";

export const config = {
    api: { bodyParser: false },
};

export async function POST(req: Request) {
    const API_URL = process.env.WEB_API_URL;
    if (!API_URL) return NextResponse.json({ error: "API_URL not configured" }, { status: 500 });

    try {
        const response = await fetch(`${API_URL}/music-album/with-tracks`, {
            method: "POST",
            headers: {
                'Content-Type': req.headers.get('content-type') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
            body: req.body,
            duplex: 'half',
        });

        const responseBody = await response.arrayBuffer();
        const nextResponse = new NextResponse(responseBody, { status: response.status });

        response.headers.forEach((value, key) => nextResponse.headers.set(key, value));

        return nextResponse;
    } catch (error) {
        console.error("Error forwarding request:", error);
        return NextResponse.json({ error: "Failed to forward request" }, { status: 500 });
    }
}