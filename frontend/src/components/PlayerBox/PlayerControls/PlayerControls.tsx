"use client";
import styles from "./PlayerControls.module.css";
import PlayButton from "./PlayButton";
import ShuffleButton from "./ShuffleButton";
import FastRewindButton from "./FastRewindButton";
import FastForwardButton from "./FastForwardButton";
import ReplayButton from "./ReplayButton";
import PlayerOptions from "./PlayerOptions/PlayerOptions";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function PlayerControls() {
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const togglePlay = usePlayerStore((s) => s.togglePlay);
    const currentTime = usePlayerStore((s) => s.currentTime);
    const duration = usePlayerStore((s) => s.duration);
    const seek = usePlayerStore((s) => s.seek);
    const goToNextTrack = usePlayerStore((s) => s.goToNextTrack);
    const goToPreviousTrack = usePlayerStore((s) => s.goToPreviousTrack);

    const formatTime = (time: number) => {
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seek(parseFloat(e.target.value));
    };

    return (
        <div className={styles["main-container"]}>
            <div className={styles["progress-container"]}>
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={isNaN(duration) ? 0 : duration}
                    step="0.1"
                    value={currentTime}
                    onChange={onSeek}
                    className={styles["progress-bar"]}
                />
                <span>{formatTime(duration)}</span>
            </div>

            <div className={styles["control-buttons-container"]}>
                <ReplayButton />
                <FastRewindButton seek={seek} changeToPreviousTrack={goToPreviousTrack} />
                <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
                <FastForwardButton changeToNextTrack={goToNextTrack} />
                <ShuffleButton />
            </div>
            <PlayerOptions />
        </div>
    );
}