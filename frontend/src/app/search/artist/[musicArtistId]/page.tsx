import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrack } from '@/types/MusicTrack';
import { notFound } from 'next/navigation';
import React from 'react'

type MusicArtistPageType = {
    params: {
        musicArtistId: string;
    };
}

async function getMusicArtistById(musicArtistId: string): Promise<MusicArtist> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-artist/${musicArtistId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Artist');
        }

        const musicArtist: MusicArtist = await res.json();
        return musicArtist;
    } catch (error) {
        console.error('Error fetching music artist:', error);
        throw error;
    }
}

async function getMusicTracksByArtistId(musicArtistId: string): Promise<MusicTrack[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-track/music-artist/${musicArtistId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Tracks');
        }

        const musicTracks: MusicTrack[] = await res.json();
        return musicTracks;
    } catch (error) {
        console.error('Error fetching music tracks:', error);
        throw error;
    }
}

export default async function MusicArtistPage({ params }: MusicArtistPageType) {
    const { musicArtistId } = params;
    try {
        const [musicArtist, musicTracks] = await Promise.all([
            getMusicArtistById(musicArtistId),
            getMusicTracksByArtistId(musicArtistId)
        ]);

        return (
            <div>
                <h1>{musicArtist.name}</h1>
                <h2>Tracks</h2>
                {musicTracks.length === 0 ? (<p>No tracks found for this artist.</p>) : (
                    <ul>
                        {musicTracks.map(track => (
                            <li key={track.id}>
                                {track.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    } catch (error) {
        notFound();
    }
}