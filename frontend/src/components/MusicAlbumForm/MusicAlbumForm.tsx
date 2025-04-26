"use client"
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from "./MusicAlbumForm.module.css";
import { textFieldSlotProps } from '@/themes/textFieldSlotProps';
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles';

export default function MusicAlbumForm() {
    return (
        <div>
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
        </div>
    )
}