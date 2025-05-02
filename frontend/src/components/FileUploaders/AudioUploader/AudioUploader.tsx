"use client";
import React, { useCallback, useRef, useState } from 'react';
import styles from './AudioUploader.module.css';

type AudioUploaderType = {
    onFileSelected?: (file: File | undefined) => void;
};

export default function AudioUploader({ onFileSelected }: AudioUploaderType) {
    const [file, setFile] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dragOverRef = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        handleFile(selectedFile);
        e.target.value = '';
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragOverRef.current = true;
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    const handleFile = useCallback((selectedFile: File | undefined | null) => {
        if (file) {
            URL.revokeObjectURL(file);
            setFile(null);
        }

        if (selectedFile && selectedFile.type.startsWith('audio/')) {
            const audioUrl = URL.createObjectURL(selectedFile);
            setFile(audioUrl);
            if (onFileSelected) {
                onFileSelected(selectedFile);
            }
        } else if (selectedFile) {
            console.error("Invalid audio file type.");
            if (onFileSelected) {
                onFileSelected(undefined);
            }
        } else {
            if (onFileSelected) {
                onFileSelected(undefined);
            }
        }
    }, [onFileSelected, file, setFile]);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragOverRef.current = false;
        const droppedFile = event.dataTransfer.files?.[0];
        handleFile(droppedFile);
    }, [handleFile]);

    const handleRemoveAudio = () => {
        handleFile(null);
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
                <div
                    className={`${styles["upload-box"]} ${dragOverRef.current ? styles["drag-over"] : ''}`}
                    onClick={handleClick}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    Drop your audio file here or click to browse
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