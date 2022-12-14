import { MutableRefObject, useCallback, useRef } from "react";

export default function useDebounce<T extends (...args: any[]) => any>(fn: T, time: number = 50): T
{
    const timer: MutableRefObject<number | null> = useRef<number | null>(null);

    const debounceFn: MutableRefObject<Function | null> = useRef<Function | null>(fn);

    const debounce = useCallback((args: any) =>
    {
        if (timer.current) clearTimeout(timer.current);

        debounceFn.current = fn;

        timer.current = setTimeout(() =>
        {
            if (debounceFn.current)
            {
                debounceFn.current(args);
                debounceFn.current = null;
            }
            timer.current = null;
        }, time);

    }, [fn, time]);

    return debounce as T;
}
