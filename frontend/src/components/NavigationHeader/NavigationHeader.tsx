'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import { TextField, InputAdornment, List, ListItem, ListItemText, Paper, ListItemButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import { MusicAlbum } from '@/types/MusicAlbum';
import { MusicArtist } from '@/types/MusicArtist';
import { MusicTrack } from '@/types/MusicTrack';

interface SearchResult {
    music_album: MusicAlbum;
    music_artist: MusicArtist;
    music_track: MusicTrack;
    title?: string;
    name?: string;
    type: string;
    id: string;
}

export default function NavigationHeader() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const hiddenPaths = ['/login'];
    if (hiddenPaths.includes(pathname)) {
        return null;
    }

    const fetchSearchResults = async (term: string) => {
        if (!term) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search failed', error);
        }
    };

    const debouncedSearch = React.useMemo(() => debounce(fetchSearchResults, 300), []);

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    useEffect(() => {
        if (pathname !== '/search') {
            setSearchTerm('');
        }
    }, [pathname]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.trim()) {
                router.push(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
            }
        }
    };

    const handleItemClick = (item: SearchResult) => {
        const term = item.title || item.name || 'No title';
        router.push(`/search?term=${encodeURIComponent(term)}`);
    };

    return (
        <Box>
            <AppBar elevation={0} sx={{ position: "static", backgroundColor: "var(--bg-color)", color: "var(--text-color)", boxShadow: "0px 1px 7px var(--text-color)" }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <NavigationDrawer />
                    <Box sx={{ position: 'relative', width: '400px' }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            placeholder="Search albums, artists, tracks, playlists..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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
                                }
                            }}
                        />
                        {isFocused && (
                            <Paper sx={{
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
                            }}>
                                <List>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton onClick={() => handleItemClick(result)}>
                                                    <ListItemText
                                                        primary={
                                                            result.music_album?.title ||
                                                            result.music_artist?.name ||
                                                            result.music_track?.title || 'No title'
                                                        }
                                                        secondary={result.type || ''}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <ListItem disablePadding>
                                            <ListItemText
                                                primary={<Typography variant="body2" color="textSecondary">No results found</Typography>}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </Paper>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}