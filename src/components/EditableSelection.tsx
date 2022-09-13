import { Checkbox, Input, Radio } from "antd";
import { useCallback } from "react";

export type EditAbleSelection = {
    type: 'radio' | 'checkbox';
    value: any;
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

    return (
        <div className="eidtable-selection">
            <Input addonBefore={renderSelections()} />
        </div>
    );
}
