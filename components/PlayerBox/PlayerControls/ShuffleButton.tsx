"use client"
import React, { useState } from 'react';
import Shuffle from '@mui/icons-material/Shuffle';
import ShuffleOn from '@mui/icons-material/ShuffleOn';
import ButtonClean from '../../Buttons/ButtonClean';

export default function ShuffleButton() {
    const [isOn, setIsOn] = useState(false);
    return (
        <ButtonClean onClick={() => setIsOn(!isOn)}>
            {isOn ? <ShuffleOn /> : <Shuffle />}
        </ButtonClean>
    )
}