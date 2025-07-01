import { MusicTrackWithPosition } from '@/types/MusicTrack';
import React from 'react';
import MusicTrackPlaylistListItem from './MusicTrackPlaylistListItem/MusicTrackPlaylistListItem';
import styles from "./MusicTrackPlaylistContainer.module.css";
import NumbersIcon from '@mui/icons-material/Numbers';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
    musicTracks: MusicTrackWithPosition[];
    queueId: string;
}

export default function MusicTrackPlaylistContainer({ musicTracks, queueId }: Props) {
    return (
        <div>
            <div className={styles["music-tracks-container-heading-box"]}>
                <div className={styles["music-track-position-box"]}><NumbersIcon /></div>
                <div className={styles["music-track-cover-box"]}><ImageIcon /></div>
                <div className={styles["music-track-title-box"]}><MusicNoteIcon /></div>
                <div className={styles["music-artist-name-box"]}><PeopleIcon /></div>
                <div className={styles["music-track-duration-box"]}><AccessTimeIcon /></div>
            </div>
            <div className={styles["music-tracks-container"]}>
                {musicTracks.map((musicTrack: MusicTrackWithPosition) => {
                    return <MusicTrackPlaylistListItem position={musicTrack.position} musicTrack={musicTrack.track} key={musicTrack.track.id} queueId={queueId} />
                })}
            </div>
        </div>
    )
}