import MusicTrackListItem from '@/components/MusicTrackContainer/MusicTrackListItem/MusicTrackListItem';
import { MusicTrack } from '@/types/MusicTrack';
import { notFound } from 'next/navigation';
import styles from "./music-album-page.module.css";
import { MusicAlbum } from '@/types/MusicAlbum';
import Image from 'next/image';

type MusicAlbumPageType = {
    params: {
        musicAlbumId: string;
    };
}

async function getMusicAlbumById(musicAlbumId: string): Promise<MusicAlbum> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-album/${musicAlbumId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Album');
        }

        const musicAlbum: MusicAlbum = await res.json();
        return musicAlbum;
    } catch (error) {
        console.error('Error fetching music album:', error);
        throw error;
    }
}

async function getMusicTracksByAlbumId(musicAlbumId: string): Promise<MusicTrack[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-track/music-album/${musicAlbumId}`);

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

export default async function MusicAlbumPage({ params }: MusicAlbumPageType) {
    const { musicAlbumId } = await params;
    try {
        const [musicAlbum, musicTracks] = await Promise.all([
            getMusicAlbumById(musicAlbumId),
            getMusicTracksByAlbumId(musicAlbumId)
        ]);

        return (
            <div className={styles["main-container"]}>
                <div className={styles['music-album-information-container']}>
                    <div className={styles['music-album-title-description-container']}>
                        <div className={styles['music-album-title-container']}>
                            <h1>{musicAlbum.title}</h1>
                        </div>
                        <div>
                            {musicAlbum?.description}
                        </div>
                    </div>
                    <div>
                        <Image
                            src={musicAlbum.cover_url}
                            alt={musicAlbum.title}
                            width={300}
                            height={300}
                            className={styles["image"]}
                            priority
                        />
                    </div>
                </div>

                {musicTracks.length === 0 ? (<p>No tracks found for this album.</p>) : (
                    <div>
                        <h2 className={styles["music-tracks-title"]}>Tracks</h2>
                        <div className={styles["music-tracks-container"]}>
                            {musicTracks.map((musicTrack: MusicTrack, index) => (
                                <MusicTrackListItem order={index + 1} key={musicTrack.id} musicTrack={musicTrack} />
                            ))}
                        </div>
                    </div>

                )}
            </div>
        );
    } catch (error) {
        notFound();
    }
}