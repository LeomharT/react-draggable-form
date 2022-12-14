import { AlignLeftOutlined, CheckCircleOutlined, CheckSquareOutlined, DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, OrderedListOutlined, SearchOutlined, SyncOutlined, UnorderedListOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Input } from "antd";
import React, { RefObject, useCallback, useContext, useRef, useState } from "react";
import AppContext, { AppContextType, ExerciseType } from "../app/app-context";
import { UrlParams } from "../pages/CreateExercise";
import BookSvg from "./BookSvg";


export const Exercises: { type: ExerciseType, icon: React.ReactNode; }[] = [
    { type: ExerciseType.BLANK, icon: <EditOutlined /> },
    { type: ExerciseType.CHOICE, icon: <CheckSquareOutlined /> },
    { type: ExerciseType.MULTICHOICE, icon: <OrderedListOutlined /> },
    { type: ExerciseType.SHORTANSWER, icon: <AlignLeftOutlined /> },
    { type: ExerciseType.JUDGE, icon: <CheckCircleOutlined /> },
    { type: ExerciseType.UPLOAD, icon: <UploadOutlined /> },
];

export type FormComponentsProps = {
    urlParams: UrlParams;
};

export default function FormComponents(props: FormComponentsProps)
{
    const cardRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [isFold, setIsFold] = useState<boolean>(false);

    const { setDragging, dragType } = useContext<AppContextType>(AppContext);

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
        div.onpointerup = () =>
        {
            div.onpointerup = null;
            div.onmousemove = null;
        };

    }, []);

    const onDragFormComponents = useCallback((e: React.PointerEvent<HTMLDivElement>, type: ExerciseType) =>
    {
        setDragging(true);

        dragType.current = type;

        const div = e.target as HTMLDivElement;

        const clone: HTMLDivElement = div.cloneNode(true) as HTMLDivElement;

        clone.style.position = 'absolute';
        clone.style.opacity = '0.8';
        clone.style.width = div.clientWidth + 'px';
        clone.style.backgroundColor = 'rgba(0,0,0,.028)';
        clone.style.boxShadow = '-1px -1px 8px 2px rgba(0,0,0,.028), 1px -1px 8px 2px rgba(0,0,0,.028),0 1px 8px 2px rgba(0,0,0,.028)';
        clone.style.cursor = 'grabbing';

        const downX = e.clientX; //鼠标X
        const downY = e.clientY; //鼠标Y

        const offsetX = div.offsetLeft;
        const offsetY = div.offsetTop;

        //初始位置
        clone.style.left = offsetX + 'px';
        clone.style.top = offsetY + 'px';

        div.parentNode?.appendChild(clone);

        window.onmousemove = (event: MouseEvent) =>
        {
            const moveX = event.clientX;
            const moveY = event.clientY;

            const positionX = moveX - downX;
            const positionY = moveY - downY;

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

    }, [dragType, setDragging]);

    return (
        <>
            <Card className='form-components' ref={cardRef} data-fold={isFold}>
                <header>
                    <BookSvg />
                    <span>{props?.urlParams?.school_courseName}</span>
                </header>
                <Divider />
                <main className="drag-components">
                    <header>
                        <Input prefix={<SearchOutlined />} placeholder='搜索组件' />
                        <Button icon={<UnorderedListOutlined />} type='text' />
                        <Button icon={<SyncOutlined />} type='text' />
                    </header>
                    <Divider />
                    {Exercises.map(v => (
                        <div key={v.type} onPointerDown={e =>
                        {
                            onDragFormComponents(e, v.type);
                        }}>
                            <Button style={{ cursor: 'grab', pointerEvents: "none" }} icon={v.icon} size='large' type="text" />
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
