import MusicTrackListItem from '@/components/MusicTrackContainer/MusicTrackListItem/MusicTrackListItem';
import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrack } from '@/types/MusicTrack';
import { MusicAlbum } from '@/types/MusicAlbum';
import { notFound } from 'next/navigation';
import React from 'react'
import styles from "./music-artist-page.module.css"
import MusicAlbumCard from '@/components/MusicAlbumContainer/MusicAlbumCard/MusicAlbumCard';

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

async function getMusicAlbumsByArtistId(musicArtistId: string): Promise<MusicAlbum[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-album/music-artist/${musicArtistId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Albums');
        }

        const musicAlbums: MusicAlbum[] = await res.json();
        return musicAlbums;
    } catch (error) {
        console.error('Error fetching music albums:', error);
        throw error;
    }
}

export default async function MusicArtistPage({ params }: MusicArtistPageType) {
    const { musicArtistId } = await params;
    try {
        const [musicArtist, musicTracks, musicAlbums] = await Promise.all([
            getMusicArtistById(musicArtistId),
            getMusicTracksByArtistId(musicArtistId),
            getMusicAlbumsByArtistId(musicArtistId)
        ]);

        return (
            <div className={styles["main-container"]}>
                <h1>{musicArtist.name}</h1>
                {musicTracks.length === 0 ? (<p>No tracks found for this artist.</p>) : (
                    <div className={styles["music-tracks-container"]}>
                        <h2>Popular Tracks</h2>
                        {musicTracks.map((musicTrack: MusicTrack, index) => (
                            <MusicTrackListItem order={index + 1} key={musicTrack.id} musicTrack={musicTrack} />
                        ))}
                    </div>
                )}
                {musicAlbums.length === 0 ? (<p>No albums found for this artist.</p>) : (
                    <div className={styles["music-albums-container"]}>
                        <h2>Music Albums</h2>
                        {musicAlbums.map((musicAlbum: MusicAlbum) => (
                            <MusicAlbumCard key={musicAlbum.id} musicAlbum={musicAlbum} />
                        ))}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        notFound();
    }
}