import MusicTrackFooter from "@/components/MusicTrackFooter/MusicTrackFooter";
import styles from "./layout.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { QueueItemFull } from "@/types/QueueItem";
import { Queue } from "@/types/Queue";

const getQueueByUserId = async (userId: string) => {
    try {
        const API_URL = process.env.WEB_API_URL;
        const targetUrl = `${API_URL}/queue/user-id/${userId}`;
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Failed to fetch queue: ${errorText}`);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the queue:', error);
        return [];
    }
}

const getQueueItemsWithMusicTracks = async (queueId: string) => {
    try {
        const API_URL = process.env.WEB_API_URL;
        const targetUrl = `${API_URL}/queue/queue-items-with-tracks/${queueId}`;
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Failed to fetch queue items: ${errorText}`);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the queue items:', error);
        return [];
    }
}

export default async function RootMusicBarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const userId = session?.userId as string;

    let queue: Queue | null = null;
    let queueItems: QueueItemFull[] = [];

    if (userId) {
        queue = await getQueueByUserId(userId);
        if (queue) {
            queueItems = await getQueueItemsWithMusicTracks(queue.id);
        }
    }

    return (
        <div className={styles["main-container"]}>
            {children}
            <div className={styles["footer-container"]}>
                <MusicTrackFooter />
            </div>
        </div>
    );
}
