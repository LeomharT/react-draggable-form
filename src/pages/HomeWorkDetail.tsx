import { useEffect } from "react";
import useUrlParams from "../hooks/useUrlParams";

type HomeWorkDetailURLParams = {
    ID: string;
    CourseName: string;
};


export default function HomeWorkDetail()
{
    const url_params = useUrlParams<HomeWorkDetailURLParams>();


    useEffect(() =>
    {
        console.log(url_params);
    }, [url_params]);

    return (
        <div className="homework-detail">
            <aside className="chapter-navi">

            </aside>
            <main>
                {url_params.CourseName}
                {url_params.ID}
            </main>
        </div>
    );
}
