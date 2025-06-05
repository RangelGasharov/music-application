"use client"
import { MusicAlbum } from '@/types/MusicAlbum'
import { Dialog } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import styles from "./MusicCoverDialog.module.css"

type MusicCoverDialogType = {
    coverSource: string;
    title: string;
}

export default function MusicCoverDialog({ coverSource, title }: MusicCoverDialogType) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Image
                src={coverSource}
                alt={title}
                width={300}
                height={300}
                priority
                onClick={handleClickOpen}
                className={styles["image-cover"]}
            />
            <Dialog open={open} onClose={handleClose}>
                <div className={styles["image-wrapper"]}>
                    <Image
                        src={coverSource}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 40vw"
                        priority
                        className={styles["dialog-image"]}
                    />
                </div>
            </Dialog>
        </div>
    )
}