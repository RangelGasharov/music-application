"use client";
import React, { useRef, useState } from 'react';
import styles from './AudioUploader.module.css';

export default function AudioUploader() {
    const [file, setFile] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const audioUrl = URL.createObjectURL(selectedFile);
            setFile(audioUrl);
        }
        e.target.value = '';
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemoveAudio = () => {
        if (file) {
            URL.revokeObjectURL(file);
            setFile(null);
        }
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={styles["main-container"]}>
            <input
                type="file"
                accept="audio/*"
                onChange={handleChange}
                ref={inputRef}
                style={{ display: 'none' }}
            />

            {!file ? (
                <div className={styles["upload-box"]} onClick={handleClick}>
                    Insert your audio here
                </div>
            ) : (
                <div className={styles["audio-box"]}>
                    <audio controls className={styles["audio-player"]}>
                        <source src={file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <button className={styles["close-button"]} onClick={handleRemoveAudio}>×</button>
                </div>
            )}
        </div>
    );
}
