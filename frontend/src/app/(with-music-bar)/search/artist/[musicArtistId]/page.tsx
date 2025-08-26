import { MusicArtist } from '@/types/MusicArtist';
import { TopStreamedMusicTrack } from '@/types/MusicTrack';
import { MusicAlbum } from '@/types/MusicAlbum';
import { notFound } from 'next/navigation';
import React from 'react'
import styles from "./music-artist-page.module.css"
import MusicAlbumCard from '@/components/MusicAlbumContainer/MusicAlbumCard/MusicAlbumCard';
import Image from 'next/image';
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from '@/constants/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Queue } from '@/types/Queue';
import TopMusicTrackContainer from '@/components/MusicTrack/TopMusicTrackContainer/TopMusicTrackContainer';

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

async function getTopMusicTracksByArtistId(musicArtistId: string): Promise<TopStreamedMusicTrack[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-stream/top-music-tracks/music-artist/${musicArtistId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch top music tracks');
        }

        const topMusicTracks: TopStreamedMusicTrack[] = await res.json();
        return topMusicTracks;
    } catch (error) {
        console.error('Error fetching top music tracks:', error);
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

export default async function MusicArtistPage({ params }: { params: Params }) {
    const { musicArtistId } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.userId;
    const queue: Queue = await getQueueByUserId(userId);
    const queueId = queue.id;

    try {
        const [musicArtist, topMusicTracks, musicAlbums] = await Promise.all([
            getMusicArtistById(musicArtistId),
            getTopMusicTracksByArtistId(musicArtistId),
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
                    {topMusicTracks.length === 0 ? (<p>No tracks found for this artist.</p>) : (
                        <TopMusicTrackContainer topMusicTracks={topMusicTracks} queueId={queueId} />
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
        console.error(`An error has occured: ${error}`);
        notFound();
    }
}