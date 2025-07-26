import styles from "./page.module.css";
import PlayerBox from "../components/PlayerBox/PlayerBox";
import { MusicTrack } from "@/types/MusicTrack";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { QueueItemFull } from "@/types/QueueItem";
import PlayerInitializer from "@/components/PlayerBox/PlayerInitializer";

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

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = session?.userId as string;
  const queue = await getQueueByUserId(userId);

  if (!queue) {
    return (
      <div className={styles["empty-queue-container"]}>
        <p>No queue found!</p>
      </div>
    );
  }

  const queueItems: QueueItemFull[] = await getQueueItemsWithMusicTracks(queue.id);
  const musicTracks: MusicTrack[] = queueItems.map(item => ({
    ...item.track,
    position: item.position,
  }));

  return (
    <div className={styles["main-container"]}>
      {musicTracks.length > 0 ? (
        <>
          <PlayerInitializer
            userId={userId}
            queue={queue}
            queueItems={queueItems}
          />
          <PlayerBox />
        </>
      ) : (
        <div className={styles["empty-queue-container"]}>
          <div className={styles["music-icon-container"]}>
            <LibraryMusicIcon className={styles["music-icon"]} />
          </div>
          <p>Your queue seems to be empty. Add some tracks to it!</p>
        </div>
      )}
    </div>
  );
}