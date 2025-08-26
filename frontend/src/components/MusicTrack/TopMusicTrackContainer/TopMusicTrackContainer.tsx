import { TopStreamedMusicTrack } from '@/types/MusicTrack'
import React from 'react'
import TopMusicTrackListItem from './TopMusicTrackListItem/TopMusicTrackListItem';
import styles from "./TopMusicTrackContainer.module.css";
import NumbersIcon from '@mui/icons-material/Numbers';
import AlbumIcon from '@mui/icons-material/Album';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
    topMusicTracks: TopStreamedMusicTrack[];
    queueId: string;
}

export default function TopMusicTrackContainer({ topMusicTracks, queueId }: Props) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["music-tracks-container-heading-box"]}>
                <div className={styles["music-track-position-box"]}><NumbersIcon /></div>
                <div className={styles["music-track-cover-box"]}><ImageIcon /></div>
                <div className={styles["music-track-title-box"]}><MusicNoteIcon /></div>
                <div className={styles["music-album-title-box"]}><AlbumIcon /></div>
                <div className={styles["music-track-streams-box"]}><PlayArrowIcon /></div>
                <div className={styles["music-track-duration-box"]}><AccessTimeIcon /></div>
            </div>
            <div className={styles["music-tracks-container"]}>
                {topMusicTracks.map((topMusicTrack: TopStreamedMusicTrack, index: number) => {
                    return (<TopMusicTrackListItem key={topMusicTrack.music_track.id} position={index + 1} topMusicTrack={topMusicTrack} queueId={queueId} />)
                })}
            </div>
        </div>
    )
}