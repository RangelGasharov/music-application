import LoginButton from '@/components/Authentication/LoginButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import styles from "./login-page.module.css"
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { MusicNote } from '@mui/icons-material'

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }
    return (
        <div className={styles["main-container"]}>
            <div className={styles["login-page-header"]}>
                <div className={styles["logo-container"]}>
                    <div>music application</div>
                    <MusicNote />
                </div>
                <ThemeToggle />
            </div>
            <h1 className={styles["page-title"]}>Welcome to music application!</h1>
            <div className={styles["authentication-options-container"]}>
                <div className={styles["login-container"]}>
                    <h2>Already have an account?</h2>
                    <div>Log in to your existing account</div>
                    <LoginButton />
                </div>
                <div className={styles["signup-container"]}>
                    <h2>Need a new account?</h2>
                    <div>Sign up by providing some information</div>
                    <LoginButton />
                </div>
            </div>
        </div>
    )
}