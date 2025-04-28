import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './SingleImageUploader.module.css';

type SingleImageUploaderType = {
    placeHolderText: string;
}

export default function SingleImageUploader({ placeHolderText }: SingleImageUploaderType) {
    const [file, setFile] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setFile(imageUrl);
        }
        e.target.value = '';
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemoveImage = () => {
        if (file) {
            URL.revokeObjectURL(file);
            setFile(null);
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
        <div className={styles['main-container']}>
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={inputRef}
                style={{ display: 'none' }}
            />
            <div className={styles['image-container']} onClick={!file ? handleClick : undefined}>
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