"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Link from 'next/link';
import styles from "./NavigationDrawer.module.css";

export default function NavigationDrawer() {
    const [open, setOpen] = React.useState(false);

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
            <List>
                {drawerSections.map((element) => (
                    <Link key={element.path + element.name} className={styles["navigation-link-box"]} href={element.path}>
                        <ListItemIcon sx={{ color: "inherit" }}>{element.sectionIcon}</ListItemIcon>
                        <ListItemText primary={element.name} />
                    </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <Box className={styles["drawer-bar"]}>
                <Button onClick={toggleDrawer}>
                    <ListIcon sx={{ color: "black", fontSize: "1.75rem", position: "fixed" }} />
                </Button>
            </Box>
            <Drawer open={open} onClose={toggleDrawer}>
                <Box>
                    {DrawerList}
                </Box>
            </Drawer>
        </Box>
    );
}