import { EllipsisOutlined, SearchOutlined, ShareAltOutlined, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AppContext from '../app/app-context';
import ExerciseComponent from '../components/ExerciseComponent';
import FormComponents from '../components/FormComponents';
import useDebounce from '../hooks/useDebounce';

export default function DraggableForm()
{
    const [ids, setIds] = useState<string[]>([]);

    const [currentId, setCurrentId] = useState<string>('');

    const { dragging, dragType } = useContext(AppContext);

    const identifier: RefObject<HTMLDivElement> = useRef<HTMLDivElement>((() =>
    {
        const identifier = document.createElement('div');
        identifier.classList.add('position-identifier');
        identifier.appendChild(document.createElement('div'));

        return identifier;
    })());

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

    const clearIdentifier = useCallback((e: React.MouseEvent) =>
    {
        e.stopPropagation();
        const container = (e.currentTarget as HTMLPreElement);
        container.style.marginBottom = '0px';
        if (container.contains(identifier.current))
        {
            container.removeChild(identifier.current as HTMLElement);
        }
    }, [identifier.current]);

    const insertNewComponent = useCallback((e: React.MouseEvent, targetId: string) =>
    {
        e.stopPropagation();

        clearIdentifier(e);

        const id = uuidv4().substring(0, 8);

        setIds(prve =>
        {
            const index: number = prve.indexOf(targetId);

            const before: string[] = [];
            const after: string[] = [];

            for (let i = 0; i < prve.length; i++)
            {
                if (i <= index) before.push(prve[i]);
                else after.push(prve[i]);
            }
            return [...before, id, ...after];
        });

    }, []);

    const appendNewComponent = useCallback((e: React.MouseEvent) =>
    {
        e.stopPropagation();
        const id = uuidv4().substring(0, 8);
        setIds(prve => [...prve, id]);
    }, []);

    useEffect(() =>
    {
        const arr: string[] = [];

        for (let i = 0; i < 1; i++)
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
                    <div onMouseUp={e =>
                    {
                        if (!dragging) return;
                        appendNewComponent(e);
                    }}>
                        {
                            ids.map(v =>
                                <ExerciseComponent
                                    id={v}
                                    key={v}
                                    identifier={identifier}
                                    onMouseEnter={e =>
                                    {
                                        if (!dragging) return;
                                        e.stopPropagation();
                                        const target = e.currentTarget as HTMLDivElement;
                                        target.appendChild(identifier.current as HTMLElement);
                                        target.style.marginBottom = "40px";
                                    }}
                                    onMouseLeave={e =>
                                    {
                                        if (!dragging) return;
                                        clearIdentifier(e);
                                    }}
                                    onMouseUp={(e, id) =>
                                    {
                                        if (!dragging) return;
                                        insertNewComponent(e, id);
                                    }}
                                />
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
