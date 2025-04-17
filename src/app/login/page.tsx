import LoginButton from '@/components/Authentication/LoginButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }
    return (
        <div>
            <LoginButton />
        </div>
    )
}