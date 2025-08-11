'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import {
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Paper,
    ListItemButton,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import { MusicAlbum } from '@/types/MusicAlbum';
import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrack } from '@/types/MusicTrack';
import styles from './NavigationHeader.module.css';

interface SearchResult {
    music_album?: MusicAlbum;
    music_artist?: MusicArtist;
    music_track?: MusicTrack;
    title?: string;
    name?: string;
    type: string;
    id: string;
}

export default function NavigationHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const hiddenPaths = ['/login'];

    const fetchSearchResults = async (term: string) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
            if (!response.ok) throw new Error('Failed fetching search results');
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search failed', error);
            setSearchResults([]);
        }
    };

    const debouncedSearch = useMemo(() => debounce(fetchSearchResults, 300), []);

    useEffect(() => {
        if (searchTerm.trim() && isFocused) {
            debouncedSearch(searchTerm);
        } else {
            setSearchResults([]);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch, isFocused]);

    useEffect(() => {
        if (pathname !== '/search') {
            setSearchTerm('');
            setSearchResults([]);
            setIsFocused(false);
        }
    }, [pathname]);

    if (hiddenPaths.includes(pathname)) {
        return null;
    }

    const getResultTitle = (item: SearchResult) =>
        item.music_album?.title ||
        item.music_artist?.name ||
        item.music_track?.title ||
        item.title ||
        item.name ||
        'No title';

    const handleItemClick = (item: SearchResult) => {
        const term = getResultTitle(item);
        setIsFocused(false);
        setSearchResults([]);
        setSearchTerm(term);
        router.push(`/search?term=${encodeURIComponent(term)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedTerm = searchTerm.trim();
            if (trimmedTerm) {
                setIsFocused(false);
                setSearchResults([]);
                router.push(`/search?term=${encodeURIComponent(trimmedTerm)}`);
            }
        }
    };

    return (
        <div>
            <AppBar className={styles['app-bar-container']}>
                <Toolbar className={styles['tool-bar-container']}>
                    <NavigationDrawer />
                    <div className={styles['search-elements-container']} style={{ position: 'relative', width: '100%' }}>
                        <div className={styles['text-field-container']}>
                            <TextField
                                className={styles['text-field-search']}
                                variant="outlined"
                                size="small"
                                fullWidth
                                placeholder="Search albums, artists, tracks, playlists..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // small delay so click on results registers
                                onKeyDown={handleKeyDown}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        backgroundColor: 'white',
                                        borderRadius: 1,
                                    },
                                }}
                                autoComplete="off"
                            />
                        </div>

                        {isFocused && searchResults.length > 0 && (
                            <Paper
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                    zIndex: 10,
                                    backgroundColor: 'white',
                                    boxShadow: 3,
                                    borderRadius: 1,
                                    width: '100%',
                                    padding: '8px',
                                }}
                            >
                                <List>
                                    {searchResults.map((result, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton onClick={() => handleItemClick(result)}>
                                                <ListItemText primary={getResultTitle(result)} secondary={result.type || ''} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}

                        {isFocused && searchResults.length === 0 && searchTerm.trim() !== '' && (
                            <Paper
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                    zIndex: 10,
                                    backgroundColor: 'white',
                                    boxShadow: 3,
                                    borderRadius: 1,
                                    width: '100%',
                                    padding: '8px',
                                }}
                            >
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" color="textSecondary">
                                                    No results found
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}