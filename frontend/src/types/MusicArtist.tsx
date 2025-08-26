import { MusicArtistPhoto } from "./MusicArtistPhoto";

export type MusicArtist = {
    id: string;
    name: string;
    description?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    photos: MusicArtistPhoto[],
    primary_photo: MusicArtistPhoto
}

export type MusicArtistShort = {
    id: string;
    name: string;
}

export type TopStreamedMusicArtists = {
    total_plays: number;
    music_artist: MusicArtist;
}