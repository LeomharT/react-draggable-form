import { Button } from "antd";
import { Dispatch, ForwardedRef, forwardRef, SetStateAction, useEffect, useImperativeHandle, useState } from "react";
import { ExerciseComponentType } from "../@types/exercise-types";

export type TocProps = {
    exerciseData: ExerciseComponentType[];
};

export type TocForwardRef = {
    setCurrentId: Dispatch<SetStateAction<string>>;
};

/** 不是通用组件!!!🤡 */
const Toc = forwardRef<TocForwardRef, TocProps>((props: TocProps, ref: ForwardedRef<TocForwardRef>) =>
{
    const { exerciseData } = props;

    /** 当前锚点 */
    const [currentId, setCurrentId] = useState<string>('');

    useImperativeHandle(ref, () =>
    {
        return ({
            setCurrentId
        });
    }, [setCurrentId]);

    useEffect(() =>
    {
        if (!exerciseData.length) return;

        if (currentId === '')
        {
            setCurrentId(exerciseData[0].exercise_id);
        }

    }, [setCurrentId, exerciseData.length, currentId, exerciseData]);

    return (
        <aside className='toc-side-navi'>
            <p style={{ fontWeight: "bold", marginLeft: "18px" }}>TOC</p>
            <ul>
                {
                    props.exerciseData.map(v =>
                        <li key={v.exercise_id}>
                            <Button
                                type={v.exercise_id === currentId ? 'link' : 'text'}
                                href={`#${v.exercise_id}`}
                                data-current={v.exercise_id === currentId}
                                onClick={() =>
                                {
                                    setCurrentId(v.exercise_id);
                                }}>
                                {v.exercise_title}
                            </Button>
                        </li>
                    )
                }
            </ul>
        </aside>
    );
});


export default Toc;
