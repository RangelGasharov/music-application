"use client";

import { useEffect, useState } from "react";
import { TextField, CircularProgress, Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";
import { MusicTrack } from "@/types/MusicTrack";
import { textFieldSlotProps } from "@/themes/textFieldSlotProps";
import { Session } from "next-auth";

type MusicTrackSearchSelectorType = {
    onTrackSelect: (track: { id: string; title: string }) => void;
    disabledTrackIds?: string[];
    session: Session | null;
};

export default function MusicTrackSearchSelector({ onTrackSelect, disabledTrackIds = [], session }: MusicTrackSearchSelectorType) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<MusicTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const token = session?.accessToken;


    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        const fetchMusicTracks = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error();

                const data = await res.json();
                const musicTracks: MusicTrack[] = data
                    .filter((item: any) => item.type === "Music Track")
                    .map((item: any) => item.music_track);

                setResults(musicTracks);
            } catch (e) {
                setError(true);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchMusicTracks();
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <Box>
            <TextField
                slotProps={textFieldSlotProps}
                fullWidth
                label="Search for a track"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
            />

            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" mt={2}>
                    Failed to fetch music tracks.
                </Typography>
            )}

            {!loading && results.length > 0 && (
                <List dense>
                    {results.map((musicTrack: MusicTrack) => (
                        <ListItemButton
                            key={musicTrack.id}
                            onClick={() => onTrackSelect({ id: musicTrack.id, title: musicTrack.title })}
                            disabled={disabledTrackIds.includes(musicTrack.id)}
                        >
                            <ListItemText primary={musicTrack.title} />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
}