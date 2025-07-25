"use client"
import { usePlayerStore } from "@/store/usePlayerStore";
import { useEffect, useState } from "react";
import styles from "./MusicTrackFooter.module.css";
import { usePlayerStoreWithSSR } from "@/store/usePlayerStoreWithSSR";
import Image from "next/image";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from "@/constants/constants";
import Link from "next/link";
import { MusicArtist } from "@/types/MusicArtist";
import FastRewindButton from "../PlayerBox/PlayerControls/FastRewindButton";
import PlayButton from "../PlayerBox/PlayerControls/PlayButton";
import FastForwardButton from "../PlayerBox/PlayerControls/FastForwardButton";
import { VolumeUp } from "@mui/icons-material";

export default function MusicTrackFooter() {
    const {
        queueItem,
        goToNextTrack,
        goToPreviousTrack,
        audioRef: audio,
        userId,
        queue,
    } = usePlayerStore((state) => ({
        queueItem: state.queueItem,
        goToNextTrack: state.goToNextTrack,
        goToPreviousTrack: state.goToPreviousTrack,
        audioRef: state.audioRef,
        userId: state.userId,
        queue: state.queue,
    }));

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const musicTrack = usePlayerStoreWithSSR((state) => state.musicTrack);

    if (!musicTrack || !audio) {
        return <div className={styles["main-container"]} />;
    }

    useEffect(() => {
        audio.pause();
        audio.src = musicTrack.file_path;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        setDuration(0);
    }, [musicTrack, audio]);

    useEffect(() => {
        const updateTime = () => setCurrentTime(audio.currentTime);
        const setAudioDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            goToNextTrack();
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", setAudioDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", setAudioDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audio, goToNextTrack]);

    useEffect(() => {
        if (!queueItem) return;

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
            const sec = Math.floor(audio.currentTime);
            saveProgress(sec);
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
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleDrag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        if (audio) {
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className={styles["main-container"]}>
            <div className={styles["music-track-container"]} >
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
                        <Link href={`/search/track/${musicTrack.id}`}>{musicTrack.title}</Link></div>
                    <div className={styles["music-artists-container"]}>
                        {musicTrack.music_artists.length > 0 ? musicTrack.music_artists.map((artist: MusicArtist, index: number) => {
                            return (
                                <div key={artist.id}>
                                    <Link key={artist.id} href={`/search/artist/${artist.id}`}>{artist.name}</Link>
                                    {index < musicTrack.music_artists.length - 1 && ', '}
                                </div>
                            )
                        }) : (<div>Unknown artist</div>)}
                    </div>
                </div>
            </div>
            <div className={styles["controls-container"]}>
                <div className={styles["control-buttons-container"]}>
                    <FastRewindButton changeToPreviousTrack={goToPreviousTrack} />
                    <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
                    <FastForwardButton changeToNextTrack={goToNextTrack} />
                </div>
                <div className={styles["range-bar-container"]}>
                    <div>{formatTime(currentTime)}</div>
                    <input
                        type="range"
                        min={0}
                        max={duration}
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
                    <VolumeUp />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className={styles["volume-slider"]}
                    />
                </div>
            </div>
        </div>
    );
}