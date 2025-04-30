"use client"
import { Button, FormControl, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { textFieldSlotProps } from '@/themes/textFieldSlotProps';
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles';
import SingleImageUploader from '../FileUploaders/SingleImageUploader/SingleImageUploader';
import styles from "./MusicAlbumForm.module.css";
import { useState } from 'react';
import { MusicTrack, MusicTrackPost } from '@/types/MusicTrack';
import ButtonClean from '../Buttons/ButtonClean';

export default function MusicAlbumForm() {
    const [musicTracks, setMusicTracks] = useState<MusicTrackPost[]>([]);
    return (
        <div>
            <FormControl className={styles['music-album-container']}>
                <TextField
                    variant='outlined'
                    label='Title'
                    slotProps={textFieldSlotProps}
                />
                <DatePicker
                    label="Release date"
                    enableAccessibleFieldDOMStructure={false}
                    slots={datePickerSlots}
                    slotProps={datePickerSlotProps}
                />
                <SingleImageUploader placeHolderText='Insert your album cover here' />
                <Button onClick={() => { }}>Add</Button>
            </FormControl>
        </div>
    )
}