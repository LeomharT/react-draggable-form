import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Card, Divider } from "antd";
import React, { RefObject, useCallback, useRef, useState } from "react";
import BookSvg from "./BookSvg";

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
                        <div
                            style={{
                                width: '100%',
                                height: '30px',
                                borderRadius: '5px',
                                background: 'rgba(0,0,0,.028)',
                                lineHeight: '30px'
                            }}
                            onPointerDown={e =>
                            {

                            }}
                            onDragEnd={e =>
                            {
                                console.log(e);
                            }}
                        >来点内容哦</div>
                    </header>
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
