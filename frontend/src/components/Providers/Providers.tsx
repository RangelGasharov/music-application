"use client"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import SessionGuard from './SessionGuard'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={4 * 60}>
            <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
                <SessionGuard>
                    {children}
                </SessionGuard>
            </ThemeProvider>
        </SessionProvider>
    )
}