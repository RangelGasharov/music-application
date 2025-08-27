export type MusicStream = {
    user_id: string;
    track_id: string;
    start_time: string;
    end_time: string;
    duration: string;
    counted: boolean;
    processed: boolean;
}

export type StreamCountPerDay = {
    date: string;
    total_streams: number;
}