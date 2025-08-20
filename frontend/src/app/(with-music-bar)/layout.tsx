import MusicTrackFooter from "@/components/MusicTrackFooter/MusicTrackFooter";
import styles from "./layout.module.css";

export default async function RootMusicBarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles["main-container"]}>
            {children}
            <div className={styles["footer-container"]}>
                <MusicTrackFooter />
            </div>
        </div>
    );
}
