import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormComponents from '../components/FormComponents';
import useDebounce from '../hooks/useDebounce';
export default function DraggableForm()
{
    const [ids, setIds] = useState<string[]>([]);

    const [currentId, setCurrentId] = useState<string>('');

    const switchAnchor = useDebounce((e: React.UIEvent) =>
    {
        const main_el = e.target as HTMLDivElement;

        const scroll_top = main_el.scrollTop;

        for (let i = 0; i < ids.length; i++)
        {
            const el = document.getElementById(ids[i]) as HTMLDivElement;

            //减头部 减滚动条高度
            const offect = el.offsetTop - scroll_top - 60;

            if (offect <= 0) setCurrentId(ids[i]);
        }

        console.log('yes');
    }, 500, [ids.length]);

    useEffect(() =>
    {
        const arr: string[] = [];

        for (let i = 0; i < 30; i++)
        {
            const id = uuidv4().substring(0, 8);

            arr.push(id);
        }
        setIds([...arr]);

        setCurrentId(arr[0]);

    }, [setIds, setCurrentId]);

    return (
        <div className="draggable-form">
            <FormComponents />
            <div className='exercise-area' >
                <header>
                    456
                </header>
                <main onScroll={switchAnchor}>
                    <div>
                        {
                            ids.map(v =>
                                <p id={v} key={v} style={{ height: "90px" }}>
                                    {v}
                                </p>
                            )
                        }
                    </div>
                    <aside className='side-navi'>
                        <ul>
                            {
                                ids.map(v =>
                                    <li>
                                        <Button
                                            type={v === currentId ? 'link' : 'text'}
                                            id={v}
                                            key={v}
                                            href={`#${v}`}
                                            data-current={v === currentId}
                                            onClick={e => setCurrentId(v)}>
                                            {v}
                                        </Button>
                                    </li>
                                )
                            }
                        </ul>
                    </aside>
                </main>
            </div>
        </div >
    );
}
