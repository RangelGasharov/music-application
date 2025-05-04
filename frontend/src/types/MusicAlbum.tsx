import { MusicArtistShort } from "./MusicArtist";

export type MusicAlbumType = {
    id: string;
    title: string;
    cover_url: string;
    release_date: string;
    uploaded_at: string;
    music_artists: MusicArtistShort[];
}

export type MusicAlbumWithImageType = MusicAlbumType & {
    imageUrl: string;
}