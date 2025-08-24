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
        const audio = new Audio();
        audioRef.current = audio;
        setAudioRef(audio);

        return () => {
            audio.pause();
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
            setIsLoadingTrack(false);

            if (currentTime > 0 && audio.currentTime === 0) {
                audio.currentTime = currentTime;
            }
            if (isPlaying) {
                audio.play().catch(() => setIsPlaying(false));
            }
        };

        const onTimeUpdate = () => {
            if (!isLoadingTrack) setCurrentTime(audio.currentTime);
        };

        const onEnded = async () => {
            setIsPlaying(false);
            try {
                await goToNextTrack();
            } catch (err) {
                console.error("Error going to next track:", err);
            }
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        if (audio.readyState >= 1 && isLoadingTrack) {
            onLoadedMetadata();
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
        setCurrentTime,
        setDuration,
        setIsPlaying,
        goToNextTrack,
        volume,
        isLoadingTrack,
    ]);

    return null;
}
