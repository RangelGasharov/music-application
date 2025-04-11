"use client"
import React from 'react'
import PlayButton from './PlayButton'
import ShuffleButton from './ShuffleButton'
import FastRewindButton from './FastRewindButton'
import FastForwardButton from './FastForwardButton'
import styles from "./PlayerControls.module.css"
import ReplayButton from './ReplayButton'

type PlayerControls = {
    changeToNextTrack: React.MouseEventHandler<HTMLButtonElement>,
    changeToPreviousTrack: React.MouseEventHandler<HTMLButtonElement>
}

export default function PlayerControls({ changeToNextTrack, changeToPreviousTrack }: PlayerControls) {
    return (
        <div className={styles["main-container"]}>
            <ReplayButton />
            <FastRewindButton changeToPreviousTrack={changeToPreviousTrack} />
            <PlayButton />
            <FastForwardButton changeToNextTrack={changeToNextTrack} />
            <ShuffleButton />
        </div>
    )
}