"use client"
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material'
import React, { useState } from 'react'
import styles from "./MusicTrackForm.module.css"
import { textFieldSlotProps } from '@/themes/textFieldSlotProps'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles'
import SingleImageUploader from '@/components/FileUploaders/SingleImageUploader/SingleImageUploader'
import { checkBoxSx } from '@/themes/checkBoxStyles'
import AudioUploader from '@/components/FileUploaders/AudioUploader/AudioUploader'

export default function MusicTrackForm() {
    const [isExplicit, setIsExplicit] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsExplicit(event.target.checked);
    };

    return (
        <div>
            <FormControl className={styles['music-track-container']}>
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
                <div className={styles["checkbox-container"]}>
                    <div>is explicit?</div>
                    <Checkbox
                        disableRipple
                        checked={isExplicit}
                        onChange={handleChange}
                        sx={checkBoxSx}
                    />
                </div>
                <SingleImageUploader placeHolderText='Insert your track cover here' />
                <AudioUploader />
            </FormControl>
        </div>
    )
}
