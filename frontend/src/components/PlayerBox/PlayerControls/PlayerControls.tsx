"use client";
import React, { useRef, useState, useEffect } from "react";
import PlayButton from "./PlayButton";
import ShuffleButton from "./ShuffleButton";
import FastRewindButton from "./FastRewindButton";
import FastForwardButton from "./FastForwardButton";
import ReplayButton from "./ReplayButton";
import styles from "./PlayerControls.module.css";
import { MusicTrack } from "@/types/MusicTrack";

type PlayerControlsProps = {
    currentTrack: MusicTrack;
    changeToNextTrack: () => void;
    changeToPreviousTrack: () => void;
};

export default function PlayerControls({ currentTrack, changeToNextTrack, changeToPreviousTrack }: PlayerControlsProps) {
    const audioRef = useRef<HTMLAudioElement>(typeof Audio !== "undefined" ? new Audio() : null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!audioRef.current || !currentTrack?.file_path) return;

        audioRef.current.src = currentTrack.file_path;
        audioRef.current.load();

        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            setIsPlaying(false);
        });

        setCurrentTime(0);
        setDuration(0);

    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const setAudioDuration = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            changeToNextTrack();
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", setAudioDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", setAudioDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [changeToNextTrack]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
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

    return (
        <div className={styles["main-container"]}>
            <div className={styles["progress-container"]}>
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={currentTime}
                    onChange={handleDrag}
                    className={styles["progress-bar"]}
                />
                <span>{formatTime(duration)}</span>
            </div>
            <div className={styles["control-buttons-container"]}>
                <ReplayButton />
                <FastRewindButton changeToPreviousTrack={changeToPreviousTrack} />
                <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
                <FastForwardButton changeToNextTrack={changeToNextTrack} />
                <ShuffleButton />
            </div>
        </div>
    );
}