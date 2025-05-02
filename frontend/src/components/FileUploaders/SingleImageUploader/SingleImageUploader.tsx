"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './SingleImageUploader.module.css';

type SingleImageUploaderType = {
    placeHolderText: string;
    onFileSelected?: (file: File | undefined) => void;
}

export default function SingleImageUploader({ placeHolderText, onFileSelected }: SingleImageUploaderType) {
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

        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setFile(imageUrl);
            if (onFileSelected) {
                onFileSelected(selectedFile);
            }
        } else if (selectedFile) {
            console.error("Invalid image file type.");
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

    const handleRemoveImage = () => {
        handleFile(null);
    };

    useEffect(() => {
        return () => {
            if (file) {
                URL.revokeObjectURL(file);
            }
        };
    }, [file]);

    return (
        <div className={styles['main-container']}>
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={inputRef}
                style={{ display: 'none' }}
            />
            <div
                className={`${styles['image-container']} ${dragOverRef.current ? styles['drag-over'] : ''}`}
                onClick={!file ? handleClick : undefined}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {file ? (
                    <>
                        <div className={styles['image-wrapper']}>
                            <Image
                                src={file}
                                alt="Preview"
                                fill
                                className={styles['image']}
                            />
                        </div>
                        <button className={styles['close-button']} onClick={handleRemoveImage}>
                            <p>&#x2716;</p>
                        </button>
                    </>
                ) : (
                    <span className={styles['placeholder-text']}>{placeHolderText}</span>
                )}
            </div>
        </div>
    );
};