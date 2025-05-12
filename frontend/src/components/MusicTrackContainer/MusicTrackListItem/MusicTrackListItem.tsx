import { MusicTrack } from '@/types/MusicTrack'
import { formatDuration } from '@/utils/formatDuration';
import styles from "./MusicTrackListItem.module.css";
import React from 'react'
import { MusicArtistShort } from '@/types/MusicArtist';
import Image from 'next/image';

type MusicTrackListItem = {
    musicTrack: MusicTrack;
    order: number;
}

export default function MusicTrackListItem({ musicTrack, order }: MusicTrackListItem) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["order-box"]}>{order}</div>
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
            <div className={styles["title-box"]}>{musicTrack.title}</div>
            <div className={styles["music-artist-container"]}>
                {musicTrack.music_artists?.map((musicArtist: MusicArtistShort) => {
                    return <div key={musicArtist.id}>{musicArtist.name}</div>
                })}
            </div>
            <div className={styles["streams-box"]}>0</div>
            <div className={styles["duration-box"]}>{formatDuration(musicTrack.duration)}</div>
        </div>
    )
}