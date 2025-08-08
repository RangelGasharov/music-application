import { MusicTrackPlaylist } from "./MusicTrack";

export type Playlist = {
    id: string;
    user_id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    cover_url: string;
    is_public: boolean;
    music_track_playlists: MusicTrackPlaylist[];
}