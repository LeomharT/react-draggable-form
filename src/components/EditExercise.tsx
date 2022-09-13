import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch } from "antd";
import { FormInstance } from "antd/es/form/Form";
import React, { Dispatch, RefObject, useCallback, useRef } from "react";

export type EditExerciseProps = {
    data?: any;
    open: boolean;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
};

const { Option } = Select;

export default function EditExercise(props: EditExerciseProps)
{

    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const onSubmit = useCallback((e: any) =>
    {

    }, []);

    return (
        <Drawer
            title="XXX"
            mask={false}
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
                <Form.Item label="习题ID" style={{ letterSpacing: 2 }}>
                    <Input disabled />
                </Form.Item>
                <Form.Item label="题目" style={{ letterSpacing: 4 }}>
                    <Input />
                </Form.Item>
                <Form.Item label="题目分值">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="正确答案">
                    <Select>
                        <Option value="1">A</Option>
                        <Option value="2">B</Option>
                        <Option value="3">C</Option>
                        <Option value="4">D</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="是否必填">
                    <Switch />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
