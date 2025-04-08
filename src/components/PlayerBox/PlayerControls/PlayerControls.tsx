"use client"
import React from 'react'
import PlayButton from './PlayButton'
import ShuffleButton from './ShuffleButton'
import FastRewindButton from './FastRewindButton'
import FastForwardButton from './FastForwardButton'
import styles from "./PlayerControls.module.css"
import { useTheme } from 'next-themes'

export default function PlayerControls() {
    const theme = useTheme();
    return (
        <div className={`${styles["main-container"]} ${theme.resolvedTheme === "dark" ? "dark" : "light"}`}>
            <FastRewindButton />
            <PlayButton />
            <FastForwardButton />
            <ShuffleButton />
        </div>
    )
}