import { RefObject, useEffect, useRef } from "react";
import { ExerciseType } from "../app/app-context";

type ExerciseComponentProps = {
    id: string;
    identifier: RefObject<HTMLDivElement>;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent, id: string) => void;
};

export type ExerciseComponentType = {
    id: string;
    type: ExerciseType;
    request: boolean;
    title: string;
    score: number;

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
            key={props.id}
            style={{ height: "90px" }}
            onMouseUp={e =>
            {
                props.onMouseUp(e, props.id);
            }}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        >
            {props.id}
        </div>
    );
}
