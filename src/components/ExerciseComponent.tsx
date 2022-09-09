import { DeleteOutlined, EditOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { RefObject, useEffect, useRef } from "react";
import EditAbleText from "./EditAbleText";

const { TextArea } = Input;
type ExerciseComponentProps = {
    id: string;
    index: number,
    identifier: RefObject<HTMLDivElement>;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;

};

export default function ExerciseComponent(props: ExerciseComponentProps)
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    //保证定位效果
    useEffect(() =>
    {
        props.identifier!.current!.style.opacity = '0';
        if (domEl.current?.contains(props.identifier.current))
        {
            domEl.current.style.marginBottom = '0px';
            props.identifier!.current?.remove();
        }
        setTimeout(() =>
        {
            props.identifier!.current!.style.opacity = '1';
        }, 10);
    }, [domEl.current?.childElementCount]);

    return (
        <Form onFinish={e =>
        {
            console.log(e);
        }}>
            <section
                ref={domEl}
                id={props.id}
                key={props.id}
                className='exercise-components'
                onMouseUp={props.onMouseUp}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                onMouseMove={props.onMouseMove}
            >

                {/* 头部 */}
                <header>
                    <div className="exercise-tags">
                        <span>
                            类型
                        </span>
                        <span>
                            分数
                        </span>
                    </div>
                    <Form.Item name={'haha'} label={(props.index + 1).toString().padStart(2, '0')}>
                        <EditAbleText autoSize placeholder="请输入题目" size="large" />
                    </Form.Item>
                </header>
                {/* 选项 */}
                <main>
                    <Form.Item>
                        <Input />
                    </Form.Item>
                </main>
                {/* 选项 */}
                <div className="component-options">
                    <Button icon={<EditOutlined />} type='text' />
                    <Button icon={<StarOutlined />} type='text' />
                    <Button icon={<DeleteOutlined />} danger type='text' />
                </div>
            </section>
        </Form>
    );
}
