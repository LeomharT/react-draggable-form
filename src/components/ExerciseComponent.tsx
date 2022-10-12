import { DeleteOutlined, EditOutlined, HolderOutlined, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Radio, Space } from "antd";
import React, { Dispatch, RefObject, useCallback, useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { ExerciseComponentType } from "../@types/exercise-types";
import AppContext, { AppContextType, ExerciseType } from "../app/app-context";
import EditableSelection from "./EditableSelection";
import EditableText from "./EditableText";
import { Exercises } from "./FormComponents";

type ExerciseComponentProps = {
    id: string;
    index: number,
    identifier: RefObject<HTMLDivElement>;
    data: ExerciseComponentType,
    mainRef: RefObject<HTMLDivElement>,
    setOpen: Dispatch<React.SetStateAction<boolean>>,
    deleteExercise: (index: number) => void;
    updateExerciseDetailData: (value: any, index: number, field: keyof ExerciseComponentType) => void;
    setExerciseIndex: Dispatch<React.SetStateAction<number>>,
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
};

const { TextArea } = Input;

export const defalutSelection = [
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

export default function ExerciseComponent(props: ExerciseComponentProps)
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { setReorder } = useContext<AppContextType>(AppContext);

    const { mainRef: list } = props;

    const { deleteExercise, updateExerciseDetailData } = props;

    const renderMainSection = useCallback(() =>
    {
        switch (props.data.exercise_type)
        {
            case ExerciseType.CHOICE: {
                return (
                    <Radio.Group value={props.data.exercise_answer ?? '1'}>
                        {
                            props.data.exercise_selection.map((v: any, index: number) =>
                                <EditableSelection
                                    key={v.value}
                                    value={v.value}
                                    label={v.label}
                                    type='radio'
                                    onChange={e =>
                                    {
                                        props.data.exercise_selection[index].label = e;
                                    }}
                                    onDelete={() =>
                                    {
                                        let selection = props.data.exercise_selection as any[];
                                        if (selection.length === 1)
                                        {
                                            message.error('不能少于一个选项');
                                            return;
                                        }
                                        selection = [
                                            ...selection.slice(0, index),
                                            ...selection.slice(++index)
                                        ];
                                        updateExerciseDetailData(
                                            selection,
                                            props.index,
                                            'exercise_selection'
                                        );
                                    }}
                                />
                            )
                        }
                        <Button
                            icon={<PlusCircleOutlined />}
                            style={{ marginTop: '10px' }}
                            onClick={() =>
                            {
                                const selection = props.data.exercise_selection as any[];
                                const index = selection.length;
                                selection.push({
                                    value: index.toString(),
                                    label: `选项${index + 1}`
                                });
                                updateExerciseDetailData(
                                    selection,
                                    props.index,
                                    'exercise_selection'
                                );
                            }}
                        >
                            添加选项
                        </Button>
                    </Radio.Group>
                );
            }
            case ExerciseType.MULTICHOICE: {
                const anwser = props.data.exercise_answer.split(',');
                return (
                    <Checkbox.Group value={anwser}>
                        {
                            props.data.exercise_selection.map((v: any, index: number) =>
                                <EditableSelection
                                    key={v.value}
                                    value={v.value}
                                    label={v.label}
                                    type='checkbox'
                                    onChange={e =>
                                    {
                                        props.data.exercise_selection[index].label = e;
                                    }}
                                    onDelete={() =>
                                    {
                                        let selection = props.data.exercise_selection as any[];
                                        if (selection.length === 1)
                                        {
                                            message.error('不能少于一个选项');
                                            return;
                                        }
                                        selection = [
                                            ...selection.slice(0, index),
                                            ...selection.slice(++index)
                                        ];
                                        updateExerciseDetailData(
                                            selection,
                                            props.index,
                                            'exercise_selection'
                                        );
                                    }}
                                />
                            )
                        }
                        <Button
                            icon={<PlusCircleOutlined />}
                            style={{ marginTop: '10px' }}
                            onClick={() =>
                            {
                                const selection = props.data.exercise_selection as any[];
                                const index = selection.length;
                                selection.push({
                                    value: index.toString(),
                                    label: `选项${index + 1}`
                                });
                                updateExerciseDetailData(
                                    selection,
                                    props.index,
                                    'exercise_selection'
                                );
                            }}
                        >
                            添加选项
                        </Button>
                    </Checkbox.Group>
                );
            }
            case ExerciseType.JUDGE: {
                return (
                    <Radio.Group value={props.data.exercise_answer ?? '1'}>
                        <Space direction='vertical'>
                            <Radio value={'0'}>错误</Radio>
                            <Radio value={'1'}>正确</Radio>
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
                    <Button icon={<UploadOutlined />} onClick={e => e.preventDefault()}>点击上传</Button>
                );
            case ExerciseType.BLANK:
            default:
                return (
                    <Input />
                );
        }
    }, [updateExerciseDetailData, props.index, props.data.exercise_type, props.data.exercise_answer, props.data.exercise_selection]);

    const onReOrder = useCallback((e: React.PointerEvent, type: ExerciseType) =>
    {
        const exercise_item = Exercises.find(v => v.type === type);

        if (!exercise_item) return;

        domEl.current!.style.opacity = '0';
        domEl.current!.style.height = '0px';

        setReorder(true);

        const div = document.createElement('div') as HTMLDivElement;
        div.classList.add('reorder-float');

        const downX = e.clientX; //鼠标X
        const downY = e.clientY - 25; //鼠标Y

        //初始位置
        div.style.right = 200 + 'px';
        div.style.top = downY + 'px';

        list.current?.appendChild(div);

        const root = ReactDOM.createRoot(div);

        root.render(
            <div>
                <Button icon={exercise_item.icon} type='text' />
                {exercise_item.type}
            </div>
        );

        window.onmousemove = event =>
        {
            const moveX = event.clientX;
            const moveY = event.clientY;

            const positionX = moveX - downX;
            const positionY = moveY - downY;

            div.style.right = 200 - positionX + 'px';
            div.style.top = downY - 25 + positionY + 'px';
        };

        window.onpointerup = () =>
        {
            if (list.current?.contains(div)) list.current?.removeChild(div);

            window.onpointerup = null;

            window.onmousemove = null;

            root.unmount();

            domEl.current!.style.opacity = '1';
            domEl.current!.style.height = 'fit-content';

            //下轮宏任务开始在设为false
            setTimeout(() =>
            {
                setReorder(false);
            }, 10);
        };
    }, [list, setReorder]);

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
        <Form>
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
                    <Button icon={<HolderOutlined />} type='text'
                        onPointerDown={e =>
                        {
                            props.setExerciseIndex(props.index);
                            onReOrder(e, props.data.exercise_type);
                        }}
                    />
                    <Button icon={<EditOutlined />} type='link' onClick={() =>
                    {
                        props.setExerciseIndex(props.index);
                        props.setOpen(true);
                    }} />
                    <Button icon={<DeleteOutlined />} danger type='text' onClick={() => deleteExercise(props.index)} />
                </div>
            </section>
        </Form>
    );
}
