"use client"
import React, { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ButtonClean from '../../Buttons/ButtonClean';
import { Pause } from '@mui/icons-material';

export default function PlayButton() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <ButtonClean onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause /> : <PlayArrowIcon />}

        </ButtonClean>
    )
}