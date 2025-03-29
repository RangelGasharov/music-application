import React from 'react'
import Image from 'next/image'
import ForestImage from "@/public/assets/images/forest_image.jpg"
import styles from "./PlayerImage.module.css"

type Props = {}

export default function PlayerImage({ }: Props) {
    return (
        <Image
            src={ForestImage}
            alt='music track cover'
            width={4000}
            height={3000}
            className={styles["image"]}
        />
    )
}