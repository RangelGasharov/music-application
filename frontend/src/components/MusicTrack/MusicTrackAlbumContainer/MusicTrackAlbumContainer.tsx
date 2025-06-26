import { MusicTrack } from '@/types/MusicTrack'
import React from 'react'
import styles from "./MusicTrackAlbumContainer.module.css";
import NumbersIcon from '@mui/icons-material/Numbers';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MusicTrackAlbumListItem from './MusicTrackAlbumListItem/MusicTrackAlbumListItem';

type MusicTrackAlbumContainerType = {
    musicTracks: MusicTrack[]
}

export default function MusicTrackAlbumContainer({ musicTracks }: MusicTrackAlbumContainerType) {
    return (
        <div>
            <div className={styles["music-tracks-container-heading-box"]}>
                <div className={styles["music-track-position-box"]}><NumbersIcon /></div>
                <div className={styles["music-track-title-box"]}><MusicNoteIcon /></div>
                <div className={styles["music-artist-name-box"]}><PeopleIcon /></div>
                <div className={styles["music-track-streams-box"]}><PlayArrowIcon /></div>
                <div className={styles["music-track-duration-box"]}><AccessTimeIcon /></div>
            </div>
            <div className={styles["music-tracks-container"]}>
                {musicTracks.map((musicTrack: MusicTrack, index) => (
                    <MusicTrackAlbumListItem position={index + 1} key={musicTrack.id} musicTrack={musicTrack} />
                ))}
            </div>
        </div>
    )
}