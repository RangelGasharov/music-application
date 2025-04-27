import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from "./SingleImageUploader.module.css";
import { TextField } from '@mui/material';
import { textFieldSlotProps } from '@/themes/textFieldSlotProps';

const SingleImageUploader: React.FC = () => {
    const [file, setFile] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setFile(imageUrl);
        }
    };

    useEffect(() => {
        return () => {
            if (file) {
                URL.revokeObjectURL(file);
            }
        };
    }, [file]);

    return (
        <div className={styles["main-container"]}>
            <TextField
                type="file"
                inputProps={{ accept: 'image/*' }}
                slotProps={textFieldSlotProps}
                onChange={handleChange} />
            {file && (
                <div className={styles["image-container"]}>
                    <div className={styles["image-wrapper"]}>
                        <Image
                            src={file}
                            alt="Bildvorschau"
                            fill
                            className={styles["image"]}
                            sizes="(max-width: 300px) 100vw, 300px"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleImageUploader;
