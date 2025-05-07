import React from 'react';
import styles from "./MusicArtistContainer.module.css";
import { MusicArtist } from '@/types/MusicArtist';
import MusicArtistCard from './MusicArtistCard/MusicArtistCard';

type MusicArtistCard = {
    musicArtists: MusicArtist[]
}

export default function MusicArtistContainer({ musicArtists }: MusicArtistCard) {
    return (
        <div className={styles["main-container"]}>
            {musicArtists?.map((musicArtist) => {
                return (
                    <MusicArtistCard key={musicArtist.id} musicArtist={musicArtist} />
                )
            })}
        </div>
    )
}