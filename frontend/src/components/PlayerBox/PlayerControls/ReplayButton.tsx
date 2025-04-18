"use client"
import React, { useState } from 'react'
import ReplayIcon from '@mui/icons-material/Replay';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import ButtonClean from '@/components/Buttons/ButtonClean';

export default function ReplayButton() {
    const [isOn, setIsOn] = useState(false);
    return (
        <ButtonClean onClick={() => setIsOn(!isOn)}>
            {isOn ? <ReplayCircleFilledIcon /> : <ReplayIcon />}
        </ButtonClean>
    )
}