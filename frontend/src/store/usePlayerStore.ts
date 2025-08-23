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

    streamId: string | null;
    setStreamId: (id: string | null) => void;
    startStream: () => Promise<void>;
    endStream: () => Promise<void>;
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

    togglePlay: async () => {
        const { audioRef, isPlaying, setIsPlaying, startStream, endStream } = get();
        if (!audioRef) return;

        if (isPlaying) {
            audioRef.pause();
            setIsPlaying(false);
            await endStream();
        } else {
            try {
                await startStream();
                await audioRef.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Error toggling play:", err);
                setIsPlaying(false);
            }
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

            audio.src = item.track.file_path;
            audio.load();

            audio.currentTime = 0;
            get().setCurrentTime(0);

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                await playPromise;
                get().setIsPlaying(true);
            }
        } catch (e) {
            console.warn("Audio play() failed:", e);
            get().setIsPlaying(false);
        }
    },

    goToNextTrack: async () => {
        const { queueItems, queueItem, endStream, startStream, loadAndPlayTrack, setCurrentTime } = get();
        if (!queueItem || queueItems.length === 0) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const next = queueItems[currentIndex + 1];
        if (!next) return;

        if (get().streamId) {
            await endStream();
        }

        setCurrentTime(0);
        set({ queueItem: next, musicTrack: next.track });

        await startStream();

        await loadAndPlayTrack(next);
    },

    goToPreviousTrack: async () => {
        const { queueItems, queueItem, isPlaying, endStream, startStream, loadAndPlayTrack } = get();
        if (!queueItem || queueItems.length === 0) return;

        const currentIndex = queueItems.findIndex((item) => item.id === queueItem.id);
        const prev = queueItems[currentIndex - 1];
        if (!prev) return;

        if (get().streamId) {
            await endStream();
        }

        set({ queueItem: prev, musicTrack: prev.track });

        await startStream();

        if (isPlaying) {
            await loadAndPlayTrack(prev);
        }
    },

    duration: 0,
    setDuration: (d) => set({ duration: d }),

    streamId: null,
    setStreamId: (id) => set({ streamId: id }),

    startStream: async () => {
        const { userId, musicTrack } = get();
        if (!userId || !musicTrack?.id) {
            console.error("Missing userId or trackId for startStream");
            return;
        }

        try {
            const res = await fetch("/api/music-stream/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    track_id: musicTrack.id,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Failed to start stream");
            }
            const data = await res.json();
            get().setStreamId(data.id || data.stream_id);
            return data;
        } catch (error) {
            console.error("Start stream error:", error);
            throw error;
        }
    },

    endStream: async () => {
        const { streamId } = get();
        if (!streamId) {
            console.error("No streamId to end");
            return;
        }

        try {
            const res = await fetch("/api/music-stream/end", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stream_id: streamId
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Failed to end stream");
            }

            get().setStreamId(null);

            return await res.json();
        } catch (error) {
            console.error("End stream error:", error);
            throw error;
        }
    },
}));