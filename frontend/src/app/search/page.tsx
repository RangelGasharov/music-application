import React from 'react'
import { MusicAlbumType, MusicAlbumWithImageType } from '@/types/MusicAlbum';
import MusicAlbumContainer from '@/components/MusicAlbumContainer/MusicAlbumContainer';

async function getMusicAlbumsWithImages(): Promise<MusicAlbumWithImageType[]> {
    const res = await fetch(`${process.env.WEB_API_URL}/music-album`);
    const musicAlbum = await res.json();

    const withImages = await Promise.all(
        musicAlbum.map(async (musicAlbum: MusicAlbumType) => {
            const imageRes = await fetch(`${process.env.WEB_API_URL}/music-album/cover/${musicAlbum.id}`);
            const buffer = await imageRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const imageUrl = `data:image/jpeg;base64,${base64}`;

            return {
                ...musicAlbum,
                imageUrl,
            };
        })
    );

    return withImages;
}

export default async function SearchPage() {
    const musicAlbums: MusicAlbumWithImageType[] = await getMusicAlbumsWithImages();

    return (
        <div>
            <MusicAlbumContainer musicAlbums={musicAlbums} />
        </div>
    )
}