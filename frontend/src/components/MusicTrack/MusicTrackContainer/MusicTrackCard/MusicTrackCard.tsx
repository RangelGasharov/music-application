import { MusicTrack } from '@/types/MusicTrack';
import React from 'react';
import styles from "./MusicTrackCard.module.css";
import Image from 'next/image';
import { MusicArtistShort } from '@/types/MusicArtist';
import Link from 'next/link';

type MusicTrackCardType = {
    musicTrack: MusicTrack
}

export default function MusicTrackCard({ musicTrack }: MusicTrackCardType) {
    return (
        <Link href={`/search/track/${musicTrack.id}`}>
            <div className={styles["main-container"]}>
                <Image
                    quality={50}
                    src={musicTrack.cover_url}
                    alt={musicTrack.title}
                    width={200}
                    height={200}
                    className={styles["image"]}
                    priority
                />
                <div className={styles["music-track-info"]}>
                    <div className={styles["music-track-title"]}>{musicTrack.title}</div>
                    <div>
                        {musicTrack?.music_artists?.map((musicArtist: MusicArtistShort) => {
                            return (<div key={musicArtist.id}>{musicArtist.name}</div>)
                        })}
                    </div>
                    <div>{new Date(musicTrack.release_date).getFullYear()}</div>
                </div>
            </div>
        </Link>
    )
}