import { Checkbox, Input, Radio } from "antd";
import React, { useCallback } from "react";

export type EditAbleSelection = {
    type: 'radio' | 'checkbox';
    value: any;
    label: string;
    onChange: (e: string) => void;
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
        <div className="eidtable-selection">
            <Input
                addonBefore={renderSelections()}
                defaultValue={props.label}
                onChange={alterLabel}
                placeholder='请输入选项内容'
            />
        </div>
    );
}
