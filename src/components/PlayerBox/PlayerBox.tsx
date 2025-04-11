"use client"
import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"
import { MusicTrack } from "@/types/MusicTrack"
import { useCallback, useEffect, useState } from "react"

type PlayerBoxType = {
    musicTracks: MusicTrack[]
}

export default function PlayerBox({ musicTracks }: PlayerBoxType) {
    const [availableTracks, setAvailableTracks] = useState<MusicTrack[]>(musicTracks);
    const [currentTrackNumber, setCurrentTrackNumber] = useState<number>(0);
    const [currenTrack, setCurrenTrack] = useState<MusicTrack>(availableTracks[currentTrackNumber]);

    useEffect(() => {
        setCurrenTrack(availableTracks[currentTrackNumber]);
    }, [currentTrackNumber])

    const changeToNextTrack = () => {
        console.log("Next Track");
        if (availableTracks.length - 1 === currentTrackNumber) {
            setCurrentTrackNumber(0);
            return;
        }
        setCurrentTrackNumber(currentTrackNumber + 1);
    };

    const changeToPreviousTrack = () => {
        console.log("Previous Track");
        if (currentTrackNumber === 0) return;
        setCurrentTrackNumber(currentTrackNumber - 1);
    };

    return (
        <div className={styles["main-container"]}>
            <div className={styles["image-container"]}>
                <PlayerImage currenTrack={currenTrack} />
            </div>
            <div className={styles["controls-container"]}>
                <PlayerControls changeToPreviousTrack={changeToPreviousTrack} changeToNextTrack={changeToNextTrack} />
            </div>
        </div>
    )
}