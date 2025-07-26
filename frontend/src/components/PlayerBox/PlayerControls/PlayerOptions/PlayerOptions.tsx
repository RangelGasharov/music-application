"use client";

import { VolumeUp } from "@mui/icons-material";
import { usePlayerStore } from "@/store/usePlayerStore";
import styles from "./PlayerOptions.module.css";

export default function PlayerOptions() {
    const volume = usePlayerStore((state) => state.volume);
    const setVolume = usePlayerStore((state) => state.setVolume);
    const audio = usePlayerStore((state) => state.audioRef);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audio) {
            audio.volume = newVolume;
        }
    };

    return (
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
    );
}