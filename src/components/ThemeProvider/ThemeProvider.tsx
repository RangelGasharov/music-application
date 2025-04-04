"use client"
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { Theme } from "@/types/ThemeType";

export function ThemeProvider({
    defaultTheme = "system",
}: {
    defaultTheme?: Theme;
}) {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTheme =
                (localStorage.getItem("vite-ui-theme") as Theme) || defaultTheme;
            if (storedTheme && storedTheme !== theme) {
                setTheme(storedTheme);
            }
        }
    }, [defaultTheme, setTheme, theme]);


    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (theme: Theme) => {
            root.classList.remove("light", "dark");
            root.classList.add(theme);
        };

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
            applyTheme(systemTheme.matches ? "dark" : "light");

            const handler = (e: MediaQueryListEvent) => {
                applyTheme(e.matches ? "dark" : "light");
            };
            systemTheme.addEventListener("change", handler);
            return () => systemTheme.removeEventListener("change", handler);
        }
        applyTheme(theme);
    }, [theme]);
    return null;
}