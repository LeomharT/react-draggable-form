import { DeleteOutlined, EditOutlined, StarOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Radio, Space, Upload } from "antd";
import React, { Dispatch, RefObject, useCallback, useEffect, useRef } from "react";
import { ExerciseComponentType } from "../@types/ExerciseComponentTypes";
import { ExerciseType } from "../app/app-context";
import EditableSelection from "./EditableSelection";
import EditableText from "./EditableText";

type ExerciseComponentProps = {
    id: string;
    index: number,
    identifier: RefObject<HTMLDivElement>;
    data: ExerciseComponentType,
    setOpen: Dispatch<React.SetStateAction<boolean>>,
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;

};

const { TextArea } = Input;

export default function ExerciseComponent(props: ExerciseComponentProps)
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const renderMainSection = useCallback(() =>
    {
        switch (props.data.exercise_type)
        {
            case ExerciseType.CHOICE:
                return (
                    <Radio.Group value={3}>
                        <EditableSelection value={1} type='radio' label="选项1" />
                        <EditableSelection value={2} type='radio' label="选项2" />
                        <EditableSelection value={3} type='radio' label="选项3" />
                        <EditableSelection value={4} type='radio' label="选项4" />
                    </Radio.Group>
                );
            case ExerciseType.MULTICHOICE:
                return (
                    <Checkbox.Group value={[1, 2]}>
                        <EditableSelection value={1} type='checkbox' label="选项1" />
                        <EditableSelection value={2} type='checkbox' label="选项2" />
                        <EditableSelection value={3} type='checkbox' label="选项3" />
                        <EditableSelection value={4} type='checkbox' label="选项4" />
                    </Checkbox.Group>
                );
            case ExerciseType.JUDGE:
                return (
                    <Radio.Group>
                        <Space direction='vertical'>
                            <Radio value={1}>√</Radio>
                            <Radio value={2}>x</Radio>
                        </Space>
                    </Radio.Group>
                );
            case ExerciseType.SHORTANSWER:
                return (
                    <TextArea autoSize={{ minRows: 5 }}>

                    </TextArea>
                );
            case ExerciseType.UPLOAD:
                return (
                    <Upload >
                        <Button icon={<UploadOutlined />}>点击上传</Button>
                    </Upload>
                );
            case ExerciseType.JUDGE:
                return (
                    <Radio.Group>
                        <Space direction='vertical'>
                            <Radio value={1}>√</Radio>
                            <Radio value={2}>x</Radio>
                        </Space>
                    </Radio.Group>
                );
            case ExerciseType.BLANK:
            default:
                return (
                    <Input />
                );
        }
    }, [props.data.exercise_type]);

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
    }, [domEl.current?.childElementCount, props.identifier]);

    return (
        <Form onFinish={e =>
        {
            console.log(e);
        }}>
            <section
                ref={domEl}
                id={props.id}
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
                            {props.data.exercise_type}
                        </span>
                        <span>
                            {props.data.exercise_score.toString()}
                        </span>
                    </div>
                    <Form.Item label={(props.index + 1).toString().padStart(2, '0')}>
                        <EditableText autoSize placeholder="请输入题目" size="large" />
                    </Form.Item>
                    <Form.Item >
                        <EditableText autoSize placeholder="题目说明(选填)" size="middle" />
                    </Form.Item>
                </header>
                {/* 题型输入 */}
                <main>
                    <Form.Item>
                        {renderMainSection()}
                    </Form.Item>
                </main>
                {/* 选项 */}
                <div className="component-options">
                    <Button icon={<EditOutlined />} type='text' onClick={() => props.setOpen(true)} />
                    <Button icon={<StarOutlined />} type='text' />
                    <Button icon={<DeleteOutlined />} danger type='text' />
                </div>
            </section>
        </Form>
    );
}
