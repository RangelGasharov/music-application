import MusicTrackListItem from '@/components/MusicTrack/MusicTrackListItem/MusicTrackListItem';
import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrack } from '@/types/MusicTrack';
import { MusicAlbum } from '@/types/MusicAlbum';
import { notFound } from 'next/navigation';
import React from 'react'
import styles from "./music-artist-page.module.css"
import MusicAlbumCard from '@/components/MusicAlbumContainer/MusicAlbumCard/MusicAlbumCard';
import Image from 'next/image';
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from '@/constants/constants';

type Params = Promise<{ musicArtistId: string }>

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

export default async function MusicArtistPage({ params }: { params: Params }) {
    const { musicArtistId } = await params;
    try {
        const [musicArtist, musicTracks, musicAlbums] = await Promise.all([
            getMusicArtistById(musicArtistId),
            getMusicTracksByArtistId(musicArtistId),
            getMusicAlbumsByArtistId(musicArtistId)
        ]);

        return (
            <div className={styles["main-container"]}>
                <div className={styles["artist-header-container"]}>
                    <Image
                        fill
                        src={musicArtist?.primary_photo?.file_path || DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE}
                        alt={`Photo of ${musicArtist.name}`}
                        className={styles["artist-primary-image"]}
                    />
                    <h1 className={styles["artist-title"]}>{musicArtist.name}</h1>
                </div>
                <div className={styles["music-tracks-wrapper"]}>
                    <h2>Popular Tracks</h2>
                    {musicTracks.length === 0 ? (<p>No tracks found for this artist.</p>) : (
                        <div className={styles["music-tracks-container"]}>
                            {musicTracks.map((musicTrack: MusicTrack, index) => (
                                <MusicTrackListItem position={index + 1} key={musicTrack.id} musicTrack={musicTrack} />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles["music-albums-wrapper"]}>
                    <h2>Music Albums</h2>
                    {musicAlbums.length === 0 ? (<p>No albums found for this artist.</p>) : (
                        <div className={styles["music-albums-container"]}>
                            {musicAlbums.map((musicAlbum: MusicAlbum) => (
                                <MusicAlbumCard key={musicAlbum.id} musicAlbum={musicAlbum} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        );
    } catch (error) {
        console.log(`An error has occured: ${error}`);
        notFound();
    }
}