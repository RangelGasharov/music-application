"use client"
import React from 'react';
import { useStore } from '@/store/store';
import { Button } from '@mui/material';

export default function DashboardPage() {
    const { count, incrementCount, resetCount } = useStore();
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Count: {count}</p>
            <Button onClick={incrementCount}>Increment</Button>
            <Button onClick={resetCount}>Reset</Button>
        </div>
    )
}