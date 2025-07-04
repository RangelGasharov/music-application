"use client";

import { useEffect } from "react";
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
    const setQueueItemWithTrack = usePlayerStore((state) => state.setQueueItemWithTrack);
    const setQueueItems = usePlayerStore((state) => state.setQueueItems);

    useEffect(() => {
        setUserId(userId);
        setQueue(queue);
        setQueueItems(queueItems);

        if (queueItems.length > 0) {
            setQueueItemWithTrack(queueItems[0]);
        }
    }, [userId, queue, queueItems]);

    return null;
}