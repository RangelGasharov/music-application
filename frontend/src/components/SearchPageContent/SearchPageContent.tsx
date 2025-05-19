'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography, Box, CircularProgress } from '@mui/material';
import MusicAlbumContainer from '../MusicAlbumContainer/MusicAlbumContainer';
import { MusicAlbum } from '@/types/MusicAlbum';
import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrack } from '@/types/MusicTrack';
import MusicTrackContainer from '../MusicTrackContainer/MusicTrackContainer';
import MusicArtistContainer from '../MusicArtistCard/MusicArtistContainer';
import styles from "./SearchpageContent.module.css";
import { Cancel } from '@mui/icons-material';

interface SearchResult {
    music_album: MusicAlbum,
    music_artist: MusicArtist,
    music_track: MusicTrack,
    title?: string;
    name?: string;
    type: string;
    id: string;
}

export default function SearchPageContent() {
    const searchParams = useSearchParams();
    const term = searchParams.get('term');

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            if (!term) return;
            try {
                const res = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
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
    const musicTracks: MusicTrack[] = results.filter(item => item.type === 'Music Track').map(item => item.music_track);

    return (
        <div className={styles["main-container"]}>
            <h1>Search results for &quot;{term}&quot;</h1>

            {results.length === 0 && (
                <div className={styles["no-results-container"]}>
                    <div className={styles["no-results-icon-container"]}>
                        <Cancel sx={{ fontSize: "5rem" }} />
                    </div>
                    <div className={styles["no-results-text"]}>
                        No results found.
                    </div>
                </div>
            )}

            {musicArtists.length > 0 && (
                <div className={styles["music-artists-container"]}>
                    <h2>Artists</h2>
                    <MusicArtistContainer musicArtists={musicArtists} />
                </div>
            )}

            {musicTracks.length > 0 && (
                <div className={styles["music-tracks-container"]}>
                    <h2>Tracks</h2>
                    <MusicTrackContainer musicTracks={musicTracks} />
                </div>
            )}

            {musicAlbums.length > 0 && (
                <div className={styles["music-albums-container"]}>
                    <h2>Albums</h2>
                    <MusicAlbumContainer musicAlbums={musicAlbums} />
                </div>
            )}
        </div>
    );
}