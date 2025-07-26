import { create } from "zustand";
import { MusicTrackFull } from "@/types/MusicTrack";
import { Queue } from "@/types/Queue";
import { QueueItemFull } from "@/types/QueueItem";

interface PlayerState {
    audioRef: HTMLAudioElement | null;
    setAudioRef: (audio: HTMLAudioElement) => void;

    musicTrack: MusicTrackFull | null;
    setMusicTrack: (track: MusicTrackFull) => void;

    isPlaying: boolean;
    setIsPlaying: (b: boolean) => void;

    currentTime: number;
    setCurrentTime: (t: number) => void;

    queue: Queue | null;
    queueItems: QueueItemFull[];
    queueItem: QueueItemFull | null;

    userId: string;
    setUserId: (id: string) => void;

    setQueue: (q: Queue) => void;
    setQueueItems: (items: QueueItemFull[]) => void;
    setQueueItem: (item: QueueItemFull) => void;

    goToNextTrack: () => void;
    goToPreviousTrack: () => void;

    volume: number;
    setVolume: (volume: number) => void;

    duration: number;
    setDuration: (d: number) => void;

    seek: (time: number) => void;
    togglePlay: () => void;
    play(): void;
    pause(): void;

    loadAndPlayTrack: (item: QueueItemFull) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    audioRef: null,
    setAudioRef: (audio) => set({ audioRef: audio }),

    musicTrack: null,
    setMusicTrack: (track) => set({ musicTrack: track }),

    isPlaying: false,
    setIsPlaying: (b) => set({ isPlaying: b }),

    currentTime: 0,
    setCurrentTime: (t) => set({ currentTime: t }),

    queue: null,
    queueItems: [],
    queueItem: null,

    userId: "",
    setUserId: (id) => set({ userId: id }),

    volume: 1,
    setVolume: (volume) => set({ volume }),

    setQueue: (q) => set({ queue: q }),
    setQueueItems: (items) => set({ queueItems: items }),

    setQueueItem: (item) => {
        set({ queueItem: item, musicTrack: item.track });
    },

    play: () => {
        const audio = get().audioRef;
        if (!audio) return;
        audio.play()
            .then(() => get().setIsPlaying(true))
            .catch(() => get().setIsPlaying(false));
    },

    pause: () => {
        const audio = get().audioRef;
        if (!audio) return;
        audio.pause();
        get().setIsPlaying(false);
    },

    togglePlay: () => {
        const audio = get().audioRef;
        if (!audio) return;
        if (get().isPlaying) {
            audio.pause();
            get().setIsPlaying(false);
        } else {
            audio.play()
                .then(() => get().setIsPlaying(true))
                .catch(() => get().setIsPlaying(false));
        }
    },

    seek: (time: number) => {
        const audio = get().audioRef;
        if (!audio) return;
        audio.currentTime = time;
        get().setCurrentTime(time);
    },

    loadAndPlayTrack: async (item: QueueItemFull) => {
        const audio = get().audioRef;
        if (!audio) return;

        try {
            audio.pause();
            set({ queueItem: item, musicTrack: item.track, currentTime: 0 });

            audio.src = item.track.file_path;
            audio.load();

            await new Promise(resolve => setTimeout(resolve, 50));
            await audio.play();
            get().setIsPlaying(true);
        } catch (e) {
            console.error("Error loading or playing track:", e);
            get().setIsPlaying(false);
        }
    },

    goToNextTrack: () => {
        const { queueItems, queueItem, loadAndPlayTrack } = get();
        if (!queueItem || queueItems.length === 0) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const next = queueItems[currentIndex + 1];
        if (next) {
            loadAndPlayTrack(next);
        }
    },

    goToPreviousTrack: () => {
        const { queueItems, queueItem, loadAndPlayTrack } = get();
        if (!queueItem || queueItems.length === 0) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const prev = queueItems[currentIndex - 1];
        if (prev) {
            loadAndPlayTrack(prev);
        }
    },

    duration: 0,
    setDuration: (d) => set({ duration: d }),
}));