import LogoutButton from '@/components/Authentication/LogoutButton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import styles from "./profile-page.module.css";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    return (
        <div className={styles["main-container"]}>
            <h1>Profile</h1>
            <div>{session?.user?.name}</div>
            <div>
                <LogoutButton />
            </div>
        </div>
    )
}