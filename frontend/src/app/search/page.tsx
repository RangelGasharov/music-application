import { Suspense } from 'react';
import SearchPageContent from '@/components/SearchPageContent/SearchPageContent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function SearchPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.userId;

    let queueId: string = "";

    if (userId) {
        try {
            const res = await fetch(`${process.env.WEB_API_URL}/queue/user-id/${userId}`, {
                cache: "no-store",
            });

            if (!res.ok) {
                console.error("Response was not ok!", res.status);
                return;
            }
            const data = await res.json();
            queueId = data.id;
        } catch (error) {
            console.error("An error has occured while trying to fetch the queue: ", error)
        }
    }

    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchPageContent queueId={queueId} />
        </Suspense>
    );
}