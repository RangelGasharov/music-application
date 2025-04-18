import { create } from "zustand";
import { Theme } from "@/types/ThemeType";

type ThemeState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    theme: "system",
    setTheme: (theme: Theme) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("vite-ui-theme", theme);
        }
        set({ theme });
    },
}));