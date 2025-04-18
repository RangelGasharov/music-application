import { create } from 'zustand'

interface StoreState {
    count: number;
    incrementCount: () => void;
    resetCount: () => void;
}

export const useStore = create<StoreState>((set) => ({
    count: 0,
    incrementCount: () => set((state: { count: number }) => ({ count: state.count + 1 })),
    resetCount: () => set({ count: 0 }),
    updateCount: (newCount: number) => set({ count: newCount }),
}))