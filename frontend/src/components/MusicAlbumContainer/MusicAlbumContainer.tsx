import { MusicAlbum } from '@/types/MusicAlbum'
import React from 'react'
import MusicAlbumCard from './MusicAlbumCard/MusicAlbumCard';
import styles from "./MusicAlbumContainer.module.css";

type MusicAlbumContainerType = {
    musicAlbums: MusicAlbum[];
}

export default function MusicAlbumContainer({ musicAlbums }: MusicAlbumContainerType) {
    return (
        <div className={styles["main-container"]}>
            {musicAlbums?.map((musicAlbum: MusicAlbum) => {
                return (
                    <MusicAlbumCard key={musicAlbum.id} musicAlbum={musicAlbum} />
                )
            })}
        </div>
    )
}