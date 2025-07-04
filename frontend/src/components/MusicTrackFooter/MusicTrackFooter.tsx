"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MusicTrackFooter.module.css";
import Image from "next/image";
import { usePlayerStore } from "@/store/usePlayerStore";
import { DEFAULT_MUSIC_ARTIST_IMAGE_SOURCE } from "@/constants/constants";
import { Pause } from "@mui/icons-material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { MusicArtist } from "@/types/MusicArtist";

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

    if (!musicTrack) return null;

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
                    <div className={styles["music-track-title-container"]}>{musicTrack.title}</div>
                    <div className={styles["music-artists-container"]}>
                        {musicTrack.music_artists.map((artist: MusicArtist) => artist.name).join(", ") || "Unkown artist"}
                    </div>
                    <div>
                        <button onClick={goToPreviousTrack}><SkipPreviousIcon /></button>
                        <button onClick={togglePlay}>{isPlaying ? <Pause /> : <PlayArrowIcon />}</button>
                        <button onClick={goToNextTrack}><SkipNextIcon /></button>
                    </div>
                    <div>
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={currentTime}
                            onChange={handleDrag}
                            className={styles["progress-bar"]}
                        />
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}