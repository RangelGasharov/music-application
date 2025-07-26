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

    useEffect(() => {
        setUserId(userId);
        setQueue(queue);
        setQueueItems(queueItems);

        const state = usePlayerStore.getState();
        const alreadyInitialized = state.queue?.id === queue.id && state.queueItem !== null;
        if (!alreadyInitialized && queueItems.length > 0) {
            const firstItem = queueItems[0];
            setQueueItem(firstItem);
            setMusicTrack(firstItem.track);
        }
    }, [userId, queue, queueItems]);

    return null;
}