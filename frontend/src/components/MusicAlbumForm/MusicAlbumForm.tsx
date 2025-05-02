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

export default function MusicAlbumForm() {
    type MusicTrackPostWithTempId = MusicTrackPost & { tempId: string };
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

    return (
        <div className={styles["main-container"]}>
            <div className={styles["music-album-container"]}>
                <div className={styles["music-album-inputs"]}>
                    <h1>Album</h1>
                    <TextField
                        variant="outlined"
                        label="Title"
                        slotProps={textFieldSlotProps}
                    />
                    <DatePicker
                        label="Release date"
                        enableAccessibleFieldDOMStructure={false}
                        slots={datePickerSlots}
                        slotProps={datePickerSlotProps}
                    />
                </div>
                <div className={styles["music-album-image-uploader"]}>
                    <SingleImageUploader placeHolderText="Insert your album cover here" />
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
        </div>
    )
}