import { Input, InputProps, InputRef } from "antd";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

export interface EditAbleTextProps extends InputProps
{

}
export default function EditAbleText(props: EditAbleTextProps)
{
    const [active, setActive] = useState<boolean>(false);

    const inputRef: RefObject<InputRef> = useRef<InputRef>(null);

    const [value, setValue] = useState<string | null>(null);

    const { lineHeight, fontSize } = useMemo(() =>
    {
        switch (props.size)
        {
            case 'small':
                return { fontSize: '14px', lineHeight: '24px' };
            case 'large':
                return { fontSize: '16px', lineHeight: '40px' };
            case 'middle':
            default:
                return { fontSize: '14', lineHeight: '32px' };
        }
    }, [props.size]);


    useEffect(() =>
    {
        console.log(props);
        setTimeout(() =>
        {
            if (inputRef.current)
            {
                inputRef.current.focus();
                inputRef.current.select();
            }
        });

    }, [active]);

    return (
        <div
            className="editable-text"
            onPointerDown={e => setActive(true)}
        >
            <span style={{
                lineHeight,
                fontSize,
                position: active ? 'absolute' : 'relative',
            }}>
                {value ?? props.placeholder}
            </span>
            {
                active && <Input
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
                    }}
                    onBlur={e =>
                    {
                        setActive(false);
                        if (props.onBlur)
                        {
                            props.onBlur(e);
                        }
                    }} />
            }
        </div>
    );
}
