import React from 'react'
import { MusicAlbumWithImageType } from '@/types/MusicAlbum';
import MusicAlbumContainer from '@/components/MusicAlbumContainer/MusicAlbumContainer';

async function getMusicAlbums(): Promise<MusicAlbumWithImageType[]> {
    const res = await fetch(`${process.env.WEB_API_URL}/music-album`);
    const musicAlbum = await res.json();
    return musicAlbum;
}

export default async function SearchPage() {
    const musicAlbums: MusicAlbumWithImageType[] = await getMusicAlbums();

    return (
        <div>
            <MusicAlbumContainer musicAlbums={musicAlbums} />
        </div>
    )
}