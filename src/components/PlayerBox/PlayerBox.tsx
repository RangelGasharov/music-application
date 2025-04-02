import PlayerControls from "./PlayerControls/PlayerControls"
import PlayerImage from "./PlayerImage/PlayerImage"
import styles from "./PlayerBox.module.css"

export default function PlayerBox() {
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