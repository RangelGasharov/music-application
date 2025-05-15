import { MusicArtistShort } from "./MusicArtist";

export type MusicAlbum = {
    id: string;
    title: string;
    cover_url: string;
    release_date: string;
    uploaded_at: string;
    music_artists: MusicArtistShort[];
    description?: string;
}