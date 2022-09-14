import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
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
    setExerciseData: Dispatch<React.SetStateAction<ExerciseComponentType[]>>,
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;

};

const { TextArea } = Input;

export default function ExerciseComponent(props: ExerciseComponentProps)
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { setExerciseData } = props;

    const deleteExercise = (index: number) =>
    {
        props.setExerciseData(prve =>
        {
            return [...prve.slice(0, index), ...prve.slice(index + 1)];
        });
    };

    const renderMainSection = useCallback(() =>
    {
        const defalutSelection = [
            {
                value: '0',
                label: '选项1'
            }, {
                value: '1',
                label: '选项2'
            }, {
                value: '2',
                label: '选项3'
            }, {
                value: '3',
                label: '选项4'
            },
        ];

        switch (props.data.exercise_type)
        {
            case ExerciseType.CHOICE: {
                let selection = defalutSelection;
                if (props.data.exercise_selection)
                {
                    selection = props.data.exercise_selection;
                }
                return (
                    <Radio.Group value={props.data.exercise_answer ?? '1'}>
                        {
                            selection.map(v =>
                                <EditableSelection key={v.value} value={v.value} label={v.label} type='radio' />
                            )
                        }
                    </Radio.Group>
                );
            }
            case ExerciseType.MULTICHOICE: {
                const anwser = props.data.exercise_answer.split(',');
                let selection = defalutSelection;
                if (props.data.exercise_selection)
                {
                    selection = props.data.exercise_selection;
                }
                return (
                    <Checkbox.Group value={anwser}>
                        {
                            selection.map(v =>
                                <EditableSelection key={v.value} value={v.value} label={v.label} type='checkbox' />
                            )
                        }
                    </Checkbox.Group>
                );
            }
            case ExerciseType.JUDGE: {
                const anwser = Number.parseInt(props.data.exercise_answer);
                return (
                    <Radio.Group value={Number.isNaN(anwser) ? 1 : anwser}>
                        <Space direction='vertical'>
                            <Radio value={1}>√</Radio>
                            <Radio value={2}>x</Radio>
                        </Space>
                    </Radio.Group>
                );
            }
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
            case ExerciseType.BLANK:
            default:
                return (
                    <Input />
                );
        }
    }, [props.data.exercise_type, props.data.exercise_answer, props.data.exercise_selection]);

    const updateExerciseDetailData = useCallback((value: any, index: number, field: keyof ExerciseComponentType) =>
    {
        setExerciseData(prve =>
        {
            const data = prve[index];

            prve[index] = {
                ...data,
                [field]: value
            };
            return [...prve];
        });
    }, [setExerciseData]);

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
                            {props.data.exercise_score.toString()}分
                        </span>
                    </div>
                    <Form.Item
                        name={'exercise_title'}
                        initialValue={props.data.exercise_title}
                        label={(props.index + 1).toString().padStart(2, '0')}
                    >
                        <EditableText
                            autoSize
                            size="large"
                            placeholder="请输入题目"
                            onBlur={e =>
                            {
                                const value = e.target.value;
                                updateExerciseDetailData(value, props.index, 'exercise_title');
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name={'exercise_description'}
                        initialValue={props.data.exercise_description}
                    >
                        <EditableText
                            autoSize
                            size="middle"
                            placeholder="题目说明(选填)"
                            onBlur={e =>
                            {
                                const value = e.target.value;
                                updateExerciseDetailData(value, props.index, 'exercise_description');
                            }}
                        />
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
                    <Button icon={<DeleteOutlined />} danger type='text' onClick={() => deleteExercise(props.index)} />
                </div>
            </section>
        </Form>
    );
}
