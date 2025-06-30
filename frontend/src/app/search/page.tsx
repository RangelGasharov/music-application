import { Suspense } from 'react';
import SearchPageContent from '@/components/SearchPageContent/SearchPageContent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Queue } from '@/types/Queue';

async function getQueueByUserId(userId: string | undefined): Promise<Queue> {
    if (!userId) {
        throw new Error('No user id was provided!');
    }
    try {
        const res = await fetch(`${process.env.WEB_API_URL}/queue/user-id/${userId}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error('Failed to fetch queue');
        }
        const queue: Queue = await res.json();
        return queue;
    } catch (error) {
        console.error("An error has occured while trying to fetch the queue: ", error);
        throw error;
    }
}

export default async function SearchPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.userId;
    const queue: Queue = await getQueueByUserId(userId);
    const queueId = queue.id;

    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchPageContent queueId={queueId} />
        </Suspense>
    );
}