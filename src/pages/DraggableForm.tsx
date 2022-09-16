import { EllipsisOutlined, SearchOutlined, ShareAltOutlined, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExerciseComponentType, ExerciseDetailData, IResponse } from '../@types/ExerciseComponentTypes';
import AppContext, { ExerciseType } from '../app/app-context';
import EditExercise from '../components/EditExercise';
import ExerciseComponent, { defalutSelection } from '../components/ExerciseComponent';
import FormComponents from '../components/FormComponents';
import useDebounce from '../hooks/useDebounce';
import { fetchExeriseDetail, postExerseDetail } from '../service/exercise';

const submitExerciseDetailData = async (params: ExerciseComponentType[]) =>
{
    const body: ExerciseDetailData = {
        login_name: '350000_admin',
        school_course_id: 472,
        school_course_sectionId: 5116,
        data: params
    };

    const res = await postExerseDetail(body) as IResponse<any>;

    if (res.msg === 'success')
    {
        message.success('保存成功');
    } else
    {
        message.error('操作失败！请稍后重试');
    }
};

export default function DraggableForm()
{
    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);


    /** 当前锚点 */
    const [currentId, setCurrentId] = useState<string>('');


    const { dragging, dragType } = useContext(AppContext);


    /** 是否在列表头部插入 */
    const [isBefore, setIsBefore] = useState<boolean>(false);


    const [open, setOpen] = useState<boolean>(false);


    /** 传给抽屉的数据 */
    const [exerciseIndex, setExerciseIndex] = useState<number>(0);


    const [pendding, setPendding] = useState<boolean>(false);


    const newComponent = useCallback((type = dragType.current) =>
    {
        const id = uuidv4().substring(0, 8);
        let selection;
        let answer = '';
        if (type === ExerciseType.CHOICE || type === ExerciseType.MULTICHOICE)
        {
            selection = defalutSelection;
            answer = '0';
        }
        if (type === ExerciseType.JUDGE)
        {
            answer = '0';
        }
        const newComponent: ExerciseComponentType = {
            exercise_id: id,
            exercise_answer: answer,
            exercise_description: '',
            exercise_score: 1,
            exercise_selection: selection ?? '',
            exercise_title: '请输入题目',
            exercise_type: type,
            required: false
        };

        return newComponent;
    }, [dragType]);


    const identifier: RefObject<HTMLDivElement> = useRef<HTMLDivElement>((() =>
    {
        const identifier = document.createElement('div');
        identifier.classList.add('position-identifier');
        identifier.appendChild(document.createElement('div'));

        return identifier;
    })());


    /** 切换锚点 */
    const switchAnchor = useDebounce((e: React.UIEvent) =>
    {
        const main_el = e.target as HTMLDivElement;

        const scroll_top = main_el.scrollTop;

        let id = '';

        for (let i = 0; i < exerciseData.length; i++)
        {
            const el = document.getElementById(exerciseData[i].exercise_id) as HTMLDivElement;

            //减头部 减滚动条高度
            const offect = el.offsetTop - scroll_top - 60;

            if (offect <= 0) id = exerciseData[i].exercise_id;
        }

        //滚到底不触发
        if (!(scroll_top + main_el.clientHeight === main_el.scrollHeight)) setCurrentId(id);

    }, 200);


    /** 添加定位 */
    const positionIdentifier = useCallback((e: React.MouseEvent) =>
    {
        const target = e.currentTarget as HTMLDivElement;
        target.appendChild(identifier.current as HTMLElement);
        target.style.marginBottom = "40px";
    }, []);


    /** 清除定位 */
    const clearIdentifier = useCallback((e: React.MouseEvent) =>
    {
        e.stopPropagation();
        const target = (e.currentTarget as HTMLPreElement);
        target.style.marginBottom = '0px';

        if (target.style.paddingTop === '40px')
        {
            target.style.paddingTop = '0px';
        }

        if (target.contains(identifier.current))
        {
            target.removeChild(identifier.current as HTMLElement);
        }
    }, []);


    /** 插入新组件 */
    const insertNewComponent = useCallback((e: React.MouseEvent, index: number, type: ExerciseType, isBefore: boolean) =>
    {
        e.stopPropagation();

        clearIdentifier(e);

        const new_component = newComponent(type);

        setExerciseData(prve =>
        {
            const before: ExerciseComponentType[] = [];
            const after: ExerciseComponentType[] = [];

            for (let i = 0; i < prve.length; i++)
            {
                if (i <= index) before.push(prve[i]);
                else after.push(prve[i]);
            }

            if (isBefore)
            {
                setIsBefore(false);

                return [new_component, ...prve];
            }
            return [...before, new_component, ...after];
        });

        setTimeout(() =>
        {
            const el = document.getElementById(new_component.exercise_id);

            el?.scrollIntoView();
        }, 200);

    }, [setIsBefore, clearIdentifier, newComponent]);


    /** 如果想在头部插入 */
    const insertBefore = useCallback((e: React.MouseEvent) =>
    {
        const target = e.currentTarget as HTMLDivElement;

        if ((e.pageY - 60) < (target.clientHeight / 2))
        {
            setIsBefore(true);
            target.style.paddingTop = "40px";
            target.style.marginBottom = "0px";
            if (target.contains(identifier.current))
            {
                target.removeChild(identifier.current as HTMLElement);
            }
        } else
        {
            setIsBefore(false);
            target.style.paddingTop = "0px";
            positionIdentifier(e);
        }
    }, [positionIdentifier]);


    /** 添加新组件 */
    const appendNewComponent = useCallback((e: React.MouseEvent, type: ExerciseType) =>
    {
        e.stopPropagation();
        setExerciseData(prve => [...prve, newComponent(type)]);
    }, [setExerciseData, newComponent]);


    /** 更新题目 */
    const updateExerciseDetailData = useCallback((value: any, index: number, field: keyof ExerciseComponentType) =>
    {
        setExerciseData(prve =>
        {
            const data = prve[index];

            prve[index] = {
                ...data,
                [field]: value
            };
            return [...prve];
        });
    }, [setExerciseData]);


    /** 删除题目 */
    const deleteExercise = useCallback((index: number) =>
    {
        setExerciseData(prve =>
        {
            return [...prve.slice(0, index), ...prve.slice(index + 1)];
        });
    }, [setExerciseData]);


    useEffect(() =>
    {

        fetchExeriseDetail().then(data =>
        {
            setCurrentId(data[0].exercise_id);
            setExerciseData(data);
        });

    }, [setCurrentId]);

    return (
        <div className="draggable-form">
            <FormComponents />
            <div className='exercise-area' >
                <header>
                    <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                    <Button
                        type='primary'
                        loading={pendding}
                        onClick={async () =>
                        {
                            setPendding(true);
                            await submitExerciseDetailData(exerciseData);
                            setPendding(false);
                        }
                        }>
                        保存
                    </Button>
                    {
                        [
                            <ShareAltOutlined />,
                            <UserAddOutlined />,
                            <StarOutlined />,
                            <SearchOutlined />,
                        ].map((v, index) => <Button icon={v} key={index} type='text' />)
                    }
                    <div style={{ marginRight: 'auto' }}>
                        XXX课程
                    </div>
                </header>
                <main onScroll={switchAnchor}>
                    <div onMouseUp={e =>
                    {
                        if (!dragging) return;

                        appendNewComponent(e, dragType.current);
                    }}>
                        {
                            exerciseData.map((v, index, arr) =>
                                <ExerciseComponent
                                    id={v.exercise_id}
                                    key={v.exercise_id}
                                    data={v}
                                    index={index}
                                    identifier={identifier}
                                    setOpen={setOpen}
                                    deleteExercise={deleteExercise}
                                    updateExerciseDetailData={updateExerciseDetailData}
                                    setExerciseIndex={setExerciseIndex}
                                    onMouseEnter={e =>
                                    {
                                        if (!dragging) return;
                                        positionIdentifier(e);
                                        e.stopPropagation();
                                    }}
                                    onMouseLeave={e =>
                                    {
                                        if (!dragging) return;
                                        clearIdentifier(e);
                                    }}
                                    onMouseUp={e =>
                                    {
                                        if (!dragging) return;
                                        insertNewComponent(e, index, dragType.current, isBefore);
                                    }}
                                    onMouseMove={e =>
                                    {
                                        if (!dragging) return;
                                        if (arr.indexOf(v) !== 0) return;
                                        insertBefore(e);
                                    }}
                                />
                            )
                        }
                    </div>
                    <aside className='side-navi'>
                        <p style={{ fontWeight: "bold", marginLeft: "18px" }}>TOC</p>
                        <ul>
                            {
                                exerciseData.map(v =>
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
                </main>
            </div>
            <EditExercise
                open={open}
                currentExerciseData={exerciseData[exerciseIndex] ?? {}}
                exerciseIndex={exerciseIndex}
                setOpen={setOpen}
                updateExerciseDetailData={updateExerciseDetailData}
            />
        </div >
    );
}
