import { Playlist } from '@/types/Playlist';
import React from 'react'

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

export default async function PlaylistSingleViewPage({ params }: { params: Params }) {
    const { playlistId } = await params;
    const playlist = await getPlaylistById(playlistId);
    return (
        <div>
            <h1>{playlist.title}</h1>
        </div>
    )
}