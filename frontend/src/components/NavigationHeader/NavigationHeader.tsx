import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';

export default function NavigationHeader() {
    return (
        <Box>
            <AppBar elevation={0} sx={{ position: "static", backgroundColor: "var(--bg-color)", color: "var(--text-color)", boxShadow: "0px 1px 7px var(--text-color)" }} >
                <Toolbar>
                    <NavigationDrawer />
                </Toolbar>
            </AppBar>
        </Box>
    );
}