"use client"
import { Button, FormControl, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { textFieldSlotProps } from '@/themes/textFieldSlotProps';
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles';
import SingleImageUploader from '../FileUploaders/SingleImageUploader/SingleImageUploader';
import styles from "./MusicAlbumForm.module.css";
import { useState } from 'react';
import { MusicTrackPost } from '@/types/MusicTrack';
import { buttonSx } from '@/themes/buttonStyles';
import MusicTrackForm from '../MusicTrackForm/MusicTrackForm';

export default function MusicAlbumForm() {
    const [musicTracks, setMusicTracks] = useState<MusicTrackPost[]>([]);
    const addTrack = () => {
        const newMusicTrack: MusicTrackPost = {
            title: "",
            release_date: "",
            is_explicit: false
        }
        setMusicTracks([...musicTracks, newMusicTrack]);
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
                    />
                    <DatePicker
                        label="Release date"
                        enableAccessibleFieldDOMStructure={false}
                        slots={datePickerSlots}
                        slotProps={datePickerSlotProps}
                    />
                </div>
                <SingleImageUploader placeHolderText="Insert your album cover here" />
            </div>
            <div className={styles["music-track-container"]}>
                {musicTracks.map((musciTrack: MusicTrackPost, index) => {
                    return (
                        <MusicTrackForm key={index} />
                    )
                })}
                <Button onClick={addTrack} sx={buttonSx}>Add track</Button>
            </div>
        </div>
    )
}