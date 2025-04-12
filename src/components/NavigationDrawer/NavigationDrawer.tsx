"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Link from 'next/link';
import styles from "./NavigationDrawer.module.css";
import "../../app/globals.css";
import { useState } from 'react';

export default function NavigationDrawer() {
    const [open, setOpen] = useState(false);

    const drawerSections = [
        { name: "Home", sectionIcon: <HomeOutlinedIcon />, path: "/" },
        { name: "Dashboard", sectionIcon: <BarChartIcon />, path: "/dashboard" },
        { name: "Settings", sectionIcon: <SettingsOutlinedIcon />, path: "/settings" }
    ]

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const DrawerList = (
        <Box role="presentation">
            {drawerSections.map((element) => (
                <Link onClick={toggleDrawer} key={element.path + element.name} className={styles["navigation-link-box"]} href={element.path}>
                    <ListItemIcon sx={{ color: "inherit" }}>{element.sectionIcon}</ListItemIcon>
                    <ListItemText primary={element.name} />
                </Link>
            ))}
        </Box>
    );

    return (
        <Box>
            <Button onClick={toggleDrawer}>
                <ListIcon className={styles["drawer-menu-icon"]} sx={{ background: "inherit", fontSize: "1.75rem" }} />
            </Button>
            <Drawer open={open} onClose={toggleDrawer}>
                <Box className={styles["drawer-list"]}>
                    {DrawerList}
                </Box>
            </Drawer>
        </Box>
    );
}