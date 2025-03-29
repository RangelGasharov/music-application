import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"

type Props = {}

export default function PlayerBox({ }: Props) {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["image-container"]}>
                <PlayerImage />
            </div>
            <div className={styles["controls-container"]}>
                <PlayerControls />
            </div>
        </div>
    )
}