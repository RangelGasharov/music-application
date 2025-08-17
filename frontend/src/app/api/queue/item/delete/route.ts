import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const queueId = searchParams.get("queueId");
        const position = searchParams.get("position");

        if (!queueId || !position) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        const backendResponse = await fetch(
            `${process.env.WEB_API_URL}/queue/${queueId}/items/${encodeURIComponent(position)}`,
            {
                method: "DELETE",
            }
        );

        if (backendResponse.status === 404) {
            return NextResponse.json(
                { error: "Queue item not found" },
                { status: 404 }
            );
        }

        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: "Failed to delete queue item" },
                { status: backendResponse.status }
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