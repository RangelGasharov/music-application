"use client"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ButtonClean from '../../Buttons/ButtonClean';
import { Pause } from '@mui/icons-material';

type PlayButtonType = {
    onClick: () => void;
    isPlaying: boolean;
};

export default function PlayButton({ onClick, isPlaying }: PlayButtonType) {
    return (
        <ButtonClean onClick={onClick}>
            {isPlaying ? <Pause /> : <PlayArrowIcon />}
        </ButtonClean>
    );
}