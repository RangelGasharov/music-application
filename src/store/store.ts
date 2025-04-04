import { create } from 'zustand'

export const useStore = create((set) => ({
    count: 0,
    incrementCount: () => set((state: { count: number }) => ({ count: state.count + 1 })),
    resetCount: () => set({ count: 0 }),
    updateCount: (newCount: number) => set({ count: newCount }),
}))