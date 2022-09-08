import { AlignLeftOutlined, CheckCircleOutlined, CheckSquareOutlined, DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, LeftOutlined, OrderedListOutlined, SearchOutlined, SyncOutlined, UnorderedListOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Input } from "antd";
import React, { RefObject, useCallback, useContext, useRef, useState } from "react";
import AppContext, { AppContextType } from "../app/app-context";
import BookSvg from "./BookSvg";

const ExerciseType = [
    { type: '填空题', icon: <EditOutlined /> },
    { type: '选择题', icon: <CheckSquareOutlined /> },
    { type: '多选题', icon: <OrderedListOutlined /> },
    { type: '简答题', icon: <AlignLeftOutlined /> },
    { type: '判断题', icon: <CheckCircleOutlined /> },
    { type: '上传附件', icon: <UploadOutlined /> },
];

export default function FormComponents()
{
    const cardRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [isFold, setIsFold] = useState<boolean>(false);

    const { setDragging } = useContext<AppContextType>(AppContext);

    /** - 注意 `flex-shrink:0;` */
    const onResize = useCallback((e: React.PointerEvent<HTMLDivElement>) =>
    {
        const div = e.target as HTMLDivElement;

        //锁定事件
        div.setPointerCapture(e.pointerId);

        const client_width = cardRef.current!.clientWidth;

        const x = e.clientX;

        div.onmousemove = (mouse_event: MouseEvent) =>
        {
            const offect_x = x - mouse_event.clientX;

            const width = client_width - offect_x;

            if (width < 236) return;

            cardRef.current!.style.width = width + 'px';
        };

        //卸载事件
        div.onpointerup = (e: PointerEvent) =>
        {
            div.onpointerup = null;
            div.onmousemove = null;
        };

    }, [cardRef.current]);

    const onDragFormComponents = useCallback((e: React.PointerEvent<HTMLDivElement>) =>
    {
        setDragging(true);

        const div = e.target as HTMLDivElement;

        const clone: HTMLDivElement = div.cloneNode(true) as HTMLDivElement;

        clone.style.position = 'absolute';
        clone.style.opacity = '0.8';
        clone.style.width = div.clientWidth + 'px';
        clone.style.backgroundColor = 'rgba(0,0,0,.028)';
        clone.style.boxShadow = '-1px -1px 8px 2px rgba(0,0,0,.028), 1px -1px 8px 2px rgba(0,0,0,.028),0 1px 8px 2px rgba(0,0,0,.028)';
        clone.style.cursor = 'grabbing';

        let downX = e.clientX; //鼠标X
        let downY = e.clientY; //鼠标Y

        let offsetX = div.offsetLeft;
        let offsetY = div.offsetTop;

        //初始位置
        clone.style.left = offsetX + 'px';
        clone.style.top = offsetY + 'px';

        div.parentNode?.appendChild(clone);

        window.onmousemove = (event: MouseEvent) =>
        {
            let moveX = event.clientX;
            let moveY = event.clientY;

            let positionX = moveX - downX;
            let positionY = moveY - downY;

            clone.style.left = offsetX + positionX + 'px';
            clone.style.top = offsetY + positionY + 'px';

        };

        //卸载事件
        window.onpointerup = (e: PointerEvent) =>
        {
            if (e.composedPath()[1] === div.parentNode)
            {
                clone.style.transition = 'all 0.2s ease 0s';
                clone.style.left = offsetX + 'px';
                clone.style.top = offsetY + 'px';
                setTimeout(() =>
                {
                    div.parentNode?.removeChild(clone);
                }, 200);
            }
            else
            {
                div.parentNode?.removeChild(clone);
            }

            window.onmousemove = null;
            window.onpointerup = null;

            //下轮宏任务开始在设为false
            setTimeout(() =>
            {
                setDragging(false);
            }, 10);
        };

    }, []);

    return (
        <>
            <Card className='form-components' ref={cardRef} data-fold={isFold}>
                <header>
                    <Button type="text" icon={<LeftOutlined />} />
                    <BookSvg />
                    <span>课程名称xxx</span>
                </header>
                <Divider />
                <main className="drag-components">
                    <header>
                        <Input prefix={<SearchOutlined />} placeholder='搜索组件' />
                        <Button icon={<UnorderedListOutlined />} type='text' />
                        <Button icon={<SyncOutlined />} type='text' />
                    </header>
                    <Divider />
                    {ExerciseType.map(v => (
                        <div onPointerDown={onDragFormComponents}>
                            <Button icon={v.icon} size='large' type="text" />
                            {v.type}
                        </div>
                    ))}
                </main>
                <div className="drag-resize" onPointerDown={onResize} />
            </Card>
            <Button
                data-fold={isFold}
                className="fold-button"
                shape='circle'
                icon={isFold ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                onClick={() => { setIsFold(isFold => !isFold); }}
            />
        </>
    );
}
