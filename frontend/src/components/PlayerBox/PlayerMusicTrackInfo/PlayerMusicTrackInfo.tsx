import { MusicTrack } from '@/types/MusicTrack'
import React from 'react'
import styles from "./PlayerMusicTrackInfo.module.css"
import { MusicArtistShort } from '@/types/MusicArtist'

type PlayerMusicTrackInfoType = {
    currentTrack: MusicTrack
}

export default function PlayerMusicTrackInfo({ currentTrack }: PlayerMusicTrackInfoType) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["title-container"]}>{currentTrack.title}</div>
            <div className={styles["music-artists-container"]}>
                {currentTrack.music_artists?.map((musicArtist: MusicArtistShort, index) => {
                    return <div key={index} className={styles["music-artist-box"]}>{musicArtist.name}</div>
                })}
            </div>
        </div>
    )
}