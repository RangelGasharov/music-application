"use client"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import SessionGuard from './SessionGuard'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={4 * 60}>
            <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SessionGuard>
                        {children}
                    </SessionGuard>
                </LocalizationProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}