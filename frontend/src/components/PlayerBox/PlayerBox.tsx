"use client"
import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"
import PlayerBackgroundImage from "./PlayerBackgroundImage/PlayerBackgroundImage"
import PlayerMusicTrackInfo from "./PlayerMusicTrackInfo/PlayerMusicTrackInfo"
import { usePlayerStore } from "@/store/usePlayerStore"

export default function PlayerBox() {
    const musicTrack = usePlayerStore((state) => state.musicTrack);
    const goToNextTrack = usePlayerStore((state) => state.goToNextTrack);
    const goToPreviousTrack = usePlayerStore((state) => state.goToPreviousTrack);

    if (!musicTrack || !musicTrack.file_path) {
        console.warn("PlayerBox: No valid music track has been loaded!");
        return null;
    }

    return (
        <div className={styles["main-container"]}>
            <PlayerBackgroundImage currentTrack={musicTrack} />
            <PlayerImage currenTrack={musicTrack} />
            <PlayerMusicTrackInfo currentTrack={musicTrack} />
            <PlayerControls currentTrack={musicTrack} changeToPreviousTrack={goToPreviousTrack} changeToNextTrack={goToNextTrack} />
        </div>
    )
}