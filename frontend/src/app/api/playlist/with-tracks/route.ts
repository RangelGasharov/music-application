import { NextResponse } from "next/server";

export const config = {
    api: {
        bodyParser: false,
    },
};

interface CustomRequestInit extends RequestInit {
    duplex?: 'half' | 'full';
}

export async function POST(req: Request) {
    const API_URL = process.env.WEB_API_URL;
    if (!API_URL) {
        return NextResponse.json({ error: "API_URL not configured" }, { status: 500 });
    }

    const targetUrl = `${API_URL}/playlist/with-tracks`;

    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                'Content-Type': req.headers.get('content-type') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
            body: req.body,
            redirect: "manual",
            duplex: 'half'
        } as CustomRequestInit);

        const responseBody = await response.arrayBuffer();
        const nextResponse = new NextResponse(responseBody, {
            status: response.status,
        });

        response.headers.forEach((value, key) => {
            nextResponse.headers.set(key, value);
        });

        return nextResponse;
    } catch (error) {
        console.error("Error forwarding playlist creation request:", error);
        return NextResponse.json({ error: "Failed to forward playlist request" }, { status: 500 });
    }
}