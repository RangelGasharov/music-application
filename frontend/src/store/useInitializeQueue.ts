import { useEffect } from "react";
import { usePlayerStore } from "./usePlayerStore";
import { QueueItemFull } from "@/types/QueueItem";
import { Queue } from "@/types/Queue";

export function useInitializeQueue(queue: Queue, queueItems: QueueItemFull[]) {
    const setQueue = usePlayerStore((state) => state.setQueue);
    const setQueueItemWithTrack = usePlayerStore((state) => state.setQueueItemWithTrack);

    useEffect(() => {
        if (!queue || queueItems.length === 0) return;
        setQueue(queue);

        setQueueItemWithTrack(queueItems[0]);
    }, [queue, queueItems, setQueue, setQueueItemWithTrack]);
}