import { Input } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { TextAreaRef } from "antd/lib/input/TextArea";
import { RefObject, useRef, useState } from "react";

export interface EditAbleTextProps extends TextAreaProps
{

}

const { TextArea } = Input;
export default function EditAbleText(props: EditAbleTextProps)
{
    const inputRef: RefObject<TextAreaRef> = useRef<TextAreaRef>(null);

    const [value, setValue] = useState<string | null>(null);

    return (
        <div
            className="editable-text"
            onPointerDown={e =>
            {
                setTimeout(() =>
                {
                    if (inputRef.current)
                    {
                        inputRef.current.focus();
                    }
                });
            }}
        >
            {
                <TextArea
                    {...props}
                    ref={inputRef}
                    value={value ?? ''}
                    onChange={e =>
                    {
                        if (props.onChange)
                        {
                            //@ts-ignore
                            props.onChange(e.target.value);
                        }
                        setValue(e.target.value);
                    }} />
            }
        </div>
    );
}
