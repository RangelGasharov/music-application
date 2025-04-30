export type MusicTrack = {
    id: number,
    title: string,
    release_date: string,
    file_path: string,
    is_explicit: boolean,
    uploaded_at: string,
    cover_url: string,
    duration: string
}

export type MusicTrackPost = {
    title: string,
    release_date: string,
    is_explicit: string,
    cover_image: File,
    audio_file: File
}

export type MusicTrackPut = {
    id: number,
    title: string,
    release_date: string,
    is_explicit: string,
    cover_image: File,
    audio_file: File
}