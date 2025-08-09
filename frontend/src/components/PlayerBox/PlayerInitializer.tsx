"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Queue } from "@/types/Queue";
import { QueueItemFull } from "@/types/QueueItem";

type Props = {
    userId: string;
    queue: Queue;
    queueItems: QueueItemFull[];
};

export default function PlayerInitializer({ userId, queue, queueItems }: Props) {
    const setUserId = usePlayerStore((state) => state.setUserId);
    const setQueue = usePlayerStore((state) => state.setQueue);
    const setQueueItems = usePlayerStore((state) => state.setQueueItems);
    const setQueueItem = usePlayerStore((state) => state.setQueueItem);
    const setMusicTrack = usePlayerStore((state) => state.setMusicTrack);
    const audio = usePlayerStore((state) => state.audioRef);

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
            const firstItem = queueItems[0];
            setQueueItem(firstItem);
            setMusicTrack(firstItem.track);
        } else if (alreadyInitialized && audio) {
            if (state.isPlaying) {
                audio.play().catch(() => { });
            }
            audio.currentTime = state.currentTime;
        }
    }, [userId, queue, queueItems, audio]);

    return null;
}