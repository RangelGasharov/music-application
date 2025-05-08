import React from 'react';
import styles from "./MusicArtistCard.module.css";
import { MusicArtist } from '@/types/MusicArtist';

type MusicArtistCardType = {
    musicArtist: MusicArtist
}

export default function MusicArtistCard({ musicArtist }: MusicArtistCardType) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["music-artist-info"]}>
                <div className={styles["music-artist-title"]}>{musicArtist.name}</div>
            </div>
        </div>
    )
}