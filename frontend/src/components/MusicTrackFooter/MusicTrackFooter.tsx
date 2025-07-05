"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MusicTrackFooter.module.css";
import Image from "next/image";
import { usePlayerStore } from "@/store/usePlayerStore";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from "@/constants/constants";
import { MusicArtist } from "@/types/MusicArtist";
import PlayButton from "../PlayerBox/PlayerControls/PlayButton";
import FastForwardButton from "../PlayerBox/PlayerControls/FastForwardButton";
import FastRewindButton from "../PlayerBox/PlayerControls/FastRewindButton";

export default function MusicTrackFooter() {
    const musicTrack = usePlayerStore((state) => state.musicTrack);
    const queueItem = usePlayerStore((state) => state.queueItem);
    const goToNextTrack = usePlayerStore((state) => state.goToNextTrack);
    const goToPreviousTrack = usePlayerStore((state) => state.goToPreviousTrack);

    const audioRef = useRef<HTMLAudioElement>(typeof Audio !== "undefined" ? new Audio() : null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!audioRef.current || !musicTrack?.file_path) return;

        audioRef.current.src = musicTrack.file_path;
        audioRef.current.load();

        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

        setCurrentTime(0);
        setDuration(0);
    }, [musicTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

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
    }, [goToNextTrack]);

    useEffect(() => {
        if (!audioRef.current || !queueItem) return;

        const interval = setInterval(() => {
            const sec = Math.floor(audioRef.current!.currentTime);
            saveProgress(sec);
        }, 10000);

        return () => {
            clearInterval(interval);
            saveProgress(Math.floor(audioRef.current!.currentTime));
        };
    }, [queueItem]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleDrag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    async function saveProgress(progressInSeconds: number) {
        try {
            const res = await fetch("/api/queue/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: usePlayerStore.getState().userId,
                    queue_id: usePlayerStore.getState().queue!.id,
                    queue_item_id: usePlayerStore.getState().queueItem!.id,
                    progress_in_seconds: progressInSeconds,
                }),
            });
            if (!res.ok) console.error("Error saving progress:", await res.text());
        } catch (e) {
            console.error("Exception saving progress:", e);
        }
    }

    if (!musicTrack) return null;

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
                    <div className={styles["music-track-title-container"]}>{musicTrack.title}</div>
                    <div className={styles["music-artists-container"]}>
                        {musicTrack.music_artists.map((artist: MusicArtist) => artist.name).join(", ") || "Unkown artist"}
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

            </div>
        </div>
    );
}