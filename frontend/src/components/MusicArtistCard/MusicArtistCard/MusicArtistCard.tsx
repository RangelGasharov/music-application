import React from 'react';
import styles from "./MusicArtistCard.module.css";
import { MusicArtist } from '@/types/MusicArtist';
import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from '@/constants/constants';

type MusicArtistCardType = {
    musicArtist: MusicArtist
}

export default function MusicArtistCard({ musicArtist }: MusicArtistCardType) {
    return (
        <Link href={`/search/artist/${musicArtist.id}`} className={styles["main-container"]}>
            <div>
                <Image
                    src={musicArtist?.primary_photo?.file_path || DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE}
                    alt={musicArtist.name}
                    width={200}
                    height={200}
                    className={styles["image"]}
                    priority
                />
            </div>
            <div className={styles["music-artist-info"]}>
                <div className={styles["music-artist-title"]}>{musicArtist.name}</div>
            </div>
        </Link>
    )
}