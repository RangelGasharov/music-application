"use client"
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useThemeStore } from "@/store/useThemeStore";
import { Theme } from "@/types/ThemeType";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";

export const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newTheme: Theme | null
    ) => {
        if (newTheme) {
            setTheme(newTheme);
        }
    };

    return (
        <ToggleButtonGroup value={theme} exclusive onChange={handleChange} aria-label="Theme toggle" size="small">
            <ToggleButton value="light" aria-label="Light mode"><LightModeIcon /></ToggleButton>
            <ToggleButton value="dark" aria-label="Dark mode"><DarkModeIcon /></ToggleButton>
            <ToggleButton value="system" aria-label="System default"><SettingsIcon /></ToggleButton>
        </ToggleButtonGroup>
    );
};