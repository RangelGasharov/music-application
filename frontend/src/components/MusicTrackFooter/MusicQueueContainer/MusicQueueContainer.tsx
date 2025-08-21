"use client";
import { useState, Fragment } from "react";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePlayerStore } from "@/store/usePlayerStore";
import ButtonClean from "@/components/Buttons/ButtonClean";
import styles from "./MusicQueueContainer.module.css";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from "@/constants/constants";
import { formatDuration } from "@/utils/formatDuration";
import Image from "next/image";

export default function MusicQueueContainer() {
    const queueItems = usePlayerStore((state) => state.queueItems);
    const setQueueItems = usePlayerStore((state) => state.setQueueItems);
    const queueItem = usePlayerStore((state) => state.queueItem);

    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };


    const handleDelete = async (id: string, position: string) => {
        try {
            const res = await fetch("/api/queue/item/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    queueId: queueItem?.queue_id,
                    position: position
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Failed to delete item:", err);
                return;
            }

            setQueueItems(queueItems.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const visibleQueueItems = queueItem
        ? queueItems.filter((item) => item.position >= queueItem.position)
        : queueItems;

    return (
        <div>
            <ButtonClean
                onClick={handleButtonClick}
                color={isOpen ? "var(--active-color)" : "var(--text-color)"}
            >
                <QueueMusicIcon />
            </ButtonClean>

            {isOpen && (
                <div className={styles["music-queue-container"]}>
                    <h3 className={styles["title"]}>Queue</h3>

                    {visibleQueueItems.length === 0 ? (
                        <div className={styles["empty"]}>No tracks in queue</div>
                    ) : (
                        <ul className={styles["queue-list"]}>
                            {visibleQueueItems.map((item, index) => {
                                const isCurrent = queueItem?.id === item.id;
                                const isNext =
                                    !isCurrent &&
                                    index > 0 &&
                                    visibleQueueItems[index - 1].id === queueItem?.id;

                                return (
                                    <Fragment key={item.id}>
                                        {isCurrent && <h4 className={styles["queue-section-title"]}>Current track</h4>}
                                        {isNext && <h4 className={styles["queue-section-title"]}>Next track</h4>}

                                        <li
                                            className={`${styles["queue-item"]} ${isCurrent ? styles["active-item"] : ""
                                                }`}
                                        >
                                            <Image
                                                width={100}
                                                height={100}
                                                src={item.track?.cover_url || DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE}
                                                alt={item.track?.title || "Unknown track"}
                                                className={styles["cover"]}
                                            />
                                            <div className={styles["info"]}>
                                                <p className={styles["track-title"]}>{item.track?.title}</p>
                                                <p className={styles["track-artist"]}>
                                                    {item.track?.music_artists?.map((a) => a.name).join(", ")}
                                                </p>
                                            </div>

                                            <span className={styles["duration"]}>
                                                {formatDuration(item.track?.duration)}
                                            </span>

                                            <button
                                                className={styles["delete-btn"]}
                                                onClick={() => handleDelete(item.id, item.position)}
                                                disabled={queueItem?.id === item.id}
                                                title={
                                                    queueItem?.id === item.id
                                                        ? "Cannot delete currently playing track"
                                                        : "Remove from queue"
                                                }
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </li>
                                    </Fragment>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}