import React from 'react';
import FastRewind from '@mui/icons-material/FastRewind';
import ButtonClean from '../../Buttons/ButtonClean';
import { usePlayerStore } from "@/store/usePlayerStore";

type FastRewindButton = {
    seek: (time: number) => void;
    changeToPreviousTrack: () => void;
}

export default function FastRewindButton({ seek, changeToPreviousTrack }: FastRewindButton) {
    const currentTime = usePlayerStore((s) => s.currentTime);

    const handleClick = () => {
        if (currentTime >= 3) {
            seek(0);
        } else {
            changeToPreviousTrack();
        }
    };

    return (
        <ButtonClean onClick={handleClick}>
            <FastRewind />
        </ButtonClean>
    )
}