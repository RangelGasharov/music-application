"use client";
import React, { useState } from "react";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { usePlayerStore } from "@/store/usePlayerStore";
import ButtonClean from "@/components/Buttons/ButtonClean";
import styles from "./MusicQueueContainer.module.css";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from "@/constants/constants";
import { formatDuration } from "@/utils/formatDuration";
import Image from "next/image";

type Props = {};

export default function MusicQueueContainer({ }: Props) {
    const queueItems = usePlayerStore((state) => state.queueItems);
    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <ButtonClean onClick={handleButtonClick} color={isOpen ? "var(--active-color)" : "var(--text-color)"}>
                <QueueMusicIcon />
            </ButtonClean>

            {isOpen && (
                <div className={styles["music-queue-container"]}>
                    <h3 className={styles["title"]}>Queue</h3>

                    {queueItems.length === 0 ? (
                        <div className={styles["empty"]}>No tracks in queue</div>
                    ) : (
                        <ul className={styles["queue-list"]}>
                            {queueItems.map((item) => (
                                <li key={item.id} className={styles["queue-item"]}>
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
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}