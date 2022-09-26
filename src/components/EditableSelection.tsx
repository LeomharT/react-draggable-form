import { CloseOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Radio } from "antd";
import React, { useCallback } from "react";

export type EditAbleSelection = {
    type: 'radio' | 'checkbox';
    value: any;
    label: string;
    onChange: (e: string) => void;
    onDelete: () => void;
};

export default function EditableSelection(props: EditAbleSelection)
{
    const { onChange } = props;

    const renderSelections = useCallback((): JSX.Element =>
    {
        switch (props.type)
        {
            case 'checkbox':
                return (
                    <Checkbox value={props.value} />
                );
            case 'radio':
            default:
                return (
                    <Radio value={props.value} />
                );
        }
    }, [props.type, props.value]);

    const alterLabel = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <Input.Group className="eidtable-selection" compact>
            <Input
                addonBefore={renderSelections()}
                defaultValue={props.label}
                onChange={alterLabel}
                placeholder='请输入选项内容'
                onFocus={e => e.target.select()}
            />
            <Button icon={<CloseOutlined />} type='text' onClick={() => props.onDelete()} />
        </Input.Group>
    );
}
