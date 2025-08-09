"use client"
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function AudioProvider() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const setAudioRef = usePlayerStore((s) => s.setAudioRef);
    const musicTrack = usePlayerStore((s) => s.musicTrack);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
    const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
    const setDuration = usePlayerStore((s) => s.setDuration);
    const currentTime = usePlayerStore((s) => s.currentTime);
    const volume = usePlayerStore((s) => s.volume);
    const goToNextTrack = usePlayerStore((s) => s.goToNextTrack);

    const [isLoadingTrack, setIsLoadingTrack] = useState(false);

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

        if (!musicTrack) {
            audio.pause();
            setIsPlaying(false);
            setDuration(0);
            setCurrentTime(0);
            return;
        }

        if (audio.src !== musicTrack.file_path) {
            setIsLoadingTrack(true);
            audio.pause();
            audio.src = musicTrack.file_path;
            audio.load();
        }

        const onLoadedMetadata = () => {
            setDuration(audio.duration);

            if (currentTime && currentTime < audio.duration) {
                audio.currentTime = currentTime;
            }

            audio.currentTime = 0;
            setCurrentTime(0);
            setIsPlaying(true);

            setIsLoadingTrack(false);

            if (isPlaying) {
                audio.play().catch(() => setIsPlaying(false));
            }
        };

        const onTimeUpdate = () => {
            if (!isLoadingTrack) setCurrentTime(audio.currentTime);
        };

        const onEnded = () => {
            setIsPlaying(false);
            goToNextTrack();
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        if (audio.readyState >= 1 && isLoadingTrack) {
            onLoadedMetadata();
        }

        if (!isLoadingTrack) {
            if (isPlaying) {
                audio.play().catch(() => setIsPlaying(false));
            } else {
                audio.pause();
            }
        }

        audio.volume = volume;

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
        };
    }, [
        musicTrack?.file_path,
        isPlaying,
        currentTime,
        setCurrentTime,
        setDuration,
        setIsPlaying,
        goToNextTrack,
        volume,
        isLoadingTrack,
    ]);

    return null;
}
