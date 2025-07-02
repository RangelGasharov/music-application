import PlaylistForm from '@/components/PlaylistForm/PlaylistForm'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function PlaylistsPage() {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <h1>Playlists</h1>
            {session &&
                <PlaylistForm session={session} />
            }
        </div>
    )
}