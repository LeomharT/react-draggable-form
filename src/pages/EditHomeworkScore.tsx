import { EllipsisOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormInstance, Input, Radio, Result, Space, Typography, Upload, UploadFile } from "antd";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ExerciseComponentType, HomeworkReply } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import { fetchExerciseDetail, getCourseSectionHomeworkDetail } from "../service/exercise";

const { TextArea } = Input;

const renderHomeworkItem = (data: ExerciseComponentType, homeworkDetail: HomeworkReply | null): JSX.Element =>
{
    const answer: any = homeworkDetail?.ExercisesReply;

    switch (data.exercise_type)
    {
        case ExerciseType.CHOICE: {
            const selection = data.exercise_selection;
            return (
                <Radio.Group value={answer}>
                    <Space direction='vertical'>
                        {
                            selection.map((v: any) =>
                            {
                                return (
                                    <Radio key={v.value} value={v.value}>{v.label}</Radio>
                                );
                            })
                        }
                    </Space>
                </Radio.Group>
            );
        }
        case ExerciseType.MULTICHOICE: {
            const selection = data.exercise_selection;
            return (
                <Checkbox.Group value={answer}>
                    <Space direction="vertical">
                        {
                            selection.map((v: any) =>
                            {
                                return (
                                    <Checkbox key={v.value} value={v.value}>{v.label}</Checkbox>
                                );
                            })
                        }
                    </Space>
                </Checkbox.Group>
            );
        }
        case ExerciseType.JUDGE: {
            return (
                <Radio.Group value={answer}>
                    <Space direction='vertical'>
                        <Radio value={'0'}>错误</Radio>
                        <Radio value={'1'}>正确</Radio>
                    </Space>
                </Radio.Group>
            );
        }
        case ExerciseType.UPLOAD: {
            const fileList: UploadFile[] = [];

            fileList.push({
                uid: answer,
                status: 'done',
                url: answer,
                name: answer,
            });
            return (
                <Upload
                    fileList={fileList}
                >
                </Upload>
            );
        }
        case ExerciseType.SHORTANSWER: {
            return (
                <TextArea value={answer} readOnly autoSize={{ minRows: 5 }}>

                </TextArea>
            );
        }
        case ExerciseType.BLANK:
        default: {
            return (
                <Input value={answer} readOnly />
            );
        }
    }
};

export default function EditHomeworkScore()
{
    const navigate = useNavigate();

    /** 路由状态 */
    const { homeworkId, schoolCourseSectionID, sectionName } = useLocation().state as any;

    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const [loading, setLoading] = useState<boolean>(true);

    /** 作业模板 */
    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);

    /** 作业内容 */
    const [homeworkDetail, setHomeworkDetail] = useState<HomeworkReply[]>([]);


    const getHomeworkDetail = useCallback(async (homeworkId: string) =>
    {
        const res = await getCourseSectionHomeworkDetail(homeworkId);

        setHomeworkDetail(res.result);

    }, [setHomeworkDetail]);


    const getExerciseDetail = useCallback(async (schoolCourseSectionId: string, homeworkId: string) =>
    {
        setLoading(true);

        if (homeworkId)
        {
            await getHomeworkDetail(homeworkId);
        }

        const exercise_data = await fetchExerciseDetail(schoolCourseSectionId);

        setExerciseData(exercise_data);

        setLoading(false);

    }, [setExerciseData, setLoading, getHomeworkDetail]);


    useEffect(() =>
    {
        if (!homeworkId || !schoolCourseSectionID) return;

        getExerciseDetail(schoolCourseSectionID, homeworkId);

    }, [homeworkId, schoolCourseSectionID]);


    /** 隐藏原始头部导航 */
    useEffect(() =>
    {
        const top = document.querySelector('#top') as HTMLDivElement;

        if (top)
        {
            top.style.display = 'none';
        }
        return () =>
        {
            if (top)
            {
                top.style.display = 'block';
            }
        };
    }, []);


    if (!homeworkId || !schoolCourseSectionID)
    {
        return (
            <Result
                status="404"
                title="404"
                subTitle="没有找到对应课程请关闭重试"
            />
        );
    }

    return (
        <div className="edit-homwork-score">
            <header>
                <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                <Button
                    type='primary'
                    disabled={!exerciseData.length}
                    onClick={() => formRef.current?.submit()}
                >
                    保存
                </Button>
                <div style={{ marginRight: 'auto' }}>
                    {sectionName}
                </div>
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate(-1)} />
            </header>
            <main>
                {exerciseData.map((v, index) =>
                {
                    return (
                        <section key={v.exercise_id} className="homework-item">
                            <header>
                                <div className="exercise-tags">
                                    <span>
                                        {v.exercise_type}
                                    </span>
                                    <span>
                                        {v.exercise_score.toString()}分
                                    </span>
                                </div>
                                <div className="exercise-titles">
                                    <Form.Item label={(index + 1).toString().padStart(2, '0')} >
                                        <Typography.Title level={5}>{v.exercise_title}</Typography.Title>
                                    </Form.Item>
                                </div>
                            </header>
                            {renderHomeworkItem(v, homeworkDetail[index])}
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
