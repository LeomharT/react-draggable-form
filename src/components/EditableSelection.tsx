import { Checkbox, Input, Radio } from "antd";
import React, { useCallback } from "react";

export type EditAbleSelection = {
    type: 'radio' | 'checkbox';
    value: any;
    label: string;
};

export default function EditableSelection(props: EditAbleSelection)
{
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
        console.log(e.target.value);
        props.value = e.target.value;
    }, []);

    return (
        <div className="eidtable-selection">
            <Input addonBefore={renderSelections()} value={props.label} onChange={alterLabel} />
        </div>
    );
}
