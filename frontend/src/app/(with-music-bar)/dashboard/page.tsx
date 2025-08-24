import React from 'react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { TopStreamedMusicTrack } from '@/types/MusicTrack';
import TopMusicTrackContainer from '@/components/MusicTrack/TopMusicTrackContainer/TopMusicTrackContainer';

const getTopMusicTracksByUserId = async (userId: string) => {
    try {
        const API_URL = process.env.WEB_API_URL;
        const targetUrl = `${API_URL}/music-stream/top-music-tracks/user/${userId}`;
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Failed to fetch music tracks: ${errorText}`);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching music tracks:', error);
        return [];
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.userId as string;
    const topStreamedMusicTracks: TopStreamedMusicTrack[] = await getTopMusicTracksByUserId(userId);

    return (
        <div>
            <h1>Dashboard</h1>
            <TopMusicTrackContainer topMusicTracks={topStreamedMusicTracks} />
        </div>
    )
}