import { create } from "zustand";
import { Queue } from "@/types/Queue";
import { QueueItemFull } from "@/types/QueueItem";

type PlayerState = {
    userId: string | null;
    queue: Queue | null;
    queueItems: QueueItemFull[];
    queueItem: QueueItemFull | null;
    musicTrack: any | null;

    setUserId: (id: string) => void;
    setQueue: (queue: Queue) => void;
    setQueueItem: (item: QueueItemFull) => void;
    setQueueItems: (items: QueueItemFull[]) => void;
    setQueueItemWithTrack: (item: QueueItemFull) => void;

    goToNextTrack: () => void;
    goToPreviousTrack: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
    userId: null,
    queue: null,
    queueItems: [],
    queueItem: null,
    musicTrack: null,

    setUserId: (id) => set({ userId: id }),
    setQueue: (queue) => set({ queue }),
    setQueueItem: (item) => set({ queueItem: item }),
    setQueueItems: (items) => set({ queueItems: items }),
    setQueueItemWithTrack: (item) =>
        set({ queueItem: item, musicTrack: item.track }),

    goToNextTrack: () => {
        const { queueItems, queueItem } = get();
        if (!queueItems.length || !queueItem) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const nextIndex = currentIndex + 1;

        if (nextIndex < queueItems.length) {
            set({ queueItem: queueItems[nextIndex], musicTrack: queueItems[nextIndex].track });
        }
    },

    goToPreviousTrack: () => {
        const { queueItems, queueItem } = get();
        if (!queueItems.length || !queueItem) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            set({ queueItem: queueItems[prevIndex], musicTrack: queueItems[prevIndex].track });
        }
    },
}));