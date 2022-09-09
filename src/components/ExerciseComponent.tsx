import React, { RefObject, useEffect, useRef } from "react";

type ExerciseComponentProps = {
    id: string;
    identifier: RefObject<HTMLDivElement>;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;

};



export default function ExerciseComponent(props: ExerciseComponentProps)
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

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
    }, [domEl.current?.childElementCount]);

    return (
        <div
            ref={domEl}
            id={props.id}
            key={props.id}
            style={{ height: "90px", boxSizing: 'content-box' }}
            onMouseUp={props.onMouseUp}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseMove={props.onMouseMove}
        >
            {props.id}
        </div>
    );
}
