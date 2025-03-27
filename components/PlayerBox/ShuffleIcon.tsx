"use client"
import React, { useState } from 'react';
import Shuffle from '@mui/icons-material/Shuffle';
import ShuffleOn from '@mui/icons-material/ShuffleOn';

type Props = {}

export default function ShuffleIcon({ }: Props) {
    const [isOn, setIsOn] = useState(false);
    return (
        <button onClick={() => setIsOn(!isOn)}>
            {isOn ? <ShuffleOn /> : <Shuffle />}
        </button>
    )
}