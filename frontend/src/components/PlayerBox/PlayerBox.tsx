"use client"
import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"
import { MusicTrack } from "@/types/MusicTrack"
import { useEffect, useState } from "react"
import PlayerBackgroundImage from "./PlayerBackgroundImage/PlayerBackgroundImage"
import PlayerMusicTrackInfo from "./PlayerMusicTrackInfo/PlayerMusicTrackInfo"

type PlayerBoxType = {
    musicTracks: MusicTrack[]
}

export default function PlayerBox({ musicTracks }: PlayerBoxType) {
    const [availableTracks] = useState<MusicTrack[]>(musicTracks);
    const [currentTrackNumber, setCurrentTrackNumber] = useState<number>(0);
    const [currentTrack, setCurrenTrack] = useState<MusicTrack>(availableTracks[currentTrackNumber]);

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
            <PlayerBackgroundImage currentTrack={currentTrack} />
            <PlayerImage currenTrack={currentTrack} />
            <PlayerMusicTrackInfo currentTrack={currentTrack} />
            <PlayerControls currentTrack={currentTrack} changeToPreviousTrack={changeToPreviousTrack} changeToNextTrack={changeToNextTrack} />
        </div>
    )
}