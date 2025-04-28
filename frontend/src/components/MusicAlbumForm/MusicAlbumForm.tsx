"use client"
import { FormControl, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { textFieldSlotProps } from '@/themes/textFieldSlotProps';
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles';
import SingleImageUploader from '../FileUploaders/SingleImageUploader';
import styles from "./MusicAlbumForm.module.css";
import MusicTrackForm from './MusicTrackForm/MusicTrackForm';

export default function MusicAlbumForm() {
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
                <MusicTrackForm />
            </FormControl>
        </div>
    )
}