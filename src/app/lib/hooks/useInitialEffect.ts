import { useEffect } from "react";

export function useInitialEffect(
    callback: () => void,
    unmountCallback?: () => void,
) {
    useEffect(() => {
        callback();
        return () => {
            unmountCallback?.();
        };
        
        // eslint-disable-next-line
    }, []);
}
