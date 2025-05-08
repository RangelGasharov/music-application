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
    changeToNextTrack: React.MouseEventHandler<HTMLButtonElement>;
    changeToPreviousTrack: React.MouseEventHandler<HTMLButtonElement>;
};

export default function PlayerControls({ currentTrack, changeToNextTrack, changeToPreviousTrack }: PlayerControlsProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (currentTrack?.file_path) {
            if (audioRef.current) {
                audioRef.current.src = currentTrack.file_path;
                audioRef.current.load();
                if (isPlaying) {
                    audioRef.current.play();
                }
            } else {
                audioRef.current = new Audio(currentTrack.file_path);
            }
        }
    }, [currentTrack]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={styles["main-container"]}>
            <ReplayButton />
            <FastRewindButton changeToPreviousTrack={changeToPreviousTrack} />
            <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
            <FastForwardButton changeToNextTrack={changeToNextTrack} />
            <ShuffleButton />
        </div>
    );
}