import React from 'react';
import FastRewind from '@mui/icons-material/FastRewind';
import ButtonClean from '../../Buttons/ButtonClean';

type FastRewindButton = {
    changeToPreviousTrack: React.MouseEventHandler<HTMLButtonElement>
}

export default function FastRewindButton({ changeToPreviousTrack }: FastRewindButton) {
    return (
        <ButtonClean onClick={changeToPreviousTrack}>
            <FastRewind />
        </ButtonClean>
    )
}