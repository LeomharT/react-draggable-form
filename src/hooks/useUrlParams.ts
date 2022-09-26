import { useEffect, useState } from "react";

export default function useUrlParams<T>()
{
    const [urlParams, setUrlParams] = useState<T>({} as T);

    useEffect(() =>
    {
        const params = new URLSearchParams(window.location.href.split('?')[1]);

        const obj: T = {} as T;

        for (const [k, v] of params.entries())
        {
            obj[k] = v;
        }

        setUrlParams({ ...obj });

    }, [setUrlParams]);


    return urlParams;
}
