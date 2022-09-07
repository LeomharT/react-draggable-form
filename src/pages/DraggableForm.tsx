import { EllipsisOutlined, SearchOutlined, ShareAltOutlined, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
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

        let id = '';

        for (let i = 0; i < ids.length; i++)
        {
            const el = document.getElementById(ids[i]) as HTMLDivElement;

            //减头部 减滚动条高度
            const offect = el.offsetTop - scroll_top - 60;

            if (offect <= 0) id = ids[i];
        }

        //滚到底不触发
        if (!(scroll_top + main_el.clientHeight === main_el.scrollHeight)) setCurrentId(id);

    }, 200, [ids.length]);

    const identifier = useMemo(() =>
    {
        const identifier = document.createElement('div');
        identifier.classList.add('position-identifier');
        identifier.appendChild(document.createElement('div'));

        return identifier;
    }, [ids.length]);

    useEffect(() =>
    {
        const arr: string[] = [];

        for (let i = 0; i < 25; i++)
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
                    <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                    <Button type='primary'>保存</Button>
                    {
                        [
                            <ShareAltOutlined />,
                            <UserAddOutlined />,
                            <StarOutlined />,
                            <SearchOutlined />,
                        ].map(v => <Button icon={v} key={v.key} type='text' />)
                    }
                    <div style={{ marginRight: 'auto' }}>
                        XXX课程
                    </div>
                </header>
                <main onScroll={switchAnchor}>
                    <div>
                        {
                            ids.map(v =>
                                <p id={v}
                                    key={v}
                                    style={{ height: "90px" }}
                                    onMouseEnter={e =>
                                    {
                                        e.stopPropagation();
                                        (e.target as HTMLPreElement).appendChild(identifier);
                                    }}
                                    onMouseLeave={e =>
                                    {
                                        (e.target as HTMLPreElement).removeChild(identifier);
                                    }}
                                >
                                    {v}
                                </p>
                            )
                        }
                    </div>
                    <aside className='side-navi'>
                        <p style={{ fontWeight: "bold", marginLeft: "18px" }}>TOC</p>
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
                                            onClick={e =>
                                            {
                                                setCurrentId(v);
                                            }}>
                                            {v + v + v + v}
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
