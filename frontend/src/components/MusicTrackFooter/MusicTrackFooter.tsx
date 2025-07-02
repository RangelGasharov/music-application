import React from 'react';
import styles from "./MusicTrackFooter.module.css";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from '@/constants/constants';
import Image from 'next/image';
import { MusicTrackFull } from '@/types/MusicTrack';

type Props = {
    //musicTrack: MusicTrackFull
}

export default function MusicTrackFooter(/*{ musicTrack }: Props*/) {
    return (
        <div className={styles["main-container"]}>
            <div>
                <div className={styles["image-container"]}>
                    <Image
                        src={DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE}
                        alt={""}
                        width={50}
                        height={50}
                        className={styles["image"]}
                        priority
                    />
                </div>
                <div className={styles["music-track-title-container"]}>Title</div>
                <div className={styles["music-artists-container"]}>Artists</div>
            </div>
        </div>
    )
}