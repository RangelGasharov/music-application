import LoginButton from '@/components/Authentication/LoginButton'
import LogoutButton from '@/components/Authentication/LogoutButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    return (
        <div>
            {session ? (<div>You are logged in as: {session.user?.name}   <LogoutButton /></div>) : (<div>  <LoginButton /></div>)}
        </div>
    )
}