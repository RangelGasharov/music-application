import MusicTrackFooter from "@/components/MusicTrackFooter/MusicTrackFooter";
import styles from "./layout.module.css";

export default function RootMusicBarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
            <div className={styles["footer-container"]}>
                <MusicTrackFooter />
            </div>
        </div>
    );
}