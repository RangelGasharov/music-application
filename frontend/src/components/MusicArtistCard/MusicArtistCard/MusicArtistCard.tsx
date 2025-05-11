import React from 'react';
import styles from "./MusicArtistCard.module.css";
import { MusicArtist } from '@/types/MusicArtist';
import Link from 'next/link';

type MusicArtistCardType = {
    musicArtist: MusicArtist
}

export default function MusicArtistCard({ musicArtist }: MusicArtistCardType) {
    return (
        <Link href={`/search/artist/${musicArtist.id}`} className={styles["main-container"]}>
            <div className={styles["music-artist-info"]}>
                <div className={styles["music-artist-title"]}>{musicArtist.name}</div>
            </div>
        </Link>
    )
}