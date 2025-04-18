import { MusicTrack } from '@/types/MusicTrack'
import Image from 'next/image'
import React from 'react'
import styles from "./PlayerBackgroundImage.module.css";

type PlayerBackgroundImageType = {
    currentTrack: MusicTrack
}

export default function PlayerBackgroundImage({ currentTrack }: PlayerBackgroundImageType) {
    return (
        <div>
            <div className={styles["background"]}> </div>
            <Image
                src={`/${currentTrack.track_image_source}`}
                alt='music track cover'
                fill
                className={styles["track-image"]}
                draggable={false}
                priority
            />
        </div>
    )
}