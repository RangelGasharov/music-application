"use client"
import { Checkbox, TextField } from '@mui/material'
import styles from "./MusicTrackForm.module.css"
import { textFieldSlotProps } from '@/themes/textFieldSlotProps'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { datePickerSlotProps, datePickerSlots } from '@/themes/datePickerStyles'
import SingleImageUploader from '@/components/FileUploaders/SingleImageUploader/SingleImageUploader'
import { checkBoxSx } from '@/themes/checkBoxStyles'
import AudioUploader from '@/components/FileUploaders/AudioUploader/AudioUploader'
import { MusicTrackPost } from '@/types/MusicTrack'
import dayjs from 'dayjs'

type MusicTrackFormType = {
    order: number;
    musicTrack: MusicTrackPost;
    onChange: (updatedFields: Partial<MusicTrackPost>) => void;
}

export default function MusicTrackForm({ order, musicTrack, onChange }: MusicTrackFormType) {
    return (
        <div className={styles['main-container']}>
            <h2>Track #{order}</h2>
            <div className={styles['music-track-data-container']}>
                <div className={styles['music-track-inputs']}>
                    <TextField
                        variant='outlined'
                        label='Title'
                        onChange={(e) => onChange({ title: e.target.value })}
                        slotProps={textFieldSlotProps}
                    />
                    <DatePicker
                        label="Release date"
                        enableAccessibleFieldDOMStructure={false}
                        slots={datePickerSlots}
                        value={musicTrack.release_date ? dayjs(musicTrack.release_date) : null}
                        onChange={(newValue) => onChange({ release_date: newValue ? newValue.format('YYYY-MM-DD') : undefined })}
                        slotProps={datePickerSlotProps}
                    />
                    <div className={styles["checkbox-input-container"]}>
                        <div>Is explicit?</div>
                        <div className={styles["checkbox-box"]}>
                            <Checkbox
                                disableRipple
                                checked={musicTrack.is_explicit}
                                onChange={(e) => onChange({ is_explicit: e.target.checked })}
                                sx={checkBoxSx}
                            />
                        </div>
                    </div>
                    <AudioUploader onFileSelected={(file) => onChange({ audio_file: file })} />
                </div>
                <SingleImageUploader placeHolderText='Insert your track cover here' onFileSelected={(file) => onChange({ cover_image: file })} />
            </div>
        </div>
    )
}