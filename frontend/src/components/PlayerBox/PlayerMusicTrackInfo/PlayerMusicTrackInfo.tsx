import { MusicTrackFull } from '@/types/MusicTrack'
import React from 'react'
import styles from "./PlayerMusicTrackInfo.module.css"
import { MusicArtistShort } from '@/types/MusicArtist'
import Link from 'next/link'

type PlayerMusicTrackInfoType = {
    currentTrack: MusicTrackFull
}

export default function PlayerMusicTrackInfo({ currentTrack }: PlayerMusicTrackInfoType) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["title-container"]}>{currentTrack.title}</div>
            <div className={styles["music-artists-container"]}>
                {currentTrack.music_artists?.map((musicArtist: MusicArtistShort, index) => {
                    return <Link href={`/search/artist/${musicArtist.id}`} key={index} className={styles["music-artist-box"]}>{musicArtist.name}</Link >
                })}
            </div>
        </div>
    )
}