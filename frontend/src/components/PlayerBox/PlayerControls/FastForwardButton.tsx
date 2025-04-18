import React from 'react';
import FastForward from '@mui/icons-material/FastForward';
import ButtonClean from '../../Buttons/ButtonClean';

type FastForwardButton = {
    changeToNextTrack: React.MouseEventHandler<HTMLButtonElement>
}

export default function FastForwardButton({ changeToNextTrack }: FastForwardButton) {
    return (
        <ButtonClean onClick={changeToNextTrack}>
            <FastForward />
        </ButtonClean>
    )
}