"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function AudioProvider() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const setAudioRef = usePlayerStore((s) => s.setAudioRef);
    const musicTrack = usePlayerStore((s) => s.musicTrack);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
    const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
    const setDuration = usePlayerStore((s) => s.setDuration);
    const goToNextTrack = usePlayerStore((s) => s.goToNextTrack);
    const volume = usePlayerStore((s) => s.volume);

    useEffect(() => {
        audioRef.current = new Audio();
        setAudioRef(audioRef.current);

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [setAudioRef]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;

        if (!musicTrack) {
            audio.pause();
            setIsPlaying(false);
            setDuration(0);
            return;
        }

        if (audio.src !== musicTrack.file_path) {
            audio.src = musicTrack.file_path;
            audio.load();
            setCurrentTime(0);

            audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        } else {
            if (isPlaying) {
                audio.play().catch(() => setIsPlaying(false));
            } else {
                audio.pause();
            }
        }

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
    }, [musicTrack, isPlaying, setCurrentTime, setDuration, setIsPlaying, goToNextTrack, volume]);

    return null;
}