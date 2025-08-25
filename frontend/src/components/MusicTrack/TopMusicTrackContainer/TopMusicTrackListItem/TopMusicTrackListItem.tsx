import { TopStreamedMusicTrack } from '@/types/MusicTrack'
import React from 'react'
import styles from "./TopMusicTrackListItem.module.css";
import Link from 'next/link';
import { formatDuration } from '@/utils/formatDuration';
import MusicTrackMoreButton from '../../MusicTrackContainer/MusicTrackCard/MusicTrackMoreButton/MusicTrackMoreButton';
import Image from 'next/image';
import { MusicAlbumShortDto } from '@/types/MusicAlbum';

type Props = {
    topMusicTrack: TopStreamedMusicTrack;
    position: number;
    queueId: string;
}

export default function TopMusicTrackListItem({ topMusicTrack, position, queueId }: Props) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["position-box"]}>{position}</div>
            <div className={styles["music-track-cover-box"]}>
                <Image
                    src={topMusicTrack.music_track.cover_url}
                    alt={topMusicTrack.music_track.title}
                    width={50}
                    height={50}
                    className={styles["image"]}
                    priority
                />
            </div>
            <div className={styles["title-box"]}>
                <Link href={`/search/track/${topMusicTrack.music_track.id}`}>
                    {topMusicTrack.music_track.title}
                </Link>
            </div>
            <div className={styles["music-album-container"]}>
                {topMusicTrack.music_track.music_albums?.map((musicAlbum: MusicAlbumShortDto, index: number) => (
                    <Link
                        key={musicAlbum.id}
                        href={`/search/album/${musicAlbum.id}`}
                        className={styles["title-box"]}
                        style={{ marginRight: index < (topMusicTrack.music_track.music_albums!.length - 1) ? '2px' : '0' }}
                    >
                        {musicAlbum.title}{index < (topMusicTrack.music_track.music_albums!.length - 1) ? ',' : ''}
                    </Link>
                ))}
            </div>
            <div className={styles["streams-box"]}>{topMusicTrack.total_plays ?? 0}</div>
            <div className={styles["duration-box"]}>{formatDuration(topMusicTrack.music_track.duration)}</div>
            <div><MusicTrackMoreButton queueId={queueId} musicTrack={topMusicTrack.music_track} /></div>
        </div>
    )
}