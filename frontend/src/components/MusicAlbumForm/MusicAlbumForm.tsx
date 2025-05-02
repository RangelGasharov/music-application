"use client"
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { textFieldSlotProps } from '@/themes/textFieldSlotProps';
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles';
import SingleImageUploader from '../FileUploaders/SingleImageUploader/SingleImageUploader';
import styles from "./MusicAlbumForm.module.css";
import { useState } from 'react';
import { MusicTrackPost } from '@/types/MusicTrack';
import { buttonSx, errorButtonSx } from '@/themes/buttonStyles';
import MusicTrackForm from '../MusicTrackForm/MusicTrackForm';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export default function MusicAlbumForm() {
    type MusicTrackPostWithTempId = MusicTrackPost & { tempId: string };
    const [musicAlbumTitle, setMusicAlbumTitle] = useState('');
    const [musicAlbumReleaseDate, setMusicAlbumReleaseDate] = useState<string | null>(null);
    const [musicAlbumCoverImage, setMusicAlbumCoverImage] = useState<File | null>(null);
    const [musicTracks, setMusicTracks] = useState<MusicTrackPostWithTempId[]>([]);

    const addMusicTrack = () => {
        const newMusicTrack: MusicTrackPostWithTempId = {
            title: "", release_date: "", is_explicit: false, tempId: uuidv4()
        };
        setMusicTracks([...musicTracks, newMusicTrack]);
    };

    const removeMusicTrack = (tempId: string) => {
        setMusicTracks(prevMusicTracks => {
            const updatedMusicTracks = prevMusicTracks.filter(musicTrack => musicTrack.tempId !== tempId);
            return updatedMusicTracks.map((musicTrack, index) => ({ ...musicTrack, order: index + 1 }));
        });
    };

    const updateMusicTrack = (tempId: string, updatedFields: Partial<MusicTrackPost>) => {
        setMusicTracks(prevMusicTracks =>
            prevMusicTracks.map(musicTrack => musicTrack.tempId === tempId ? { ...musicTrack, ...updatedFields } : musicTrack)
        );
    };

    async function postMusicAlbum(
        musicAlbumTitle: string,
        musicAlbumReleaseDate: string | null,
        musicAlbumCover: File | null,
        musicTracks: MusicTrackPost[]
    ) {
        const formData = new FormData();

        formData.append("Title", musicAlbumTitle);

        if (musicAlbumReleaseDate !== null) {
            formData.append('ReleaseDate', musicAlbumReleaseDate);
        }

        if (musicAlbumCover) {
            formData.append("CoverImage", musicAlbumCover);
        }

        musicTracks.forEach((track, index) => {
            formData.append(`MusicTracks[${index}].Title`, track.title);
            formData.append(`MusicTracks[${index}].ReleaseDate`, track.release_date);
            formData.append(`MusicTracks[${index}].IsExplicit`, String(track.is_explicit));
            formData.append(`MusicTracks[${index}].Order`, String(track.order ?? index + 1));

            if (track.cover_image) {
                formData.append(`MusicTracks[${index}].CoverImage`, track.cover_image);
            }
            if (track.audio_file) {
                formData.append(`MusicTracks[${index}].AudioFile`, track.audio_file);
            }
        });

        try {
            const response = await fetch("/api/music-album", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("An error occured while trying to create the album:", errorText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Album created successfully:", data);
            return data;
        } catch (error) {
            console.error("An error occured while trying to create the album:", error);
            throw error;
        }
    }


    return (
        <div className={styles["main-container"]}>
            <div className={styles["music-album-container"]}>
                <div className={styles["music-album-inputs"]}>
                    <h1>Album</h1>
                    <TextField
                        variant="outlined"
                        label="Title"
                        slotProps={textFieldSlotProps}
                        onChange={(e) => setMusicAlbumTitle(e.target.value)}
                    />
                    <DatePicker
                        label="Release date"
                        enableAccessibleFieldDOMStructure={false}
                        slots={datePickerSlots}
                        slotProps={datePickerSlotProps}
                        value={musicAlbumReleaseDate ? dayjs(musicAlbumReleaseDate) : null}
                        onChange={(newValue) => setMusicAlbumReleaseDate(newValue ? newValue.format('YYYY-MM-DD') : null)}
                    />
                </div>
                <div className={styles["music-album-image-uploader"]}>
                    <SingleImageUploader
                        placeHolderText="Insert your album cover here"
                        onFileSelected={(file) => setMusicAlbumCoverImage(file ?? null)}
                    />
                </div>
            </div>
            <div className={styles["music-tracks-container"]}>
                {musicTracks.map((musicTrack: MusicTrackPostWithTempId, index) => {
                    return (
                        <div key={musicTrack.tempId} className={styles["music-track-container"]}>
                            <MusicTrackForm
                                order={index + 1}
                                musicTrack={musicTrack}
                                onChange={(updatedTrack) => updateMusicTrack(musicTrack.tempId, updatedTrack)}
                            />
                            <Button onClick={() => removeMusicTrack(musicTrack.tempId)} sx={errorButtonSx} > Remove music track</Button>
                        </div>
                    )
                })}
                <Button onClick={addMusicTrack} sx={buttonSx}>Add music track</Button>
            </div>
            <div>
                <Button onClick={() => {
                    postMusicAlbum(musicAlbumTitle, musicAlbumReleaseDate, musicAlbumCoverImage, musicTracks);
                }} sx={buttonSx}>
                    Submit Album
                </Button>
            </div>
        </div>
    )
}