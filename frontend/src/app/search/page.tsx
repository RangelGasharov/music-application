import { Suspense } from 'react';
import SearchPageContent from '@/components/SearchPageContent/SearchPageContent';

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}