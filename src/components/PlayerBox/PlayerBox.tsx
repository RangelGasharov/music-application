"use client"
import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"
import { MusicTrack } from "@/types/MusicTrack"
import { useEffect, useState } from "react"
import PlayerBackgroundImage from "./PlayerBackgroundImage/PlayerBackgroundImage"

type PlayerBoxType = {
    musicTracks: MusicTrack[]
}

export default function PlayerBox({ musicTracks }: PlayerBoxType) {
    const [availableTracks] = useState<MusicTrack[]>(musicTracks);
    const [currentTrackNumber, setCurrentTrackNumber] = useState<number>(0);
    const [currenTrack, setCurrenTrack] = useState<MusicTrack>(availableTracks[currentTrackNumber]);

    useEffect(() => {
        setCurrenTrack(availableTracks[currentTrackNumber]);
    }, [currentTrackNumber])

    const changeToNextTrack = () => {
        if (availableTracks.length - 1 === currentTrackNumber) {
            setCurrentTrackNumber(0);
            return;
        }
        setCurrentTrackNumber(currentTrackNumber + 1);
    };

    const changeToPreviousTrack = () => {
        if (currentTrackNumber === 0) return;
        setCurrentTrackNumber(currentTrackNumber - 1);
    };

    return (
        <div className={styles["main-container"]}>
            <PlayerBackgroundImage currentTrack={currenTrack} />
            <div className={styles["image-container"]}>
                <PlayerImage currenTrack={currenTrack} />
            </div>
            <div className={styles["controls-container"]}>
                <PlayerControls changeToPreviousTrack={changeToPreviousTrack} changeToNextTrack={changeToNextTrack} />
            </div>
        </div>
    )
}