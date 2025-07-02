import { MusicTrackWithPosition } from '@/types/MusicTrack';
import styles from "./playlist-single-page.module.css";
import { Playlist } from '@/types/Playlist';
import React from 'react';
import MusicTrackPlaylistContainer from '@/components/MusicTrack/MusicTrackPlaylistContainer/MusicTrackPlaylistContainer';
import { Queue } from '@/types/Queue';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Params = Promise<{ playlistId: string }>

async function getPlaylistById(playlistId: string): Promise<Playlist> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/playlist/${playlistId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch playlist');
        }

        const playlist: Playlist = await res.json();
        return playlist;
    } catch (error) {
        console.error('Error fetching playlist:', error);
        throw error;
    }
}

async function getMusicTracksByPlaylistId(playlistId: string): Promise<MusicTrackWithPosition[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-track/playlist/${playlistId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch tracks');
        }

        const musicTracks = await res.json();
        return musicTracks;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
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

export default async function PlaylistSingleViewPage({ params }: { params: Params }) {
    const { playlistId } = await params;
    const playlist = await getPlaylistById(playlistId);
    const musicTracks: MusicTrackWithPosition[] = await getMusicTracksByPlaylistId(playlistId);
    const session = await getServerSession(authOptions);
    const userId = session?.userId;
    const queue: Queue = await getQueueByUserId(userId);
    const queueId = queue.id;
    return (
        <div className={styles["main-container"]}>
            <h1>{playlist.title}</h1>
            <MusicTrackPlaylistContainer musicTracks={musicTracks} queueId={queueId} />
        </div>
    )
}