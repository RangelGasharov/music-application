import React from 'react'
import styles from "./PlaylistCard.module.css"
import { Playlist } from '@/types/Playlist'
import Image from 'next/image'
import { DEFAULT_PLAYLIST_IMAGE_SOURCE } from '@/constants/constants'
import Link from 'next/link'

type PlayListCardType = {
    playlist: Playlist
}

export default function PlaylistCard({ playlist }: PlayListCardType) {
    return (
        <Link href={`/library/playlists/${playlist.id}`} className={styles["main-container"]}>
            <Image
                quality={50}
                src={playlist.cover_url || DEFAULT_PLAYLIST_IMAGE_SOURCE}
                alt={playlist.title}
                width={200}
                height={200}
                className={styles["image"]}
                priority
            />
            <div className={styles["title-container"]}>{playlist.title}</div>
        </Link>
    )
}