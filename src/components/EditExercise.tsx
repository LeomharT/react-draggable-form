import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch } from "antd";
import { FormInstance } from "antd/es/form/Form";
import React, { Dispatch, RefObject, useCallback, useRef } from "react";
import { ExerciseComponentType } from "../@types/ExerciseComponentTypes";

export type EditExerciseProps = {
    open: boolean;
    currentExerciseData: ExerciseComponentType,
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    updateExerciseDetailData: (value: any, index: number, field: keyof ExerciseComponentType) => void;
};

const { Option } = Select;

export default function EditExercise(props: EditExerciseProps)
{

    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const { currentExerciseData, updateExerciseDetailData } = props;

    const onSubmit = useCallback((e: any) =>
    {
        console.log(e);
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
            <Form onFinish={onSubmit} ref={formRef} layout='vertical'>
                <Form.Item
                    label="习题ID"
                    name='exercise_id'
                    initialValue={props.currentExerciseData.exercise_id}>
                    <Input disabled />
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
                >
                    <Select>
                        <Option value="1">A</Option>
                        <Option value="2">B</Option>
                        <Option value="3">C</Option>
                        <Option value="4">D</Option>
                    </Select>
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
