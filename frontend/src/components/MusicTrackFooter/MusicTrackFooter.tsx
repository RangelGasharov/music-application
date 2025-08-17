"use client";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useEffect } from "react";
import styles from "./MusicTrackFooter.module.css";
import Image from "next/image";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from "@/constants/constants";
import Link from "next/link";
import { MusicArtistShort } from "@/types/MusicArtist";
import FastRewindButton from "../PlayerBox/PlayerControls/FastRewindButton";
import PlayButton from "../PlayerBox/PlayerControls/PlayButton";
import FastForwardButton from "../PlayerBox/PlayerControls/FastForwardButton";
import { VolumeUp } from "@mui/icons-material";
import MusicQueueContainer from "./MusicQueueContainer/MusicQueueContainer";

export default function MusicTrackFooter() {
    const queueItem = usePlayerStore((state) => state.queueItem);
    const goToNextTrack = usePlayerStore((state) => state.goToNextTrack);
    const goToPreviousTrack = usePlayerStore((state) => state.goToPreviousTrack);
    const audio = usePlayerStore((state) => state.audioRef);
    const userId = usePlayerStore((state) => state.userId);
    const queue = usePlayerStore((state) => state.queue);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const currentTime = usePlayerStore((state) => state.currentTime);
    const volume = usePlayerStore((state) => state.volume);
    const musicTrack = usePlayerStore((state) => state.musicTrack);
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
    const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
    const duration = usePlayerStore((state) => state.duration);
    const setDuration = usePlayerStore((state) => state.setDuration);
    const seek = usePlayerStore((s) => s.seek);

    useEffect(() => {
        if (!audio) return;

        const onLoadedMetadata = () => setDuration(audio.duration);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onEnded = () => {
            setIsPlaying(false);
            goToNextTrack();
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
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
                if (!res.ok) console.error("Error saving progress:", await res.text());
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

    useEffect(() => {
        if (audio) {
            audio.volume = volume;
        }
    }, [volume, audio]);

    const togglePlay = () => {
        usePlayerStore.getState().togglePlay();
    };

    const handleDrag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        if (audio) {
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        usePlayerStore.setState({ volume: newVolume });
        if (audio) {
            audio.volume = newVolume;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    if (!musicTrack || !audio) {
        return <div className={styles["main-container"]} />;
    }

    return (
        <div className={styles["main-container"]}>
            <div className={styles["music-track-container"]}>
                <div className={styles["image-container"]}>
                    <Image
                        src={musicTrack.cover_url || DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE}
                        alt={musicTrack.title}
                        width={70}
                        height={70}
                        className={styles["image"]}
                        priority
                    />
                </div>
                <div className={styles["music-track-info-container"]}>
                    <div className={styles["music-track-title-container"]}>
                        <Link href={`/search/track/${musicTrack.id}`}>{musicTrack.title}</Link>
                    </div>
                    <div className={styles["music-artists-container"]}>
                        {musicTrack.music_artists.length > 0 ? (
                            musicTrack.music_artists.map((artist: MusicArtistShort, index: number) => (
                                <span key={artist.id}>
                                    <Link href={`/search/artist/${artist.id}`}>{artist.name}</Link>
                                    {index < musicTrack.music_artists.length - 1 && ", "}
                                </span>
                            ))
                        ) : (
                            <div>Unknown artist</div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["controls-container"]}>
                <div className={styles["control-buttons-container"]}>
                    <FastRewindButton seek={seek} changeToPreviousTrack={goToPreviousTrack} />
                    <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
                    <FastForwardButton changeToNextTrack={goToNextTrack} />
                </div>
                <div className={styles["range-bar-container"]}>
                    <div>{formatTime(currentTime)}</div>
                    <input
                        type="range"
                        min={0}
                        max={duration || audio.duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={handleDrag}
                        className={styles["progress-bar"]}
                    />
                    <div>{formatTime(duration)}</div>
                </div>
            </div>
            <div className={styles["options-container"]}>
                <div className={styles["volume-container"]}>
                    <VolumeUp sx={{ color: "var(--text-color)" }} />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className={styles["volume-slider"]}
                    />
                </div>
                <div>
                    <MusicQueueContainer />
                </div>
            </div>
        </div>
    );
}