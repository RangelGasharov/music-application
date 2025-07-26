"use client"
import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"
import PlayerBackgroundImage from "./PlayerBackgroundImage/PlayerBackgroundImage"
import PlayerMusicTrackInfo from "./PlayerMusicTrackInfo/PlayerMusicTrackInfo"
import { usePlayerStore } from "@/store/usePlayerStore"
import { useEffect } from "react"

export default function PlayerBox() {
    const musicTrack = usePlayerStore((state) => state.musicTrack);
    const queueItem = usePlayerStore((state) => state.queueItem);
    const userId = usePlayerStore((state) => state.userId);
    const queue = usePlayerStore((state) => state.queue);
    const goToNextTrack = usePlayerStore((state) => state.goToNextTrack);
    const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
    const audio = usePlayerStore((state) => state.audioRef);
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
    const volume = usePlayerStore((state) => state.volume);
    const loadAndPlayTrack = usePlayerStore((state) => state.loadAndPlayTrack);

    useEffect(() => {
        if (!musicTrack) return;
        if (!audio) return;

        loadAndPlayTrack({
            id: queueItem?.id || "",
            track: musicTrack,
        } as any);
    }, [musicTrack?.id]);

    useEffect(() => {
        if (audio) {
            audio.volume = volume;
        }
    }, [volume, audio]);

    useEffect(() => {
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            goToNextTrack();
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audio, goToNextTrack, setCurrentTime, setIsPlaying]);

    useEffect(() => {
        if (!queueItem || !audio) return;

        const saveProgress = async (progressInSeconds: number) => {
            try {
                const res = await fetch("/api/queue/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        queue_id: queue?.id,
                        queue_item_id: queueItem.id,
                        progress_in_seconds: progressInSeconds,
                    }),
                });
                if (!res.ok) {
                    console.error("Error saving progress:", await res.text());
                }
            } catch (e) {
                console.error("Exception saving progress:", e);
            }
        };

        const interval = setInterval(() => {
            saveProgress(Math.floor(audio.currentTime));
        }, 10000);

        return () => {
            clearInterval(interval);
            saveProgress(Math.floor(audio.currentTime));
        };
    }, [queueItem, userId, queue, audio]);

    if (!musicTrack || !musicTrack.file_path) {
        console.warn("PlayerBox: No valid music track has been loaded!");
        return null;
    }

    return (
        <div className={styles["main-container"]}>
            <PlayerBackgroundImage currentTrack={musicTrack} />
            <PlayerImage currenTrack={musicTrack} />
            <PlayerMusicTrackInfo currentTrack={musicTrack} />
            <PlayerControls />
        </div>
    )
}