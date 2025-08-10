import PlaylistCard from '@/components/PlaylistCard/PlaylistCard';
import { authOptions } from '@/lib/auth';
import { Playlist } from '@/types/Playlist';
import { getServerSession } from 'next-auth';
import React from 'react';
import styles from "./library-page.module.css";

const getPlaylistsByUserId = async (userId: string) => {
    try {
        const API_URL = process.env.WEB_API_URL;
        const targetUrl = `${API_URL}/playlist/user-id/${userId}`;
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Failed to fetch playlists: ${errorText}`);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching music tracks:', error);
        return [];
    }
}

export default async function LibraryPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.userId as string;
    const playlists: Playlist[] = await getPlaylistsByUserId(userId);

    return (
        <div className={styles["main-container"]}>
            <h1>Library</h1>
            <div>{playlists?.map((playlist: Playlist) => {
                return <PlaylistCard key={playlist.id} playlist={playlist} />
            })}</div>
        </div>
    )
}