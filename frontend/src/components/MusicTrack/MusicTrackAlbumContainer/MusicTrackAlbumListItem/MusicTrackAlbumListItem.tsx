import { MusicTrackFull } from '@/types/MusicTrack'
import { formatDuration } from '@/utils/formatDuration';
import styles from "./MusicTrackAlbumListItem.module.css";
import React from 'react'
import { MusicArtistShort } from '@/types/MusicArtist';
import Link from 'next/link';
import MusicTrackMoreButton from '../../MusicTrackContainer/MusicTrackCard/MusicTrackMoreButton/MusicTrackMoreButton';

type MusicTrackListItem = {
    musicTrack: MusicTrackFull;
    position: number;
    queueId: string;
}

export default function MusicTrackAlbumListItem({ musicTrack, position, queueId }: MusicTrackListItem) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["position-box"]}>{position}</div>
            <div className={styles["title-box"]}>
                <Link href={`/search/track/${musicTrack.id}`}>
                    {musicTrack.title}
                </Link>
            </div>
            <div className={styles["music-artist-container"]}>
                {musicTrack.music_artists?.map((musicArtist: MusicArtistShort, index: number) => (
                    <Link
                        key={musicArtist.id}
                        href={`/search/artist/${musicArtist.id}`}
                        className={styles["title-box"]}
                        style={{ marginRight: index < (musicTrack.music_artists!.length - 1) ? '2px' : '0' }}
                    >
                        {musicArtist.name}{index < (musicTrack.music_artists!.length - 1) ? ',' : ''}
                    </Link>
                ))}
            </div>
            <div className={styles["streams-box"]}>0</div>
            <div className={styles["duration-box"]}>{formatDuration(musicTrack.duration)}</div>
            <div><MusicTrackMoreButton queueId={queueId} musicTrack={musicTrack} /></div>
        </div>
    )
}