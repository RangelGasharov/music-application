import { MusicAlbumShortDto } from "./MusicAlbum";
import { MusicArtistShort } from "./MusicArtist";
import { MusicGenreShort } from "./MusicGenre";

export type MusicTrack = {
    id: string;
    title: string;
    release_date: string;
    file_path: string;
    is_explicit: boolean;
    uploaded_at: string;
    cover_url: string;
    duration: string;
}

export type MusicTrackFull = {
    id: string;
    title: string;
    release_date: string;
    file_path: string;
    is_explicit: boolean;
    uploaded_at: string;
    cover_url: string;
    duration: string;
    music_artists: MusicArtistShort[];
    music_genres: MusicGenreShort[];
    music_albums: MusicAlbumShortDto[];
    position?: number;
}

export type MusicTrackWithPosition = {
    position: number;
    track: MusicTrackFull;
}

export type MusicTrackPlaylist = {
    id: string;
    play_list_id: string;
    track_id: string;
    added_at: string;
    position: number;
    music_track: MusicTrackFull;
}

export type MusicTrackPost = {
    title: string;
    release_date: string;
    is_explicit: boolean;
    cover_image?: File;
    audio_file?: File;
    position?: number;
}

export type MusicTrackPut = {
    id: string;
    title: string;
    release_date: string;
    is_explicit: boolean;
    cover_image: File;
    audio_file: File;
}