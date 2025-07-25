import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import React from 'react';
import styles from "./settings-page.module.css";

export default function SettingsPage() {
    return (
        <div className={styles["main-container"]}>
            <h1>Settings</h1>
            <div className={styles["dark-mode-container"]}>
                <div className={styles["dark-mode-text"]}>Dark/Light mode</div>
                <ThemeToggle />
            </div>
        </div>
    )
}