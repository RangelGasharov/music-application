import MusicTrackListItem from '@/components/MusicTrack/MusicTrackListItem/MusicTrackListItem';
import { MusicTrack } from '@/types/MusicTrack';
import { notFound } from 'next/navigation';
import styles from "./music-album-page.module.css";
import { MusicAlbum } from '@/types/MusicAlbum';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getDurationInSeconds } from '@/utils/getDurationInSeconds';
import { MusicArtistShort } from '@/types/MusicArtist';
import Link from 'next/link';
import MusicAlbumCoverDialog from '@/components/MusicCoverDialog/MusicCoverDialog';
import NumbersIcon from '@mui/icons-material/Numbers';
import ImageIcon from '@mui/icons-material/Image';
import PeopleIcon from '@mui/icons-material/People';

type Params = Promise<{ musicAlbumId: string }>

async function getMusicAlbumById(musicAlbumId: string): Promise<MusicAlbum> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-album/${musicAlbumId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Album');
        }

        const musicAlbum: MusicAlbum = await res.json();
        return musicAlbum;
    } catch (error) {
        console.error('Error fetching music album:', error);
        throw error;
    }
}

async function getMusicTracksByAlbumId(musicAlbumId: string): Promise<MusicTrack[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-track/music-album/${musicAlbumId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Tracks');
        }

        const musicTracks: MusicTrack[] = await res.json();
        return musicTracks;
    } catch (error) {
        console.error('Error fetching music tracks:', error);
        throw error;
    }
}

export default async function MusicAlbumPage({ params }: { params: Params }) {
    const { musicAlbumId } = await params;
    try {
        const [musicAlbum, musicTracks] = await Promise.all([
            getMusicAlbumById(musicAlbumId),
            getMusicTracksByAlbumId(musicAlbumId)
        ]);

        const musicAlbumDate: Date = new Date(musicAlbum?.release_date);
        const musicAlbumDateFormatted: string = new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric', month: 'short', day: 'numeric'
        }).format(musicAlbumDate);

        const totalStreams: number = musicTracks.reduce((acc/*, currentMusicTrack: MusicTrack*/) => acc, 0);

        function getTotalMinutes(musicTracks: MusicTrack[]): number {
            const totalSeconds = musicTracks
                .map(musicTrack => getDurationInSeconds(musicTrack.duration))
                .reduce((sum, seconds) => sum + seconds, 0);
            return Math.floor(totalSeconds / 60);
        }

        const totalAlbumLength = getTotalMinutes(musicTracks);

        return (
            <div className={styles["main-container"]}>
                <div className={styles['music-album-information-container']}>
                    <div className={styles['music-album-title-description-container']}>
                        <div className={styles['music-album-title-container']}>
                            <h1>{musicAlbum.title}</h1>
                            <div className={styles["music-album-artists"]}>
                                {musicAlbum.music_artists.map((musicArtist: MusicArtistShort) => {
                                    return <Link href={`/search/artist/${musicArtist.id}`} className={styles["music-artist-name"]} key={musicArtist.id}>{musicArtist.name}</Link>
                                })}
                            </div>
                        </div>
                        <div>
                            {musicAlbum?.description}
                        </div>
                        <div className={styles["info-containers-wrapper"]}>
                            <div className={styles["info-container"]}>
                                <div className={styles["info-container-title-icon-box"]}>
                                    <div className={styles["info-container-icon"]}><CalendarMonthIcon /></div>
                                    <div className={styles["info-container-title"]}>Release</div>
                                </div>
                                <div className={styles["info-container-value"]}>
                                    {musicAlbumDateFormatted}
                                </div>
                            </div>
                            <div className={styles["info-container"]}>
                                <div className={styles["info-container-title-icon-box"]}>
                                    <div className={styles["info-container-icon"]}><AccessTimeIcon /></div>
                                    <div className={styles["info-container-title"]}>Length</div>
                                </div>
                                <div className={styles["info-container-value"]}>
                                    {totalAlbumLength} min.
                                </div>
                            </div>
                            <div className={styles["info-container"]}>
                                <div className={styles["info-container-title-icon-box"]}>
                                    <div className={styles["info-container-icon"]}><MusicNoteIcon /></div>
                                    <div className={styles["info-container-title"]}>Tracks</div>
                                </div>
                                <div className={styles["info-container-value"]}>
                                    {musicTracks.length}
                                </div>
                            </div>
                            <div className={styles["info-container"]}>
                                <div className={styles["info-container-title-icon-box"]}>
                                    <div className={styles["info-container-icon"]}><PlayArrowIcon /></div>
                                    <div className={styles["info-container-title"]}>Streams</div>
                                </div>
                                <div className={styles["info-container-value"]}>
                                    {totalStreams}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <MusicAlbumCoverDialog coverSource={musicAlbum.cover_url} title={musicAlbum.title} />
                    </div>
                </div>

                {musicTracks.length === 0 ? (<p>No tracks found for this album.</p>) : (
                    <div>
                        <h2 className={styles["music-tracks-title"]}>Tracks</h2>
                        <div className={styles["music-tracks-container-heading-box"]}>
                            <div className={styles["music-track-position-box"]}><NumbersIcon /></div>
                            <div className={styles["music-track-cover-box"]}><ImageIcon /></div>
                            <div className={styles["music-track-title-box"]}><MusicNoteIcon /></div>
                            <div className={styles["music-artist-name-box"]}><PeopleIcon /></div>
                            <div className={styles["music-track-streams-box"]}><PlayArrowIcon /></div>
                            <div className={styles["music-track-duration-box"]}><AccessTimeIcon /></div>
                        </div>
                        <div className={styles["music-tracks-container"]}>
                            {musicTracks.map((musicTrack: MusicTrack, index) => (
                                <MusicTrackListItem position={index + 1} key={musicTrack.id} musicTrack={musicTrack} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.log(`An error has occurred: ${error}`);
        notFound();
    }
}