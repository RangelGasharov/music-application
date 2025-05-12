import { MusicAlbum } from '@/types/MusicAlbum';
import Image from 'next/image';
import React from 'react';
import styles from "./MusicAlbumCard.module.css";
import { MusicArtistShort } from '@/types/MusicArtist';

type MusicAlbumCardType = {
    musicAlbum: MusicAlbum;
}

export default function MusicAlbumCard({ musicAlbum }: MusicAlbumCardType) {
    return (
        <div className={styles["main-container"]}>
            <Image
                src={musicAlbum.cover_url}
                alt={musicAlbum.title}
                width={200}
                height={200}
                className={styles["image"]}
                priority
            />
            <div className={styles["music-album-info"]}>
                <div className={styles["music-album-title"]}>{musicAlbum.title}</div>
                <div>
                    {musicAlbum?.music_artists?.map((musicArtist: MusicArtistShort) => {
                        return (<div key={musicArtist.id}>{musicArtist.name}</div>)
                    })}
                </div>
                <div>{new Date(musicAlbum.release_date).getFullYear()}</div>
            </div>
        </div>
    )
}