import { EllipsisOutlined, SearchOutlined, ShareAltOutlined, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import AppContext from '../app/app-context';
import EditExercise from '../components/EditExercise';
import ExerciseComponent from '../components/ExerciseComponent';
import FormComponents from '../components/FormComponents';
import useDebounce from '../hooks/useDebounce';

export default function DraggableForm()
{
    const dispatch = useDispatch();

    const [ids, setIds] = useState<string[]>([]);

    /** 但前锚点 */
    const [currentId, setCurrentId] = useState<string>('');

    const { dragging, dragType } = useContext(AppContext);

    /** 是否在列表头部插入 */
    const [isBefore, setIsBefore] = useState<boolean>(false);

    const [open, setOpen] = useState<boolean>(false);

    const identifier: RefObject<HTMLDivElement> = useRef<HTMLDivElement>((() =>
    {
        const identifier = document.createElement('div');
        identifier.classList.add('position-identifier');
        identifier.appendChild(document.createElement('div'));

        return identifier;
    })());

    /** 切换锚点 */
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

    }, 200);

    /** 添加定位 */
    const positionIdentifier = useCallback((e: React.MouseEvent) =>
    {
        const target = e.currentTarget as HTMLDivElement;
        target.appendChild(identifier.current as HTMLElement);
        target.style.marginBottom = "40px";
    }, []);

    /** 清除定位 */
    const clearIdentifier = useCallback((e: React.MouseEvent) =>
    {
        e.stopPropagation();
        const target = (e.currentTarget as HTMLPreElement);
        target.style.marginBottom = '0px';

        if (target.style.paddingTop === '40px')
        {
            target.style.paddingTop = '0px';
        }

        if (target.contains(identifier.current))
        {
            target.removeChild(identifier.current as HTMLElement);
        }
    }, []);

    /** 插入新组件 */
    const insertNewComponent = useCallback((e: React.MouseEvent, targetId: string, isBefore: boolean) =>
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
            if (isBefore)
            {
                setIsBefore(false);
                return [id, ...prve];
            }

            return [...before, id, ...after];
        });

    }, [setIds, setIsBefore, clearIdentifier]);

    /** 如果想在头部插入 */
    const insertBefore = useCallback((e: React.MouseEvent) =>
    {
        const target = e.currentTarget as HTMLDivElement;

        if ((e.pageY - 60) < (target.clientHeight / 2))
        {
            setIsBefore(true);
            target.style.paddingTop = "40px";
            target.style.marginBottom = "0px";
            if (target.contains(identifier.current))
            {
                target.removeChild(identifier.current as HTMLElement);
            }
        } else
        {
            setIsBefore(false);
            target.style.paddingTop = "0px";
            positionIdentifier(e);
        }
    }, [positionIdentifier]);

    /** 添加新组件 */
    const appendNewComponent = useCallback((e: React.MouseEvent) =>
    {
        e.stopPropagation();
        const id = uuidv4().substring(0, 8);
        setIds(prve => [...prve, id]);
    }, [setIds]);

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
                            ids.map((v, index, arr) =>
                                <ExerciseComponent
                                    id={v}
                                    key={v}
                                    componentType={dragType.current}
                                    index={index}
                                    identifier={identifier}
                                    setOpen={setOpen}
                                    onMouseEnter={e =>
                                    {
                                        if (!dragging) return;
                                        positionIdentifier(e);
                                        e.stopPropagation();
                                    }}
                                    onMouseLeave={e =>
                                    {
                                        if (!dragging) return;
                                        clearIdentifier(e);
                                    }}
                                    onMouseUp={e =>
                                    {
                                        if (!dragging) return;
                                        insertNewComponent(e, v, isBefore);
                                    }}
                                    onMouseMove={e =>
                                    {
                                        if (!dragging) return;
                                        if (arr.indexOf(v) !== 0) return;
                                        insertBefore(e);
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
                                    <li key={v}>
                                        <Button
                                            type={v === currentId ? 'link' : 'text'}
                                            href={`#${v}`}
                                            data-current={v === currentId}
                                            onClick={() =>
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
            <EditExercise open={open} setOpen={setOpen} />
        </div >
    );
}
