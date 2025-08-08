import { MusicTrackFull } from '@/types/MusicTrack'
import { formatDuration } from '@/utils/formatDuration';
import styles from "./MusicTrackPlaylistListItem.module.css";
import React from 'react'
import { MusicArtistShort } from '@/types/MusicArtist';
import Image from 'next/image';
import Link from 'next/link';
import MusicTrackMoreButton from '../../MusicTrackContainer/MusicTrackCard/MusicTrackMoreButton/MusicTrackMoreButton';

type MusicTrackListItem = {
    musicTrack: MusicTrackFull;
    position: number;
    queueId: string;
    added_at: string;
}

export default function MusicTrackPlaylistListItem({ musicTrack, position, queueId, added_at }: MusicTrackListItem) {
    const musicTrackAddedDateFormatted: string = new Intl.DateTimeFormat(navigator.language, {
        year: 'numeric', month: 'short', day: 'numeric'
    }).format(new Date(added_at));
    return (
        <div className={styles["main-container"]}>
            <div className={styles["position-box"]}>{position}</div>
            <div className={styles["music-track-cover-box"]}>
                <Image
                    src={musicTrack.cover_url}
                    alt={musicTrack.title}
                    width={60}
                    height={60}
                    className={styles["image"]}
                    priority
                />
            </div>
            <div className={styles["title-box"]}>
                <Link href={`/search/track/${musicTrack.id}`}>
                    {musicTrack.title}
                </Link>
            </div>
            <div className={styles["music-artist-container"]}>
                {musicTrack.music_artists?.map((musicArtist: MusicArtistShort) => {
                    return <div key={musicArtist.id}>
                        <Link href={`/search/artist/${musicArtist.id}`} className={styles["title-box"]}>
                            {musicArtist.name}
                        </Link>
                    </div>
                })}
            </div>
            <div className={styles["music-track-added-box"]}>{musicTrackAddedDateFormatted}</div>
            <div className={styles["duration-box"]}>{formatDuration(musicTrack.duration)}</div>
            <div><MusicTrackMoreButton musicTrack={musicTrack} queueId={queueId} /></div>
        </div>
    )
}