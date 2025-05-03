import React from 'react'
import Image from 'next/image'
import styles from "./PlayerImage.module.css"
import { MusicTrack } from '@/types/MusicTrack'

type PlayerImageType = {
    currenTrack: MusicTrack
}

export default function PlayerImage({ currenTrack }: PlayerImageType) {
    return (
        <Image
            src={`${currenTrack.cover_url}`}
            alt='music track cover'
            width={4000}
            height={3000}
            className={styles["image"]}
            draggable={false}
            priority
        />
    )
}