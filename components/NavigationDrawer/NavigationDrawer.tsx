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
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Link from 'next/link';

type NavigationDrawerType = {
    username: string
}

export default function NavigationDrawer({ username }: NavigationDrawerType) {
    const [open, setOpen] = React.useState(false);

    const drawerSections = [
        { name: "Home", sectionIcon: <HomeOutlinedIcon />, path: "/" },
        { name: "Dashboard", sectionIcon: <ConfirmationNumberOutlinedIcon />, path: "/dashboard" },
        { name: "Settings", sectionIcon: <SettingsOutlinedIcon />, path: "/settings" }
    ]

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const DrawerList = (
        <Box role="presentation">
            <List>
                {drawerSections.map((element) => (
                    <ListItem key={element.name} sx={{ padding: "0rem 1rem" }}>
                        <Link href={element.path}>
                            <ListItemIcon sx={{ color: "white" }}>
                                {element.sectionIcon}
                            </ListItemIcon>
                            <ListItemText primary={element.name} />
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <Box style={{
                minHeight: "100vh", height: "100%", padding: ".75rem 0rem"
            }}>
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