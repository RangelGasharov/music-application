"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Queue } from "@/types/Queue";
import { QueueItemFull } from "@/types/QueueItem";
import { QueueProgress } from "@/types/QueueProgress";

type Props = {
    userId: string;
    queue: Queue;
    queueItems: QueueItemFull[];
    queueProgress: QueueProgress
};

export default function PlayerInitializer({ userId, queue, queueItems, queueProgress }: Props) {
    const setUserId = usePlayerStore((state) => state.setUserId);
    const setQueue = usePlayerStore((state) => state.setQueue);
    const setQueueItems = usePlayerStore((state) => state.setQueueItems);
    const setQueueItem = usePlayerStore((state) => state.setQueueItem);
    const setMusicTrack = usePlayerStore((state) => state.setMusicTrack);
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
    const audio = usePlayerStore((state) => state.audioRef);
    const currentIndex = queueProgress ? queueItems.findIndex((item) => item.id === queueProgress.queue_item_id) : -1;
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;

    useEffect(() => {
        const state = usePlayerStore.getState();

        setUserId(userId);
        setQueue(queue);
        setQueueItems(queueItems);

        const alreadyInitialized =
            state.queue?.id === queue.id &&
            state.queueItem !== null &&
            state.musicTrack !== null;

        if (!alreadyInitialized && queueItems.length > 0) {
            const firstItem = queueItems[safeIndex];
            setQueueItem(firstItem);
            setMusicTrack(firstItem.track);
            setCurrentTime(queueProgress?.progress_in_seconds ?? 0);
        } else if (alreadyInitialized && audio) {
            if (state.isPlaying) {
                audio.play().catch(() => { });
            }
            audio.currentTime = state.currentTime;
        }
    }, [userId, queue, queueItems, audio]);

    return null;
}