import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const { queueId, position } = await req.json();

        if (!queueId || !position) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        const targetUrl = `${process.env.WEB_API_URL}/queue/${queueId}/items`;

        const response = await fetch(targetUrl, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position }),
        });

        const responseData = await response.json().catch(() => ({}));

        if (response.status === 404) {
            return NextResponse.json(
                { error: "Queue item not found" },
                { status: 404 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: responseData.message || "Failed to delete queue item" },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: "Queue item deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        );
    }
}