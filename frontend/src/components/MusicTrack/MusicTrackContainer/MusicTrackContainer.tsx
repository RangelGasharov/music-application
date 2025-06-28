import { MusicTrack } from '@/types/MusicTrack';
import React from 'react';
import styles from "./MusicTrackContainer.module.css";
import MusicTrackCard from './MusicTrackCard/MusicTrackCard';

type MusicTrackContainerType = {
    musicTracks: MusicTrack[];
    queueId: string;
}

export default function MusicTrackContainer({ musicTracks, queueId }: MusicTrackContainerType) {
    return (
        <div className={styles["main-container"]}>
            {musicTracks?.map((musicTrack) => {
                return (
                    <MusicTrackCard key={musicTrack.id} musicTrack={musicTrack} queueId={queueId} />
                )
            })}
        </div>
    )
}