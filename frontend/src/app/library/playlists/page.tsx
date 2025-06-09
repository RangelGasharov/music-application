import PlaylistForm from '@/components/PlaylistForm/PlaylistForm'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

type Props = {}

export default async function PlaylistsPage({ }: Props) {
    const session = await getServerSession(authOptions);
    console.log(session?.accessToken);

    return (
        <div>
            <h1>Playlists</h1>
            {session &&
                <PlaylistForm session={session} />
            }
        </div>
    )
}