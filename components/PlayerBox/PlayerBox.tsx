import { FastForward, FastRewind } from '@mui/icons-material'
import React from 'react'
import PlayIcon from './PlayIcon'
import ShuffleIcon from './ShuffleIcon'

type Props = {}

export default function PlayerBox({ }: Props) {
    return (
        <div>
            <div></div>
            <div>
                <FastRewind />
                <PlayIcon />
                <FastForward />
                <ShuffleIcon />
            </div>
        </div>
    )
}