import { Queue } from "./Queue";
import { QueueItemFull } from "./QueueItem";

export type PlayerState = {
    userId: string | null;
    queue: Queue | null;
    queueItems: QueueItemFull[];
    queueItem: QueueItemFull | null;
    musicTrack: any | null;
    audioRef: HTMLAudioElement | null;
    isInitialized: boolean;

    setUserId: (id: string) => void;
    setQueue: (queue: Queue) => void;
    setQueueItem: (item: QueueItemFull) => void;
    setQueueItems: (items: QueueItemFull[]) => void;
    setQueueItemWithTrack: (item: QueueItemFull) => void;
    setAudioRef: (ref: HTMLAudioElement) => void;
    setInitialized: () => void;

    goToNextTrack: () => void;
    goToPreviousTrack: () => void;
};