'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography, Box, CircularProgress } from '@mui/material';
import MusicAlbumContainer from '../MusicAlbumContainer/MusicAlbumContainer';
import { MusicAlbum } from '@/types/MusicAlbum';
import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrackFull } from '@/types/MusicTrack';
import MusicTrackContainer from '../MusicTrack/MusicTrackContainer/MusicTrackContainer';
import MusicArtistContainer from '../MusicArtistCard/MusicArtistContainer';
import styles from "./SearchpageContent.module.css";
import { Cancel } from '@mui/icons-material';
import AlbumIcon from '@mui/icons-material/Album';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';

type Props = {
    queueId: string
}

interface SearchResult {
    music_album: MusicAlbum;
    music_artist: MusicArtist;
    music_track: MusicTrackFull;
    title?: string;
    name?: string;
    type: string;
    id: string;
}

export default function SearchPageContent({ queueId }: Props) {
    const searchParams = useSearchParams();
    const term = searchParams.get('term');

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        async function fetchResults() {
            if (!term) return;
            setLoading(true);
            setHasError(false);
            try {
                const res = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
                if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
                const data = await res.json();

                if (!Array.isArray(data)) {
                    console.warn('Search API did not return an array:', data);
                    setResults([]);
                } else {
                    setResults(data);
                }
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                setHasError(true);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [term]);

    if (!term) {
        return <Typography variant="h5">No search term provided.</Typography>;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    const musicAlbums: MusicAlbum[] = results.filter(item => item.type === 'Music Album').map(item => item.music_album);
    const musicArtists: MusicArtist[] = results.filter(item => item.type === 'Music Artist').map(item => item.music_artist);
    const musicTracks: MusicTrackFull[] = results.filter(item => item.type === 'Music Track').map(item => item.music_track);

    const noResults = results.length === 0;

    return (
        <div className={styles["main-container"]}>
            <h1>Top results for &quot;{term}&quot;</h1>

            {(noResults || hasError) && (
                <div className={styles["no-results-container"]}>
                    <div className={styles["no-results-icon-container"]}>
                        <Cancel sx={{ fontSize: "5rem" }} />
                    </div>
                    <div className={styles["no-results-text"]}>
                        {hasError ? 'An error occurred while fetching results.' : 'No results found.'}
                    </div>
                </div>
            )}

            {musicArtists.length > 0 && (
                <div className={styles["music-artists-container"]}>
                    <div className={styles["title-container"]}>
                        <h2>Artists</h2>
                        <PersonIcon />
                    </div>
                    <MusicArtistContainer musicArtists={musicArtists} />
                </div>
            )}

            {musicTracks.length > 0 && (
                <div className={styles["music-tracks-container"]}>
                    <div className={styles["title-container"]}>
                        <h2>Tracks</h2>
                        <MusicNoteIcon />
                    </div>
                    <MusicTrackContainer musicTracks={musicTracks} queueId={queueId} />
                </div>
            )}

            {musicAlbums.length > 0 && (
                <div className={styles["music-albums-container"]}>
                    <div className={styles["title-container"]}>
                        <h2>Albums</h2>
                        <AlbumIcon />
                    </div>
                    <MusicAlbumContainer musicAlbums={musicAlbums} />
                </div>
            )}
        </div>
    );
}