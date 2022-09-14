import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch } from "antd";
import { FormInstance } from "antd/es/form/Form";
import React, { Dispatch, RefObject, useCallback, useRef } from "react";
import { ExerciseComponentType } from "../@types/ExerciseComponentTypes";
import { ExerciseType } from "../app/app-context";

export type EditExerciseProps = {
    open: boolean;
    currentExerciseData: ExerciseComponentType,
    exerciseIndex: number;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    updateExerciseDetailData: (value: any, index: number, field: keyof ExerciseComponentType) => void;
};

const { Option } = Select;

const renderAnswerSelections = (props: ExerciseComponentType): JSX.Element =>
{
    if (props.exercise_type === ExerciseType.CHOICE)
    {
        return (
            <Select>
                {props.exercise_selection.map((v: any) => <Option key={v.value} value={v.value}>{v.label}</Option>)}
            </Select>
        );
    }
    if (props.exercise_type === ExerciseType.MULTICHOICE)
    {
        return (

            <Select mode="multiple" allowClear>
                {props.exercise_selection.map((v: any) => <Option key={v.value} value={v.value}>{v.label}</Option>)}
            </Select>
        );
    }
    return <Input />;
};

export default function EditExercise(props: EditExerciseProps)
{
    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const { currentExerciseData, updateExerciseDetailData } = props;

    const onSubmit = useCallback((data: Partial<ExerciseComponentType>, index: number, type: ExerciseType) =>
    {
        if (type === ExerciseType.MULTICHOICE)
        {
            //@ts-ignore
            data.exercise_answer = (data.exercise_answer).join(',');
        }
        for (const i in data)
        {
            // @ts-ignore
            updateExerciseDetailData(data[i], index, i);
        }
    }, []);


    return (
        <Drawer
            className="edit-exercise"
            destroyOnClose
            mask={false}
            title={currentExerciseData.exercise_title}
            placement="right"
            onClose={() => props.setOpen(false)}
            open={props.open}
            extra={
                <Space>
                    <Button onClick={() => props.setOpen(false)}>取消</Button>
                    <Button type="primary" htmlType="submit" onClick={() => formRef.current?.submit()}>确定</Button>
                </Space>
            }
        >
            <Form onFinish={e =>
            {
                onSubmit(e, props.exerciseIndex, props.currentExerciseData.exercise_type);
            }} ref={formRef} layout='vertical'>
                <Form.Item
                    label="习题ID"
                    name='exercise_id'
                    initialValue={props.currentExerciseData.exercise_id}>
                    <Input readOnly />
                </Form.Item>
                <Form.Item
                    label="题目"
                    name='exercise_title'
                    initialValue={props.currentExerciseData.exercise_title}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="题目分值"
                    name='exercise_score'
                    initialValue={props.currentExerciseData.exercise_score}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="正确答案"
                    name='exercise_answer'
                    initialValue={(() =>
                    {
                        if (props.currentExerciseData.exercise_type === ExerciseType.MULTICHOICE)
                        {
                            return props.currentExerciseData.exercise_answer.split(',');
                        }
                        return props.currentExerciseData.exercise_answer;
                    })()}
                >
                    {renderAnswerSelections(props.currentExerciseData)}
                </Form.Item>
                <Form.Item
                    label="是否必填"
                    name='required'
                    initialValue={Boolean(props.currentExerciseData.required)}
                >
                    <Switch defaultChecked={props.currentExerciseData.required} />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
