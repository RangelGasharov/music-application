import { MusicTrackFull } from "./MusicTrack";

export type QueueItem = {
    id: string;
    queue_id: string;
    track_id: string;
    position: string;
    added_at: string;
}

export type QueueItemFull = {
    id: string;
    queue_id: string;
    track_id: string;
    position: string;
    added_at: string;
    track: MusicTrackFull;
}