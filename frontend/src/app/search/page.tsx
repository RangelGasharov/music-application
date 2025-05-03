'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { List, ListItemText, Typography, Box, CircularProgress, ListItemButton } from '@mui/material';

interface SearchResult {
    Title?: string;
    Name?: string;
    Type?: string;
    Id?: number;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const term = searchParams.get('term');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            if (!term) return;
            try {
                const res = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [term]);

    if (!term) {
        return <Typography variant="h5">No search term provided.</Typography>;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>Search results for &quot;{term}&quot;</Typography>
            {results.length === 0 ? (
                <Typography>No results found.</Typography>
            ) : (
                <List>
                    {results.map((item, index) => (
                        <List key={index}>
                            <ListItemButton>
                                <ListItemText
                                    primary={item.Title || item.Name}
                                    secondary={item.Type}
                                />
                            </ListItemButton>
                        </List>
                    ))}
                </List>
            )}
        </Box>
    );
}