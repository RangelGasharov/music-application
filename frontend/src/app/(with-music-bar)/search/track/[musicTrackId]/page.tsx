import { MusicTrackFull } from '@/types/MusicTrack';
import React from 'react'
import styles from "./music-track-page.module.css"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getDurationInSeconds } from '@/utils/getDurationInSeconds'; import MusicCoverDialog from '@/components/MusicCoverDialog/MusicCoverDialog';
import { MusicGenreShort } from '@/types/MusicGenre';
import { MusicAlbumShortDto } from '@/types/MusicAlbum';

type Params = Promise<{ musicTrackId: string }>

async function getMusicTrackById(musicTrackId: string): Promise<MusicTrackFull> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-track/${musicTrackId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch music track');
        }

        const musicTrack: MusicTrackFull = await res.json();
        return musicTrack;
    } catch (error) {
        console.error('Error fetching music tracl:', error);
        throw error;
    }
}

function getTotalMinutes(musicTrack: MusicTrackFull): number {
    const totalSeconds = getDurationInSeconds(musicTrack.duration);
    return Math.floor(totalSeconds / 60);
}

export default async function MusicTrackPage({ params }: { params: Params }) {
    const { musicTrackId } = await params;
    const musicTrack = await getMusicTrackById(musicTrackId);
    const musicTrackDate: Date = new Date(musicTrack?.release_date);
    const musicTrackDateFormatted: string = new Intl.DateTimeFormat(navigator.language, {
        year: 'numeric', month: 'short', day: 'numeric'
    }).format(musicTrackDate);
    const musicTrackLength = getTotalMinutes(musicTrack);

    return (
        <div className={styles["main-container"]}>
            <h1>{musicTrack.title}</h1>
            <div className={styles["music-album-cover-about-container"]}>
                <MusicCoverDialog coverSource={musicTrack.cover_url} title={musicTrack.title} />
                <div className={styles["music-track-about-container"]}>
                    <div className={styles["music-albums-container"]}>
                        <h3>Music album(s)</h3>
                        <div>
                            {musicTrack.music_albums.map((musicAlbum: MusicAlbumShortDto) => {
                                return <div key={musicAlbum.id}>
                                    {musicAlbum.title}
                                </div>
                            })}
                        </div>
                    </div>
                    <div className={styles["music-genres-container"]}>
                        <h3>Genre(s)</h3>
                        <div>
                            {musicTrack.music_genres.map((musicGenre: MusicGenreShort) => {
                                return <div key={musicGenre.id}>
                                    {musicGenre.name}
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["info-containers-wrapper"]}>
                <div className={styles["info-container"]}>
                    <div className={styles["info-container-title-icon-box"]}>
                        <div className={styles["info-container-icon"]}><CalendarMonthIcon /></div>
                        <div className={styles["info-container-title"]}>Release</div>
                    </div>
                    <div className={styles["info-container-value"]}>
                        {musicTrackDateFormatted}
                    </div>
                </div>
                <div className={styles["info-container"]}>
                    <div className={styles["info-container-title-icon-box"]}>
                        <div className={styles["info-container-icon"]}><AccessTimeIcon /></div>
                        <div className={styles["info-container-title"]}>Length</div>
                    </div>
                    <div className={styles["info-container-value"]}>
                        {musicTrackLength} min.
                    </div>
                </div>
                <div className={styles["info-container"]}>
                    <div className={styles["info-container-title-icon-box"]}>
                        <div className={styles["info-container-icon"]}><PlayArrowIcon /></div>
                        <div className={styles["info-container-title"]}>Streams</div>
                    </div>
                    <div className={styles["info-container-value"]}>
                        {musicTrack.music_track_stat?.total_plays ?? 0}
                    </div>
                </div>
            </div>
        </div>
    )
}