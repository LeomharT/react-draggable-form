import { DeleteOutlined, EditOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import React, { RefObject, useEffect, useRef } from "react";
import EditAbleText from "./EditAbleText";

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
                <div>题目类型 xx分</div>
                <Form onFinish={e =>
                {
                    console.log(e);
                }}>
                    <Form.Item name={'haha'} label='asd'>
                        <EditAbleText placeholder="请输入题目" size="large" name="haha" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">GO</Button>
                    </Form.Item>
                </Form>
            </header>
            {/* 选项 */}
            <main>
                123
            </main>
            {/* 选项 */}
            <div className="component-options">
                <Button icon={<EditOutlined />} type='text' />
                <Button icon={<StarOutlined />} type='text' />
                <Button icon={<DeleteOutlined />} danger type='text' />
            </div>
        </section>
    );
}
