"use client"
import React from 'react'
import PlayIcon from './PlayIcon'
import ShuffleIcon from './ShuffleIcon'
import FastRewindIcon from './FastRewind'
import FastForwardIcon from './FastForwardIcon'
import styles from "./PlayerControls.module.css"

type Props = {}

export default function PlayerControls({ }: Props) {
    return (
        <div className={styles["main-container"]}>
            <FastRewindIcon />
            <PlayIcon />
            <FastForwardIcon />
            <ShuffleIcon />
        </div>
    )
}