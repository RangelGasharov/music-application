import { MusicTrackFull } from '@/types/MusicTrack';
import React from 'react';
import styles from "./MusicTrackCard.module.css";
import Image from 'next/image';
import { MusicArtistShort } from '@/types/MusicArtist';
import Link from 'next/link';
import MusicTrackMoreButton from './MusicTrackMoreButton/MusicTrackMoreButton';

type MusicTrackCardType = {
    musicTrack: MusicTrackFull;
    queueId: string;
}

export default function MusicTrackCard({ musicTrack, queueId }: MusicTrackCardType) {
    return (

        <div className={styles["main-container"]}>
            <Link href={`/search/track/${musicTrack.id}`}>
                <Image
                    quality={50}
                    src={musicTrack.cover_url}
                    alt={musicTrack.title}
                    width={200}
                    height={200}
                    className={styles["image"]}
                    priority
                />
            </Link>
            <div className={styles["music-track-footer"]}>
                <Link href={`/search/track/${musicTrack.id}`} className={styles["music-track-info"]}>
                    <div className={styles["music-track-title"]}>{musicTrack.title}</div>
                    <div>
                        {musicTrack?.music_artists?.map((musicArtist: MusicArtistShort) => {
                            return (<div key={musicArtist.id}>{musicArtist.name}</div>)
                        })}
                    </div>
                    <div>{new Date(musicTrack.release_date).getFullYear()}</div>
                </Link>
                <div className={styles["more-vertical-button-container"]}>
                    <MusicTrackMoreButton queueId={queueId} musicTrack={musicTrack} />
                </div>
            </div>
        </div>

    )
}