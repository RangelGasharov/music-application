import { MusicTrack, MusicTrackFull, MusicTrackWithPosition } from '@/types/MusicTrack';
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
import MusicTrackAlbumContainer from '@/components/MusicTrack/MusicTrackAlbumContainer/MusicTrackAlbumContainer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Queue } from '@/types/Queue';
import { StreamCountPerDay } from '@/types/MusicStream';
import StreamsChart from '@/components/MusicAlbumStreamsChart/MusicAlbumStreamsChart';

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

async function getMusicTracksByAlbumId(musicAlbumId: string): Promise<MusicTrackWithPosition[]> {
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/music-track/music-album/${musicAlbumId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch Music Tracks');
        }

        const musicTracks: MusicTrackWithPosition[] = await res.json();
        return musicTracks;
    } catch (error) {
        console.error('Error fetching music tracks:', error);
        throw error;
    }
}

async function getQueueByUserId(userId: string | undefined): Promise<Queue> {
    if (!userId) {
        throw new Error('No user id was provided!');
    }
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/queue/user-id/${userId}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error('Failed to fetch queue');
        }
        const queue: Queue = await res.json();
        return queue;
    } catch (error) {
        console.error("An error has occured while trying to fetch the queue: ", error);
        throw error;
    }
}

export async function getMusicAlbumStreamCounts(id: string, startDate?: Date, endDate?: Date): Promise<StreamCountPerDay[]> {
    try {
        const now = new Date();
        const defaultEnd = endDate ? endDate : now;
        const defaultStart = startDate
            ? startDate
            : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const startIso = defaultStart.toISOString();
        const endIso = defaultEnd.toISOString();

        const res = await fetch(
            `${process.env.WEB_API_URL}/music-stream/stream-count/music-album/${id}?startDate=${startIso}&endDate=${endIso}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch album stream counts: ${res.statusText}`);
        }

        const data: StreamCountPerDay[] = await res.json();
        return data;
    } catch (error) {
        console.error(
            "An error occurred while fetching music album stream counts:",
            error
        );
        throw error;
    }
}

export default async function MusicAlbumPage({ params }: { params: Params }) {
    const { musicAlbumId } = await params;
    try {
        const [musicAlbum, musicTracks] = await Promise.all([
            getMusicAlbumById(musicAlbumId),
            (await getMusicTracksByAlbumId(musicAlbumId)).map(musicTrackWithPosition => musicTrackWithPosition.track)
        ]);

        const musicAlbumStreamCounts: StreamCountPerDay[] = await getMusicAlbumStreamCounts(musicAlbum.id);

        const musicAlbumDate: Date = new Date(musicAlbum?.release_date);
        const musicAlbumDateFormatted: string = new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric', month: 'short', day: 'numeric'
        }).format(musicAlbumDate);

        const totalStreams: number = musicTracks.reduce((acc, currentMusicTrack: MusicTrackFull) => acc + (currentMusicTrack.music_track_stat?.total_plays ?? 0),
            0);

        function getTotalTimeAsString(musicTracks: MusicTrack[]): string {
            let totalTimeString = "";
            let totalSeconds = musicTracks
                .map(musicTrack => getDurationInSeconds(musicTrack.duration))
                .reduce((sum, seconds) => sum + seconds, 0);
            const hours = Math.floor(totalSeconds / 3600);
            if (hours > 0) {
                totalTimeString += `${hours} h.`
                totalSeconds -= hours * 3600
            }

            const minutes = Math.floor(totalSeconds / 60);
            if (minutes > 0) {
                if (hours > 0) {
                    totalTimeString += " "
                }
                totalTimeString += `${minutes} min.`
                totalSeconds -= minutes * 60
            }

            if (hours < 1) {
                const seconds = Math.floor(totalSeconds);
                if (totalSeconds > 0) {
                    if (minutes > 0) {
                        totalTimeString += " "
                    }
                    totalTimeString += `${seconds} sec.`
                }
            }

            return totalTimeString;
        }

        const totalAlbumLength = getTotalTimeAsString(musicTracks);
        const session = await getServerSession(authOptions);
        const userId = session?.userId;
        const queue: Queue = await getQueueByUserId(userId);
        const queueId = queue.id;

        return (
            <div className={styles["main-container"]}>
                <div className={styles["music-album-information-container"]}>
                    <div className={styles["music-album-description-cover-container"]}>
                        <div className={styles["music-album-description-container"]}>
                            <div className={styles["music-album-title-container"]}>
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
                        </div>
                        <div>
                            <MusicAlbumCoverDialog coverSource={musicAlbum.cover_url} title={musicAlbum.title} />
                        </div>
                    </div>
                    <div className={styles["info-container"]}>
                        <div className={styles["info-box"]}>
                            <div className={styles["info-box-title-icon-box"]}>
                                <div className={styles["info-box-icon"]}><CalendarMonthIcon /></div>
                                <div className={styles["info-box-title"]}>Release</div>
                            </div>
                            <div className={styles["info-box-value"]}>
                                {musicAlbumDateFormatted}
                            </div>
                        </div>
                        <div className={styles["info-box"]}>
                            <div className={styles["info-box-title-icon-box"]}>
                                <div className={styles["info-box-icon"]}><AccessTimeIcon /></div>
                                <div className={styles["info-box-title"]}>Length</div>
                            </div>
                            <div className={styles["info-box-value"]}>
                                {totalAlbumLength}
                            </div>
                        </div>
                        <div className={styles["info-box"]}>
                            <div className={styles["info-box-title-icon-box"]}>
                                <div className={styles["info-box-icon"]}><MusicNoteIcon /></div>
                                <div className={styles["info-box-title"]}>Tracks</div>
                            </div>
                            <div className={styles["info-box-value"]}>
                                {musicTracks.length}
                            </div>
                        </div>
                        <div className={styles["info-box"]}>
                            <div className={styles["info-box-title-icon-box"]}>
                                <div className={styles["info-box-icon"]}><PlayArrowIcon /></div>
                                <div className={styles["info-box-title"]}>Streams</div>
                            </div>
                            <div className={styles["info-box-value"]}>
                                {totalStreams}
                            </div>
                        </div>
                    </div>
                </div>

                {musicTracks.length === 0 ? (<p>No tracks found for this album.</p>) : (
                    <div>
                        <h2 className={styles["music-tracks-title"]}>Tracks</h2>
                        <MusicTrackAlbumContainer musicTracks={musicTracks} queueId={queueId} />
                    </div>
                )}

                {musicAlbumStreamCounts.length === 0 ? (<p>No streams found</p>) : (
                    <div>
                        <h2>Streams</h2>
                        <StreamsChart data={musicAlbumStreamCounts} title="Album streams per day" />
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error(`An error has occurred: ${error}`);
        notFound();
    }
}