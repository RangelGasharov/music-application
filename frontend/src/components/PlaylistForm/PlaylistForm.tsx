"use client";

import { useState } from "react";
import { Button, TextField, Switch, FormControlLabel } from "@mui/material";
import styles from "./PlaylistForm.module.css";
import { buttonSx } from "@/themes/buttonStyles";
import dayjs from "dayjs";
import MusicTrackSearchSelector from "../SearchPageContent/MusicTrackSearchSelector";
import { v4 as uuidv4 } from "uuid";
import { textFieldSlotProps } from "@/themes/textFieldSlotProps";
import { Session } from "next-auth";

type MusicTrackSelection = {
    id: string;
    title: string;
    tempId: string;
    position: number;
};

type PlaylistFormType = {
    session: Session | null;
}

export default function PlaylistForm({ session }: PlaylistFormType) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [selectedTracks, setSelectedTracks] = useState<MusicTrackSelection[]>([]);

    const addMusicTrackToPlaylist = (musicTrack: { id: string; title: string }) => {
        if (selectedTracks.find(t => t.id === musicTrack.id)) return;

        const newMusicTrack: MusicTrackSelection = {
            ...musicTrack,
            tempId: uuidv4(),
            position: selectedTracks.length + 1
        };

        setSelectedTracks(prev => [...prev, newMusicTrack]);
    };

    const removeMusicTrack = (tempId: string) => {
        const updated = selectedTracks.filter(t => t.tempId !== tempId)
            .map((t, i) => ({ ...t, position: i + 1 }));
        setSelectedTracks(updated);
    };

    const postPlaylist = async () => {
        const formData = new FormData();

        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("IsPublic", String(isPublic));

        const createdAt = dayjs().toISOString();
        formData.append("CreatedAt", createdAt);
        formData.append("UpdatedAt", createdAt);

        selectedTracks.forEach((track, index) => {
            formData.append(`MusicTracks[${index}].TrackId`, track.id);
            formData.append(`MusicTracks[${index}].Position`, track.position.toString());
            formData.append(`MusicTracks[${index}].AddedAt`, createdAt);
        });

        if (!session?.accessToken) {
            throw new Error("No access token available.");
        }

        try {
            const res = await fetch("/api/playlist/with-tracks", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const result = await res.json();
            console.log("Playlist created:", result);
        } catch (err) {
            console.error("Error submitting playlist:", err);
        }
    };

    return (
        <div className={styles["main-container"]}>
            <h1>Create Playlist</h1>

            <TextField
                slotProps={textFieldSlotProps}
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
            />

            <TextField
                slotProps={textFieldSlotProps}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
            />

            <FormControlLabel
                control={
                    <Switch
                        sx={{
                            '& .MuiSwitch-thumb': {
                                backgroundColor: 'var(--text-color)',
                            },
                            '& .MuiSwitch-track': {
                                backgroundColor: 'var(--text-color)',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'var(--text-color)',
                                opacity: .9,
                            },
                        }}
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                }
                label="Public"
            />

            <div className={styles["music-track-search-container"]}>
                <MusicTrackSearchSelector session={session} onTrackSelect={addMusicTrackToPlaylist} />
            </div>

            <div className={styles["music-track-list"]}>
                {selectedTracks.map((musicTrack) => (
                    <div key={musicTrack.tempId} className={styles["music-track-item"]}>
                        #{musicTrack.position} - {musicTrack.title}
                        <Button onClick={() => removeMusicTrack(musicTrack.tempId)}>Remove</Button>
                    </div>
                ))}
            </div>

            <Button sx={buttonSx} onClick={postPlaylist}>
                Submit Playlist
            </Button>
        </div>
    );
}