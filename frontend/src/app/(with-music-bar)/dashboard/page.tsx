import React from 'react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { TopStreamedMusicTrack } from '@/types/MusicTrack';
import TopMusicTrackContainer from '@/components/MusicTrack/TopMusicTrackContainer/TopMusicTrackContainer';
import { Queue } from '@/types/Queue';
import styles from "./dashboard-page.module.css";

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

async function getQueueByUserId(userId: string | undefined): Promise<Queue> {
    if (!userId) {
        throw new Error('No user id was provided!');
    }
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/queue/user-id/${userId}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error('Failed to fetch queue');
        }
        const queue: Queue = await res.json();
        return queue;
    } catch (error) {
        console.error("An error has occured while trying to fetch the queue: ", error);
        throw error;
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.userId as string;
    const topStreamedMusicTracks: TopStreamedMusicTrack[] = await getTopMusicTracksByUserId(userId);
    const queue: Queue = await getQueueByUserId(userId);
    const queueId = queue.id;

    return (
        <div className={styles["main-container"]}>
            <h1>Dashboard</h1>
            <div className={styles["top-music-tracks-container"]}>
                <h2>Top music tracks</h2>
                <TopMusicTrackContainer topMusicTracks={topStreamedMusicTracks} queueId={queueId} />
            </div>
        </div>
    )
}