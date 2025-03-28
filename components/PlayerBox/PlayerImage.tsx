import React from 'react'
import Image from 'next/image'
import ForestImage from "../../public/assets/images/forest_image.jpg"
import styles from "./PlayerImage.module.css"

type Props = {}

export default function PlayerImage({ }: Props) {
    return (
        <div className={styles["main-container"]}>
            <Image alt='Forest' src={ForestImage} width={150} />
        </div>
    )
}