import { AlignLeftOutlined, CheckCircleOutlined, CheckSquareOutlined, DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, LeftOutlined, OrderedListOutlined, SearchOutlined, SyncOutlined, UnorderedListOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Input } from "antd";
import React, { RefObject, useCallback, useRef, useState } from "react";
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
        const div = e.target as HTMLDivElement;

        //卸载事件
        div.onpointerup = (e: PointerEvent) =>
        {
            div.onpointerup = null;
            div.onmousemove = null;
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
