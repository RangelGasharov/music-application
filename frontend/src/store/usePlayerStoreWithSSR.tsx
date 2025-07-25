"use client";
import { useEffect, useState } from "react";
import { usePlayerStore } from "./usePlayerStore";
import { PlayerState } from "@/types/PlayerState";

export function usePlayerStoreWithSSR<T>(
    selector: (state: PlayerState) => T
): T {
    const [state, setState] = useState(() => selector(usePlayerStore.getState()));

    useEffect(() => {
        const unsub = usePlayerStore.subscribe((current) => {
            setState(selector(current));
        });
        return unsub;
    }, [selector]);

    return state;
}
