import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const API_URL = process.env.WEB_API_URL;
    if (!API_URL) {
        return NextResponse.json({ error: "API_URL not configured" }, { status: 500 });
    }

    const targetUrl = `${API_URL}/search`;

    if (!term) {
        return NextResponse.json({ error: 'Missing search term' }, { status: 400 });
    }

    try {
        const backendUrl = `${targetUrl}?term=${encodeURIComponent(term)}`;
        const backendResponse = await fetch(backendUrl);

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            console.error('Backend error:', errorText);
            return NextResponse.json({ error: 'Backend error' }, { status: 500 });
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Request failed:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
