import { create } from "zustand";
import { PlayerState } from "@/types/PlayerState";

export const usePlayerStore = create<PlayerState>((set, get) => ({
    userId: null,
    queue: null,
    queueItems: [],
    queueItem: null,
    musicTrack: null,
    audioRef: null,
    isInitialized: false,

    setUserId: (id) => set({ userId: id }),
    setQueue: (queue) => set({ queue }),
    setQueueItem: (item) => set({ queueItem: item }),
    setQueueItems: (items) => set({ queueItems: items }),
    setQueueItemWithTrack: (item) =>
        set({ queueItem: item, musicTrack: item.track }),
    setAudioRef: (ref) => set({ audioRef: ref }),
    setInitialized: () => set({ isInitialized: true }),

    goToNextTrack: () => {
        const { queueItems, queueItem } = get();
        if (!queueItems.length || !queueItem) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const nextIndex = currentIndex + 1;

        if (nextIndex < queueItems.length) {
            set({
                queueItem: queueItems[nextIndex],
                musicTrack: queueItems[nextIndex].track,
            });
        }
    },

    goToPreviousTrack: () => {
        const { queueItems, queueItem } = get();
        if (!queueItems.length || !queueItem) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            set({
                queueItem: queueItems[prevIndex],
                musicTrack: queueItems[prevIndex].track,
            });
        }
    },
}));