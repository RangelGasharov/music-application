import { MusicTrack } from '@/types/MusicTrack'
import { formatDuration } from '@/utils/formatDuration';
import styles from "./MusicTrackAlbumListItem.module.css";
import React from 'react'
import { MusicArtistShort } from '@/types/MusicArtist';
import Link from 'next/link';

type MusicTrackListItem = {
    musicTrack: MusicTrack;
    position: number;
}

export default function MusicTrackAlbumListItem({ musicTrack, position }: MusicTrackListItem) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["position-box"]}>{position}</div>
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
            <div className={styles["streams-box"]}>0</div>
            <div className={styles["duration-box"]}>{formatDuration(musicTrack.duration)}</div>
        </div>
    )
}